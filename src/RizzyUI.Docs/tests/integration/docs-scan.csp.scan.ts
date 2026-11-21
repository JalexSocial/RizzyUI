import { defineDocsScan } from './docs-scan';

// Every docs page under the CSP build (rizzyui-csp.js, a policy without 'unsafe-eval'). See docs-scan.ts.
defineDocsScan('csp');
