const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
const targetWwwRoot = path.resolve(__dirname, '../../src/RizzyUI/wwwroot/');

module.exports = [
    {
        name: 'rizzyui',
        entry: path.resolve(__dirname, 'src/js/rizzyui.js'),
        output: {
            filename: 'rizzyui.js',
            path: path.resolve(__dirname, 'dist/js/'),
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
        }
    },
    {
        name: 'rizzyui-min',
        entry: path.resolve(__dirname, 'src/js/rizzyui.js'),
        output: {
            filename: 'rizzyui.min.js',
            path: path.resolve(__dirname, 'dist/js/'),
        },
        mode: 'production', // Enables unminified output
        //devtool: 'source-map', // Optional: Generates source maps for easier debugging
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
        plugins: [
            new CopyPlugin({
                patterns: [
                    {
                        from: path.resolve(__dirname, 'dist'), // Copy FROM the Webpack output dir
                        to: targetWwwRoot,                   // Copy TO the target wwwroot/dist dir
                        globOptions: {
                            // Optional: ignore files like source maps
                            // ignore: ["**/*.map"],
                        },
                        noErrorOnMissing: true, // Don't error if 'dist' doesn't exist before first build
                        force: true, // Overwrite files in the destination
                    },
                ],
            }),
        ]
    },
    {
        name: 'rizzyui-csp',
        entry: path.resolve(__dirname, 'src/js/rizzyui-csp.js'),
        output: {
            filename: 'rizzyui-csp.js',
            path: path.resolve(__dirname, 'dist/js/'),
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
        plugins: [
            new CopyPlugin({
                patterns: [
                    {
                        from: path.resolve(__dirname, 'dist'), // Copy FROM the Webpack output dir
                        to: targetWwwRoot,                   // Copy TO the target wwwroot/dist dir
                        globOptions: {
                            // Optional: ignore files like source maps
                            // ignore: ["**/*.map"],
                        },
                        noErrorOnMissing: true, // Don't error if 'dist' doesn't exist before first build
                        force: true, // Overwrite files in the destination
                    },
                ],
            }),
        ]
    },
    {
        name: 'rizzyui-csp-min',
        entry: path.resolve(__dirname, 'src/js/rizzyui-csp.js'),
        output: {
            filename: 'rizzyui-csp.min.js',
            path: path.resolve(__dirname, 'dist/js/'),
        },
        mode: 'production', // Enables unminified output
        //devtool: 'source-map', // Optional: Generates source maps for easier debugging
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
        plugins: [
            new CopyPlugin({
                patterns: [
                    {
                        from: path.resolve(__dirname, 'dist'), // Copy FROM the Webpack output dir
                        to: targetWwwRoot,                   // Copy TO the target wwwroot/dist dir
                        globOptions: {
                            // Optional: ignore files like source maps
                            // ignore: ["**/*.map"],
                        },
                        noErrorOnMissing: true, // Don't error if 'dist' doesn't exist before first build
                        force: true, // Overwrite files in the destination
                    },
                ],
            }),
        ]
    }
];
