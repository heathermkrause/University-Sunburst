var path = require('path'),
    webpack = require('webpack');

module.exports = {
    devtool: 'source-map',

    // Currently we need to add '.ts' to resolve.extensions array.
    resolve: {
        root: __dirname,
        extensions: ['', '.ts', '.js'],
        modulesDirectories: ['app'],
        alias: {
            d3: "libs/d3/d3"
        }
    },

    output: {
        path: root('dist'),
        filename: '[name].js',
        sourceMapFilename: '[name].js.map',
        chunkFilename: '[id].chunk.js'
    },

    entry: {
        //d3 : [
        //    'libs/d3/d3'
        //],
        chart: [
            'app/chart'
        ]
    },

    plugins: [
        //new webpack.optimize.CommonsChunkPlugin({
        //    name: 'd3',
        //    minChunks: Infinity,
        //}),
        //new webpack.optimize.CommonsChunkPlugin({
        //    name: 'common',
        //    filename: 'common.js'
        //}),
        new webpack.optimize.UglifyJsPlugin({sourceMap : false}),
        new webpack.DefinePlugin({
            'ENV': {
                'type': JSON.stringify('development'),
                'debug': true
            }
        })
    ],

    module: {
        loaders: [
            // Support for .ts files.
            {test: /\.ts$/, loader: 'ts'},
            {test: /\.less$/, loader: 'style!css!less'},
            {test: /\.png$/, loader: "url-loader?limit=100000"}
        ]
    },

    context: __dirname
}

/**
 * Creates path starting from root directory
 * @return {*}
 */
function root() {
    var args = Array.prototype.slice.call(arguments, 0);
    return path.join.apply(path, [__dirname].concat(args));
}