import { spawn } from 'node:child_process';
import chromium from '@sparticuz/chromium';

const executablePath = await chromium.executablePath();

const child = spawn(
  process.platform === 'win32' ? 'npx.cmd' : 'npx',
  ['playwright', 'test', ...process.argv.slice(2)],
  {
    stdio: 'inherit',
    env: {
      ...process.env,
      PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH: executablePath
    }
  }
);

child.on('exit', (code) => process.exit(code ?? 1));
