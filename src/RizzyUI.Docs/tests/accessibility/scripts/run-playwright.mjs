import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import chromium from '@sparticuz/chromium';

const require = createRequire(import.meta.url);
const testArgs = process.argv.slice(2);
const playwrightArgs = testArgs.length > 0 ? testArgs : ['tests/accessibility'];
const playwrightCli = join(dirname(require.resolve('playwright/package.json')), 'cli.js');
const windowsChromePaths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  join(process.env.LOCALAPPDATA || '', 'Google\\Chrome\\Application\\chrome.exe')
];

async function resolveChromiumExecutablePath() {
  if (process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH) {
    return process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
  }

  if (process.platform === 'win32') {
    return windowsChromePaths.find(path => path && existsSync(path));
  }

  return await chromium.executablePath();
}

const executablePath = await resolveChromiumExecutablePath();

const child = spawn(
  process.execPath,
  [playwrightCli, 'test', ...playwrightArgs],
  {
    stdio: 'inherit',
    env: {
      ...process.env,
      ...(executablePath ? { PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH: executablePath } : {})
    }
  }
);

child.on('exit', (code) => process.exit(code ?? 1));
