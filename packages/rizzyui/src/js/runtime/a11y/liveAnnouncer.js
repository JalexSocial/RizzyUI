const LIVE_REGION_IDS = {
  polite: 'rz-live-announcer-polite',
  assertive: 'rz-live-announcer-assertive',
};

const DEFAULTS = {
  dedupeWindowMs: 1500,
  clearDelayMs: 1000,
  politeIntervalMs: 120,
  historyLimit: 100,
};

let liveRegions = { polite: null, assertive: null };
let politeQueue = [];
let politeTimer = null;
let lastAnnouncement = null;
let announcementHistory = [];

function getDocument() {
  if (typeof document === 'undefined') {
    return null;
  }

  return document;
}

function normalizeMessage(message) {
  if (typeof message !== 'string') {
    return '';
  }

  return message.replace(/\s+/g, ' ').trim();
}

function normalizePoliteness(politeness) {
  return politeness === 'assertive' ? 'assertive' : 'polite';
}

function createLiveRegion(doc, politeness) {
  const region = doc.createElement('div');
  region.id = LIVE_REGION_IDS[politeness];
  region.setAttribute('role', politeness === 'assertive' ? 'alert' : 'status');
  region.setAttribute('aria-live', politeness);
  region.setAttribute('aria-atomic', 'true');
  region.setAttribute('data-rz-live-announcer', politeness);
  region.setAttribute(
    'style',
    'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;'
  );
  return region;
}

export function ensureLiveRegions() {
  const doc = getDocument();
  if (!doc?.body) {
    return { ...liveRegions };
  }

  ['polite', 'assertive'].forEach((politeness) => {
    const id = LIVE_REGION_IDS[politeness];
    let region = doc.getElementById(id);
    if (!region) {
      region = createLiveRegion(doc, politeness);
      doc.body.append(region);
    }
    liveRegions[politeness] = region;
  });

  return { ...liveRegions };
}

function addHistory(entry, historyLimit) {
  announcementHistory.push(entry);
  if (announcementHistory.length > historyLimit) {
    announcementHistory = announcementHistory.slice(announcementHistory.length - historyLimit);
  }
}

function clearRegion(region, delayMs) {
  setTimeout(() => {
    if (region) {
      region.textContent = '';
    }
  }, delayMs);
}

function writeToRegion(message, politeness, options) {
  const regions = ensureLiveRegions();
  const region = regions[politeness];
  if (!region) {
    return;
  }

  region.textContent = '';
  setTimeout(() => {
    region.textContent = message;
    clearRegion(region, options.clearDelayMs);
  }, 16);

  const record = {
    message,
    politeness,
    tag: options.tag ?? null,
    timestamp: Date.now(),
  };

  lastAnnouncement = record;
  addHistory(record, options.historyLimit);
}

function flushPoliteQueue(options) {
  if (politeQueue.length === 0) {
    politeTimer = null;
    return;
  }

  const nextMessage = politeQueue.shift();
  writeToRegion(nextMessage.message, 'polite', options);

  politeTimer = setTimeout(() => {
    flushPoliteQueue(options);
  }, options.politeIntervalMs);
}

function isDuplicate(message, politeness, options) {
  if (!options.dedupe) {
    return false;
  }

  if (!lastAnnouncement) {
    return false;
  }

  const withinWindow = Date.now() - lastAnnouncement.timestamp <= options.dedupeWindowMs;
  return withinWindow && lastAnnouncement.message === message && lastAnnouncement.politeness === politeness;
}

export function announce(message, politeness = 'polite', options = {}) {
  const normalized = normalizeMessage(message);
  if (!normalized) {
    return false;
  }

  const normalizedPoliteness = normalizePoliteness(politeness);
  const finalOptions = {
    queue: normalizedPoliteness === 'polite',
    dedupe: true,
    ...DEFAULTS,
    ...options,
  };

  if (isDuplicate(normalized, normalizedPoliteness, finalOptions)) {
    return false;
  }

  if (normalizedPoliteness === 'polite' && finalOptions.queue) {
    politeQueue.push({ message: normalized, tag: finalOptions.tag ?? null });
    if (!politeTimer) {
      flushPoliteQueue(finalOptions);
    }
    return true;
  }

  if (normalizedPoliteness === 'assertive' && !finalOptions.queue) {
    politeQueue = [];
  }

  writeToRegion(normalized, normalizedPoliteness, finalOptions);
  return true;
}

export function clearLiveRegions() {
  const regions = ensureLiveRegions();
  Object.values(regions).forEach((region) => {
    if (region) {
      region.textContent = '';
    }
  });
}

export function getAnnouncementHistory() {
  return announcementHistory.slice();
}

export function clearAnnouncementHistory() {
  announcementHistory = [];
}

export function destroyLiveAnnouncer() {
  if (politeTimer) {
    clearTimeout(politeTimer);
    politeTimer = null;
  }

  politeQueue = [];

  const doc = getDocument();
  if (doc) {
    Object.values(liveRegions).forEach((region) => {
      if (region?.parentElement) {
        region.parentElement.removeChild(region);
      }
    });
  }

  liveRegions = { polite: null, assertive: null };
  lastAnnouncement = null;
}
