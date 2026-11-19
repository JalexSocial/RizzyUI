// Alpine code-behind for RizzyCodeBehindComponent.razor, in TypeScript. RizzyUI's optional build
// pipeline (<RizzyUICodeBehindBuild>esbuild</RizzyUICodeBehindBuild>) compiles it to the
// RizzyCodeBehindComponent.razor.js module the page loads.
import type { AlpineCodeBehind } from 'rizzyui';

interface Props {
  Title: string;
}

const component: AlpineCodeBehind<Props> = () => ({
  count: 0,

  init() {
    // Runs once when the component starts. this.$props holds the Props from the .razor file.
  },

  increment() {
    this.count++;
  },

  decrement() {
    this.count--;
  },
});

export default component;
