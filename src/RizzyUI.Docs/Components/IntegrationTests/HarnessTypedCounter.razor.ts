// TypeScript code-behind for HarnessTypedCounter.razor (integration tests). esbuild bundles the
// relative import below into the built HarnessTypedCounter.razor.js.
import type { AlpineCodeBehind } from 'rizzyui';
import { formatTitle } from './harnessFormat';

interface Props {
  label: string;
  start: number;
}

const counter: AlpineCodeBehind<Props> = () => ({
  count: 0 as number,
  title: '',

  init() {
    this.count = this.$props.start;
    this.title = formatTitle(this.$props.label);
  },

  increment() {
    this.count += 1;
  },

  decrement() {
    this.count -= 1;
  },
});

export default counter;
