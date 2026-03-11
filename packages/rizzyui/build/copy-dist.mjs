import path from 'node:path';
import { cleanGenerated } from './clean-generated.mjs';
import { copyFileOrDir, logStep, pathExists } from './utils.mjs';
import {
    distRoot,
    downstreamWwwrootRoot,
    distJsRoot,
    distCssRoot,
    downstreamJsRoot,
    downstreamCssRoot,
    generatedTopLevelFiles,
} from './paths.mjs';

async function copyDist() {
    logStep('Cleaning downstream generated assets before copy...');
    await cleanGenerated({ local: false, downstream: true });

    logStep('Copying dist assets into downstream wwwroot...');
    await copyFileOrDir(distJsRoot, downstreamJsRoot);
    await copyFileOrDir(distCssRoot, downstreamCssRoot);

    for (const file of generatedTopLevelFiles) {
        const source = path.join(distRoot, file);
        if (await pathExists(source)) {
            await copyFileOrDir(source, path.join(downstreamWwwrootRoot, file));
        }
    }
}

await copyDist();
