import { ValidationService } from 'aspnet-client-validation';

let validation;

export function ensureValidationRuntime() {
    if (!validation) {
        validation = new ValidationService();
        validation.bootstrap({ watch: true });
    }

    return validation;
}
