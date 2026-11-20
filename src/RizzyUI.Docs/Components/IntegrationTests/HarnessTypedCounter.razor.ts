// TypeScript code-behind for HarnessTypedCounter.razor (integration tests). esbuild bundles the
// relative import below into the built HarnessTypedCounter.razor.js.
import type { AlpineCodeBehind } from 'rizzyui';
import { formatTitle } from './harnessFormat';

interface Props {
  Label: string;
  Start: number;
}

const counter: AlpineCodeBehind<Props> = () => ({
  count: 0 as number,
  title: '',

  init() {
    this.count = this.$props.Start;
    this.title = formatTitle(this.$props.Label);
  },

  increment() {
    this.count += 1;
  },

  decrement() {
    this.count -= 1;
  },
});

export default counter;
