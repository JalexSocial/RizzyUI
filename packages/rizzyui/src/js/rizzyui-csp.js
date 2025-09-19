
    import Alpine from '@alpinejs/csp';
    import collapse from '@alpinejs/collapse';
    import intersect from '@alpinejs/intersect';
    import focus from '@alpinejs/focus';
    import toast from "./lib/notify/toast";
    import { registerComponents, require } from './lib/components.js';
    import $data from './lib/alpineData.js';
    import { registerRizzyDirectives } from './lib/alpine-bridge.js';
    import registerMobileDirective from './lib/directives/mobile.js';
    import registerSyncDirective from './lib/directives/sync-prop.js'

    // Register Alpine.js extensions
    Alpine.plugin(collapse);
    Alpine.plugin(intersect);
    Alpine.plugin(focus);
    registerComponents(Alpine);
    registerRizzyDirectives(Alpine);
    registerMobileDirective(Alpine);
    registerSyncDirective(Alpine);

    const RizzyUI = {
        Alpine,
        require,
        toast,
        $data
    }

    window.Alpine = Alpine;
    window.Rizzy = { ...(window.Rizzy || {}), ...RizzyUI };

    Alpine.start()

    export default RizzyUI;