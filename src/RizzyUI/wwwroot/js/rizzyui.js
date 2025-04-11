import Alpine from 'alpinejs';
import collapse from '@alpinejs/collapse';
import intersect from '@alpinejs/intersect';
import focus from '@alpinejs/focus';
import toast from "./vendor/notify/toast";

import { registerComponents, require } from './alpine/components.js';

// Register Alpine.js extensions
Alpine.plugin(collapse);
Alpine.plugin(intersect);
Alpine.plugin(focus)
registerComponents(Alpine);

const RizzyUI = {
    Alpine,
    require,
    toast,
}

window.Alpine = Alpine
window.Rizzy = { ...(window.Rizzy || {}), RizzyUI };

Alpine.start()

export default RizzyUI;
