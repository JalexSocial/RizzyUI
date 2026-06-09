import { createCloseIcon, resolveToastIcon } from './rzToastIcons.js';

const slotAttributes = {
    toast: 'toast',
    innerContainer: 'toast-inner-container',
    iconContainer: 'toast-icon-container',
    iconPulse: 'toast-icon-pulse',
    loadingIndicator: 'toast-loading-indicator',
    contentContainer: 'toast-content-container',
    title: 'toast-title',
    description: 'toast-description',
    actionContainer: 'toast-action-container',
    actionButton: 'toast-action-button',
    closeButton: 'toast-close-button',
    closeButtonIcon: 'toast-close-button-icon',
    progressTrack: 'toast-progress-track',
    progressIndicator: 'toast-progress-indicator',
};

function appendClass(list, value) {
    if (Array.isArray(value)) {
        value.forEach(item => appendClass(list, item));
        return;
    }

    if (typeof value === 'string' && value.trim()) {
        list.push(value.trim());
    }
}

export function dedupeClasses(...values) {
    const rawClasses = [];
    const classes = [];
    const seen = new Set();

    values.forEach(value => appendClass(rawClasses, value));

    rawClasses.join(' ').split(/\s+/).forEach(token => {
        if (!token || seen.has(token)) {
            return;
        }

        seen.add(token);
        classes.push(token);
    });

    return classes.join(' ');
}

function getSlotClass(map, slot) {
    return map && typeof map[slot] === 'string' ? map[slot] : '';
}

export function composeToastClass(classMap, toast, slot) {
    const options = toast.options;
    return dedupeClasses(
        getSlotClass(classMap.slots, slot),
        getSlotClass(classMap.positions?.[options.position], slot),
        getSlotClass(classMap.statuses?.[options.status], slot),
        getSlotClass(classMap.tones?.[options.tone], slot),
        getSlotClass(classMap.animations?.[options.animation], slot),
        getSlotClass(classMap.states?.[toast.state || 'visible'], slot),
        options.classNames?.[slot]
    );
}

function setSlotClass(element, toast, classMap, slot) {
    const className = composeToastClass(classMap, toast, slot);
    if (className) {
        element.className = className;
    } else {
        element.removeAttribute('class');
    }
}

function createSlotElement(tagName, slot) {
    const element = document.createElement(tagName);
    element.dataset.slot = slotAttributes[slot];
    return element;
}

function renderTextSlot(parent, tagName, slot, text, toast, classMap) {
    if (text === null || text === undefined || text === '') {
        return null;
    }

    const element = createSlotElement(tagName, slot);
    element.textContent = text;
    setSlotClass(element, toast, classMap, slot);
    parent.appendChild(element);
    return element;
}

function createIconContainer(toast, classMap) {
    if (!toast.options.showIcon || toast.options.icon === false) {
        return null;
    }

    const iconContainer = createSlotElement('div', 'iconContainer');
    iconContainer.setAttribute('aria-hidden', 'true');
    setSlotClass(iconContainer, toast, classMap, 'iconContainer');

    if (toast.options.status === 'loading') {
        const loading = createSlotElement('span', 'loadingIndicator');
        setSlotClass(loading, toast, classMap, 'loadingIndicator');
        iconContainer.appendChild(loading);
        return iconContainer;
    }

    const icon = resolveToastIcon(toast);
    if (!icon) {
        return null;
    }

    const pulse = createSlotElement('span', 'iconPulse');
    setSlotClass(pulse, toast, classMap, 'iconPulse');
    iconContainer.appendChild(pulse);
    iconContainer.appendChild(icon);

    return iconContainer;
}

function createAction(toast, classMap) {
    const action = toast.options.action;
    if (!action || !action.label) {
        return null;
    }

    const actionContainer = createSlotElement('div', 'actionContainer');
    const actionButton = createSlotElement('button', 'actionButton');
    actionButton.type = 'button';
    actionButton.textContent = action.label;
    setSlotClass(actionContainer, toast, classMap, 'actionContainer');
    setSlotClass(actionButton, toast, classMap, 'actionButton');
    actionContainer.appendChild(actionButton);
    return actionContainer;
}

function createCloseButton(toast, classMap) {
    if (!toast.options.dismissible) {
        return null;
    }

    const button = createSlotElement('button', 'closeButton');
    button.type = 'button';
    button.setAttribute('aria-label', toast.options.closeButtonAriaLabel);
    setSlotClass(button, toast, classMap, 'closeButton');

    const icon = createCloseIcon();
    icon.dataset.slot = slotAttributes.closeButtonIcon;
    const iconClass = composeToastClass(classMap, toast, 'closeButtonIcon');
    if (iconClass) {
        icon.setAttribute('class', iconClass);
    }

    button.appendChild(icon);
    return button;
}

function createProgress(toast, classMap) {
    if (!toast.options.progress || !toast.options.autoclose || toast.options.duration <= 0) {
        return null;
    }

    const track = createSlotElement('div', 'progressTrack');
    const indicator = createSlotElement('div', 'progressIndicator');
    setSlotClass(track, toast, classMap, 'progressTrack');
    setSlotClass(indicator, toast, classMap, 'progressIndicator');
    indicator.style.transform = 'scaleX(1)';
    indicator.style.transitionDuration = `${toast.remaining}ms`;
    track.appendChild(indicator);
    return track;
}

export function createToastDom(toast, classMap) {
    const root = createSlotElement('div', 'toast');
    root.dataset.rzToastItem = '';
    root.dataset.toastId = toast.id;
    root.dataset.toastStatus = toast.options.status;
    root.setAttribute('role', toast.options.role);
    root.setAttribute('aria-live', toast.options.ariaLive);
    root.setAttribute('aria-atomic', 'true');
    setSlotClass(root, toast, classMap, 'toast');

    const inner = createSlotElement('div', 'innerContainer');
    setSlotClass(inner, toast, classMap, 'innerContainer');
    root.appendChild(inner);

    const iconContainer = createIconContainer(toast, classMap);
    if (iconContainer) {
        inner.appendChild(iconContainer);
    }

    const content = createSlotElement('div', 'contentContainer');
    setSlotClass(content, toast, classMap, 'contentContainer');
    inner.appendChild(content);

    renderTextSlot(content, 'div', 'title', toast.options.title, toast, classMap);
    renderTextSlot(content, 'div', 'description', toast.options.text, toast, classMap);
    if (typeof HTMLElement !== 'undefined' && toast.options.html instanceof HTMLElement) {
        content.appendChild(toast.options.html.cloneNode(true));
    }

    const action = createAction(toast, classMap);
    if (action) {
        content.appendChild(action);
    }

    const closeButton = createCloseButton(toast, classMap);
    if (closeButton) {
        inner.appendChild(closeButton);
    }

    const progress = createProgress(toast, classMap);
    if (progress) {
        root.appendChild(progress);
    }

    toast.elements = { root };
    return root;
}

export function updateToastDom(toast, classMap) {
    if (!toast.elements?.root) {
        return createToastDom(toast, classMap);
    }

    const previousRoot = toast.elements.root;
    const parent = previousRoot.parentElement;
    const replacement = createToastDom(toast, classMap);
    if (parent) {
        parent.replaceChild(replacement, previousRoot);
    }

    return replacement;
}

export function applyToastClasses(element, toast, classMap) {
    setSlotClass(element, toast, classMap, 'toast');
    element.dataset.toastStatus = toast.options.status;
    element.setAttribute('role', toast.options.role);
    element.setAttribute('aria-live', toast.options.ariaLive);
}
