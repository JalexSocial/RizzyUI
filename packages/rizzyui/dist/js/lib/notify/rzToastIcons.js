const svgNamespace = 'http://www.w3.org/2000/svg';

function createSvg(viewBox = '0 0 24 24') {
    const svg = document.createElementNS(svgNamespace, 'svg');
    svg.setAttribute('viewBox', viewBox);
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    return svg;
}

function appendPath(svg, d) {
    const path = document.createElementNS(svgNamespace, 'path');
    path.setAttribute('d', d);
    svg.appendChild(path);
}

function appendCircle(svg, cx, cy, r) {
    const circle = document.createElementNS(svgNamespace, 'circle');
    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', cy);
    circle.setAttribute('r', r);
    svg.appendChild(circle);
}

export function createCloseIcon() {
    const svg = createSvg();
    appendPath(svg, 'M18 6 6 18');
    appendPath(svg, 'm6 6 12 12');
    return svg;
}

export function createStatusIcon(status) {
    if (status === 'default') {
        return null;
    }

    if (status === 'loading') {
        return document.createElement('span');
    }

    const svg = createSvg();

    if (status === 'success') {
        appendCircle(svg, '12', '12', '10');
        appendPath(svg, 'm9 12 2 2 4-4');
        return svg;
    }

    if (status === 'warning') {
        appendPath(svg, 'M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z');
        appendPath(svg, 'M12 9v4');
        appendPath(svg, 'M12 17h.01');
        return svg;
    }

    if (status === 'error') {
        appendCircle(svg, '12', '12', '10');
        appendPath(svg, 'm15 9-6 6');
        appendPath(svg, 'm9 9 6 6');
        return svg;
    }

    appendCircle(svg, '12', '12', '10');
    appendPath(svg, 'M12 16v-4');
    appendPath(svg, 'M12 8h.01');
    return svg;
}

export function resolveToastIcon(toast) {
    if (toast.options.icon === false) {
        return null;
    }

    if (typeof HTMLElement !== 'undefined' && toast.options.customIcon instanceof HTMLElement) {
        return toast.options.customIcon.cloneNode(true);
    }

    if (typeof HTMLElement !== 'undefined' && toast.options.icon instanceof HTMLElement) {
        return toast.options.icon.cloneNode(true);
    }

    return createStatusIcon(toast.options.status);
}
