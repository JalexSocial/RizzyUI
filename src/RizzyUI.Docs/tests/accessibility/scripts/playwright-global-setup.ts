import { existsSync } from 'node:fs';
import { join } from 'node:path';
import chromium from '@sparticuz/chromium';

export default async function globalSetup(): Promise<void> {
  if (process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH) {
    return;
  }

  if (process.platform === 'win32') {
    const chromePath = [
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      join(process.env.LOCALAPPDATA || '', 'Google\\Chrome\\Application\\chrome.exe')
    ].find(path => path && existsSync(path));

    if (chromePath) {
      process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH = chromePath;
      return;
    }
  }

  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH = await chromium.executablePath();
}
