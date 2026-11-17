import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';

export function logStep(message) {
    console.log(`\n[build] ${message}`);
}

// Runs a command without a shell, so arguments reach it unchanged on every platform. Use
// runNode or runPackageBin rather than naming npx/npm, which are .cmd scripts on Windows.
export async function run(command, args = [], options = {}) {
    const { cwd, env } = options;

    await new Promise((resolve, reject) => {
        const child = spawn(command, args, {
            cwd,
            env: { ...process.env, ...env },
            stdio: 'inherit',
        });

        child.on('error', reject);
        child.on('close', code => {
            if (code === 0) {
                resolve();
                return;
            }

            reject(new Error(`${command} ${args.join(' ')} exited with code ${code}`));
        });
    });
}

export async function runNode(scriptPath, args = [], options = {}) {
    await run(process.execPath, [scriptPath, ...args], options);
}

// Runs the command-line entry point of a package installed in <cwd>/node_modules.
export async function runPackageBin(packageName, args = [], options = {}) {
    const manifestPath = path.join(options.cwd ?? process.cwd(), 'node_modules', packageName, 'package.json');
    const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
    const bin = typeof manifest.bin === 'string' ? manifest.bin : Object.values(manifest.bin ?? {})[0];
    if (!bin) {
        throw new Error(`${packageName} has no bin entry`);
    }
    await runNode(path.resolve(path.dirname(manifestPath), bin), args, options);
}

export async function ensureDir(targetPath) {
    await fs.mkdir(targetPath, { recursive: true });
}

export async function removeIfExists(targetPath) {
    await fs.rm(targetPath, { recursive: true, force: true });
}

export async function emptyDir(targetPath) {
    await ensureDir(targetPath);
    const entries = await fs.readdir(targetPath);
    await Promise.all(entries.map(entry => removeIfExists(path.join(targetPath, entry))));
}

// Unit tests live next to the sources (__tests__/*.test.mjs) and must not be shipped in the
// npm package or the RizzyUI NuGet package's wwwroot.
function isTestArtifact(entry) {
    return entry.isDirectory() ? entry.name === '__tests__' : /\.test\.m?js$/.test(entry.name);
}

export async function copyFileOrDir(fromPath, toPath) {
    const stats = await fs.stat(fromPath);

    if (stats.isDirectory()) {
        await ensureDir(toPath);
        const entries = await fs.readdir(fromPath, { withFileTypes: true });
        for (const entry of entries) {
            if (isTestArtifact(entry)) {
                continue;
            }
            const source = path.join(fromPath, entry.name);
            const destination = path.join(toPath, entry.name);
            if (entry.isDirectory()) {
                await copyFileOrDir(source, destination);
            } else {
                await ensureDir(path.dirname(destination));
                await fs.copyFile(source, destination);
            }
        }
        return;
    }

    await ensureDir(path.dirname(toPath));
    await fs.copyFile(fromPath, toPath);
}

export async function pathExists(targetPath) {
    try {
        await fs.access(targetPath);
        return true;
    } catch {
        return false;
    }
}
