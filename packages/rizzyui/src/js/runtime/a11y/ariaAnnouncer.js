export {
  announce,
  ensureLiveRegions,
  clearLiveRegions,
  getAnnouncementHistory,
  clearAnnouncementHistory,
  destroyLiveAnnouncer,
} from './liveAnnouncer.js';

export function createAriaAnnouncer() {
  return {
    announce,
    ensureLiveRegions,
    clearLiveRegions,
    getAnnouncementHistory,
    clearAnnouncementHistory,
    destroy: destroyLiveAnnouncer,
  };
}

import {
  announce,
  ensureLiveRegions,
  clearLiveRegions,
  getAnnouncementHistory,
  clearAnnouncementHistory,
  destroyLiveAnnouncer,
} from './liveAnnouncer.js';
