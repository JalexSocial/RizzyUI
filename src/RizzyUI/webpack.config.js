// webpack.config.js

const path = require('path');

module.exports = [
    // Unminified Bundle Configuration
    {
        name: 'unminified',
        entry: [
            path.resolve(__dirname, 'wwwroot/js/rizzyui.js'),
            path.resolve(__dirname, 'wwwroot/js/vendor/loadjs/loadjs.js')
        ],
        output: {
            filename: 'rizzyui.js',
            path: path.resolve(__dirname, 'wwwroot/dist'),
        },
        mode: 'development', // Enables unminified output
        devtool: 'source-map', // Optional: Generates source maps for easier debugging
    },

    // Minified Bundle Configuration
    {
        name: 'minified',
        entry: [
            path.resolve(__dirname, 'wwwroot/js/rizzyui.js'),
            path.resolve(__dirname, 'wwwroot/js/vendor/loadjs/loadjs.js')
        ],
        output: {
            filename: 'rizzyui.min.js',
            path: path.resolve(__dirname, 'wwwroot/dist'),
        },
        mode: 'production', // Enables minification and optimizations
        // Source maps are optional for minified bundle
        // devtool: 'source-map',
    }
];
