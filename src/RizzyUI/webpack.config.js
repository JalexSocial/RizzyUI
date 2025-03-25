// webpack.config.js

const path = require('path');

module.exports = [
    /*
    // Unminified Bundle Configuration
    {
        name: 'unminified',
        entry: [
            path.resolve(__dirname, 'wwwroot/js/rizzy-streaming.js'),
            path.resolve(__dirname, 'wwwroot/js/rizzy-nonce.js'),
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
            path.resolve(__dirname, 'wwwroot/js/rizzy-streaming.js'),
            path.resolve(__dirname, 'wwwroot/js/rizzy-nonce.js'),
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
    },
    */
    {
        name: 'rizzyui-csp',
        entry: path.resolve(__dirname, 'wwwroot/js/rizzyui-csp.js'),
        output: {
            filename: 'rizzyui-csp.js',
            path: path.resolve(__dirname, 'wwwroot/dist/'),
        },
        mode: 'development', // Enables unminified output
        devtool: 'source-map', // Optional: Generates source maps for easier debugging
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }
                }
            ]
        },
        resolve: {
            extensions: ['.js'], // Automatically resolve these extensions
            modules: ['node_modules'], // Allow imports from node_modules
        },
        experiments: {
            outputModule: true,
        }
    },
    {
        name: 'rizzyui-csp',
        entry: path.resolve(__dirname, 'wwwroot/js/rizzyui-csp.js'),
        output: {
            filename: 'rizzyui-csp.min.js',
            path: path.resolve(__dirname, 'wwwroot/dist/'),
        },
        mode: 'production', // Enables unminified output
        devtool: 'source-map', // Optional: Generates source maps for easier debugging
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }
                }
            ]
        },
        resolve: {
            extensions: ['.js'], // Automatically resolve these extensions
            modules: ['node_modules'], // Allow imports from node_modules
        },
        experiments: {
            outputModule: true,
        }
    }    
];
