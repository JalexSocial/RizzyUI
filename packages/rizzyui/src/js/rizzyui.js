import Alpine from 'alpinejs';
import { bootstrapRizzyUI } from './lib/bootstrap.js';

const RizzyUI = bootstrapRizzyUI(Alpine);

RizzyUI.ready
    .then(() => {
        Alpine.start();
    })
    .catch(error => {
        console.error('[RizzyUI] Failed to initialize runtime.', error);
    });

export default RizzyUI;
