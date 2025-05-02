import Alpine from 'alpinejs';
import collapse from '@alpinejs/collapse';
import intersect from '@alpinejs/intersect';
import focus from '@alpinejs/focus';
import toast from "./lib/notify/toast";
import { registerComponents, require } from './lib/components.js';
import $data from './lib/alpineData.js';

// Register Alpine.js extensions
Alpine.plugin(collapse);
Alpine.plugin(intersect);
Alpine.plugin(focus)
registerComponents(Alpine);

const RizzyUI = {
    Alpine,
    require,
    toast,
    $data
}

window.Alpine = Alpine
window.Rizzy = { ...(window.Rizzy || {}), ...RizzyUI };

Alpine.start()

export default RizzyUI;
