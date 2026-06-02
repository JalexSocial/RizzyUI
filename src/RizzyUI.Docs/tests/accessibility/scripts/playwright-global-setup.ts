import chromium from '@sparticuz/chromium';

export default async function globalSetup(): Promise<void> {
  if (process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH) {
    return;
  }

  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH = await chromium.executablePath();
}
