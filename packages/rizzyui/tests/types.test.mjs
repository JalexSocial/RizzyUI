import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

// types/rizzyui.d.ts must describe code-behind modules: this.$props typed from the annotation,
// Alpine magics on `this`, the Rizzy global and the rz:module-error event.
const root = path.dirname(fileURLToPath(import.meta.url));
const declarations = path.resolve(root, '../types/rizzyui.d.ts');

function diagnosticsFor(file) {
    const program = ts.createProgram([path.join(root, 'types', file), declarations], {
        allowJs: true,
        checkJs: true,
        noEmit: true,
        strict: true,
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.ESNext,
        moduleResolution: ts.ModuleResolutionKind.Bundler,
        lib: ['lib.es2022.d.ts', 'lib.dom.d.ts'],
        paths: { rizzyui: [declarations] },
        types: [],
    });
    return ts.getPreEmitDiagnostics(program).map(d => ts.flattenDiagnosticMessageText(d.messageText, '\n'));
}

test('a well-typed code-behind module checks without errors', () => {
    assert.deepEqual(diagnosticsFor('Counter.razor.js'), []);
});

test('misusing $props is reported', () => {
    const errors = diagnosticsFor('Broken.razor.js');
    assert.ok(errors.some(e => e.includes("Type 'number' is not assignable to type 'string'")), errors.join('\n'));
    assert.ok(errors.some(e => e.includes('read-only')), errors.join('\n'));
});
