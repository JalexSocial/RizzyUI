import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';

export function logStep(message) {
    console.log(`\n[build] ${message}`);
}

export async function run(command, args = [], options = {}) {
    const { cwd, env } = options;

    await new Promise((resolve, reject) => {
        const child = spawn(command, args, {
            cwd,
            env: { ...process.env, ...env },
            stdio: 'inherit',
            shell: process.platform === 'win32',
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

export async function copyFileOrDir(fromPath, toPath) {
    const stats = await fs.stat(fromPath);

    if (stats.isDirectory()) {
        await ensureDir(toPath);
        const entries = await fs.readdir(fromPath, { withFileTypes: true });
        for (const entry of entries) {
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
