import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
    distRoot,
    distJsRoot,
    distCssRoot,
    downstreamWwwrootRoot,
    downstreamJsRoot,
    downstreamCssRoot,
    generatedJsEntryFiles,
    generatedCssFiles,
    generatedTopLevelFiles,
    generatedJsFolders,
} from './paths.mjs';
import { logStep, removeIfExists } from './utils.mjs';

export async function cleanGenerated({ local = true, downstream = true } = {}) {
    const targets = [];

    if (local) {
        targets.push(...generatedTopLevelFiles.map(file => path.join(distRoot, file)));
        targets.push(...generatedJsEntryFiles.map(file => path.join(distJsRoot, file)));
        targets.push(...generatedCssFiles.map(file => path.join(distCssRoot, file)));
        targets.push(...generatedJsFolders.map(folder => path.join(distJsRoot, folder)));
    }

    if (downstream) {
        targets.push(...generatedTopLevelFiles.map(file => path.join(downstreamWwwrootRoot, file)));
        targets.push(...generatedJsEntryFiles.map(file => path.join(downstreamJsRoot, file)));
        targets.push(...generatedCssFiles.map(file => path.join(downstreamCssRoot, file)));
        targets.push(...generatedJsFolders.map(folder => path.join(downstreamJsRoot, folder)));
    }

    for (const target of new Set(targets)) {
        await removeIfExists(target);
    }
}

const isDirectExecution = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isDirectExecution) {
    logStep('Cleaning generated local and downstream assets...');
    await cleanGenerated({ local: true, downstream: true });
}
