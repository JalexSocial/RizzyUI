let validationPromise;

function initializeValidation() {
    if (!validationPromise) {
        validationPromise = import('../../runtime/validationRuntime.js').then(module => module.ensureValidationRuntime());
    }

    return validationPromise;
}

export default function registerValidateDirective(Alpine, onReady) {
    Alpine.directive('validate', (el, _binding, { cleanup }) => {
        let active = true;

        initializeValidation().then(validation => {
            if (!active) {
                return;
            }

            if (typeof onReady === 'function') {
                onReady(validation);
            }
        }).catch(error => {
            console.error('[RizzyUI] Failed to initialize validation runtime.', error);
        });

        cleanup(() => {
            active = false;
        });
    });
}

export { initializeValidation };
