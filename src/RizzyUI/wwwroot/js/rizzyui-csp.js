import Alpine from '@alpinejs/csp';
import collapse from '@alpinejs/collapse';
import intersect from '@alpinejs/intersect';
import focus from '@alpinejs/focus';
import { ValidationService } from "./vendor/aspnet-validation/aspnet-validation";
import registerComponents from './alpine/components.js';

// Set up ASP.NET validation
let validationService = new ValidationService();
validationService.bootstrap({ watch: true });
window.validation = validationService;

// Register Alpine.js extensions
Alpine.plugin(collapse);
Alpine.plugin(intersect);
Alpine.plugin(focus)
registerComponents(Alpine);

window.Alpine = Alpine

Alpine.start()

console.log("Rizzy UI Loaded");

