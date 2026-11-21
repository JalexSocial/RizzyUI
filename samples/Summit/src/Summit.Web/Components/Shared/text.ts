// Small text helpers shared by TypeScript code-behind modules. Not a code-behind module itself (no
// .razor.ts suffix): esbuild bundles it into each module that imports it.

/** "1 attendee", "3 attendees". */
export function plural(count: number, singular: string, pluralForm = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : pluralForm}`;
}
