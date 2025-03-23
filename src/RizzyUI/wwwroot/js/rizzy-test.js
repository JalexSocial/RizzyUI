import Alpine from 'alpinejs'
import collapse from '@alpinejs/collapse'
import intersect from '@alpinejs/intersect'
import focus from '@alpinejs/focus'
import aspnetValidation from "./vendor/aspnet-validation/aspnet-validation";
import './alpine/components.js';

// Set up ASP.NET validation
let v = new aspnetValidation.ValidationService();
v.bootstrap({ watch: true });
window.validation = v;

// Set up Alpine.js
window.Alpine = Alpine

Alpine.plugin(collapse);
Alpine.plugin(intersect);
Alpine.plugin(focus)

Alpine.start()

console.log("Rizzy UI Loaded");