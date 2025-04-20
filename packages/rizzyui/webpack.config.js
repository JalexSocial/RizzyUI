/* webpack.config.js ------------------------------------------------------- */
const path       = require('path');
const CopyPlugin = require('copy-webpack-plugin');

const ROOT           = __dirname;
const SRC_DIR        = path.resolve(ROOT, 'src/js');
const DIST_DIR       = path.resolve(ROOT, 'dist/js');
const TARGET_WWWROOT = path.resolve(ROOT, '../../src/RizzyUI/wwwroot/');

/* One shared Babel rule --------------------------------------------------- */
const babelRule = {
    test   : /\.js$/,
    exclude: /node_modules/,
    use    : { loader: 'babel-loader', options: { presets: ['@babel/preset-env'] } },
};

/* Copy built files to wwwroot -------------------------------------------- */
const copyToWwwroot = new CopyPlugin({
    patterns: [
        {
            from : path.resolve(ROOT, 'dist'),
            to   : TARGET_WWWROOT,
            noErrorOnMissing: true,
            force           : true,
        },
    ],
});

/* Factory ---------------------------------------------------------------- */
function makeConfig({ name, entryFile, filename, isProd, doClean = false }) {
    return {
        name,
        mode  : isProd ? 'production' : 'development',
        entry : path.resolve(SRC_DIR, entryFile),
        output: {
            filename,
            path: DIST_DIR,
            ...(doClean ? { clean: true } : {}),          // ⚠️ clean only when asked
        },
        ...(isProd ? {} : { devtool: 'source-map' }),
        module : { rules: [babelRule] },
        resolve: { extensions: ['.js'], modules: ['node_modules'] },
        plugins: [copyToWwwroot],
    };
}

/* Export ------------------------------------------------------------------ */
module.exports = [
    /* Clean happens just once on the first build target -------------------- */
    makeConfig({
        name      : 'rizzyui',
        entryFile : 'rizzyui.js',
        filename  : 'rizzyui.js',
        isProd    : false,
        doClean   : true,               // ← only this compiler cleans DIST_DIR
    }),
    makeConfig({
        name      : 'rizzyui-min',
        entryFile : 'rizzyui.js',
        filename  : 'rizzyui.min.js',
        isProd    : true,
    }),
    makeConfig({
        name      : 'rizzyui-csp',
        entryFile : 'rizzyui-csp.js',
        filename  : 'rizzyui-csp.js',
        isProd    : false,
    }),
    makeConfig({
        name      : 'rizzyui-csp-min',
        entryFile : 'rizzyui-csp.js',
        filename  : 'rizzyui-csp.min.js',
        isProd    : true,
    }),
];
