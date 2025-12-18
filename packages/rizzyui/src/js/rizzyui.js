
/**
 * @file RizzyUI Standard Entry Point
 * @module rizzyui
 */
import Alpine from 'alpinejs';
import { bootstrapRizzyUI } from './lib/bootstrap.js';

const RizzyUI = bootstrapRizzyUI(Alpine);

Alpine.start();

export default RizzyUI;