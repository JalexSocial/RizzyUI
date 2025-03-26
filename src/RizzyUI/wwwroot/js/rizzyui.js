import Alpine from 'alpinejs';
import collapse from '@alpinejs/collapse';
import intersect from '@alpinejs/intersect';
import focus from '@alpinejs/focus';
import registerComponents from './alpine/components.js';

// Register Alpine.js extensions
Alpine.plugin(collapse);
Alpine.plugin(intersect);
Alpine.plugin(focus)
registerComponents(Alpine);

window.Alpine = Alpine

Alpine.start()
