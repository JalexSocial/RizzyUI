
// --------------------------------------------------------------------------------
// Alpine.js component: rzEmpty
// Empty component to prevent CSP errors if defining x-data on it's own without a
// parameter
// --------------------------------------------------------------------------------
export default function(Alpine) {
    Alpine.data('rzEmpty', () => {
    });
}
