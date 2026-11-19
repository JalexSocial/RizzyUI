/**
 * Types for `@jalexsocial/rizzyui/testing`: mount an Alpine code-behind module in a DOM test
 * environment (happy-dom or jsdom) and test its logic without a browser.
 */
import type { AlpineCodeBehind } from './rizzyui';

export interface MountOptions<TProps> {
    /** Becomes `this.$props` (and `$props` in the markup). */
    props?: TProps;
    /** The component's inner markup, with Alpine directives. */
    html?: string;
    /** The Alpine data name; generated when omitted. */
    name?: string;
    /** Extra attributes for the root element. */
    attributes?: Record<string, string>;
}

export interface MountedCodeBehind {
    /** The component's root element, appended to document.body. */
    root: HTMLElement;
    /** The component's reactive data (Alpine.$data of the root). */
    data: any;
    /** Resolves after Alpine has applied pending updates to the DOM. */
    nextTick(): Promise<void>;
    /** Destroys the component and removes the root element. */
    destroy(): void;
}

/** Mounts a code-behind module's default export the way RzAlpineComponent renders it. */
export function mountCodeBehind<TProps extends Record<string, any> = Record<string, any>>(
    factory: AlpineCodeBehind<TProps> | (() => Record<string, any>),
    options?: MountOptions<TProps>,
): Promise<MountedCodeBehind>;

/** The Alpine instance the helper uses. */
export const Alpine: any;
