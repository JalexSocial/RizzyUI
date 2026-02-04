
/**
 * @file RizzyUI CSP-Compliant Entry Point
 * @module rizzyui-csp
 */
import Alpine from '@alpinejs/csp';
import { bootstrapRizzyUI } from './lib/bootstrap.js';

const RizzyUI = bootstrapRizzyUI(Alpine);

Alpine.start();

export default RizzyUI;