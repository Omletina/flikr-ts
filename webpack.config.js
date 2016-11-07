var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');
var path = require('path');
var DashboardPlugin = require('webpack-dashboard/plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");


module.exports = {

    // context: path.join(__dirname, "src/js/", 'app.js'),
    entry: [
        path.join(__dirname, "src/js/index"),
        path.join(__dirname, "src/scss/app")
    ],
    output: {
        publicPath: '/content/',
        path: path.join(__dirname, 'public/content/'),
        filename: 'script.js'
    },

    resolve: {
        root: path.join(__dirname, 'src'),
        extensions: ['', '.js', '.ts', '.scss']
    },

    watch: debug,
    watchoptions: {
        aggregateTimeout: 100
    },

    devtool: debug ? "inline-sourcemap" : null,


    module: {
        loaders: [ //
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel',
                query: {
                    presets: ['es2015', 'stage-0'],
                    plugins: [
                        "add-module-exports"
                    ]
                }
            },
            {
                test: /\.ts$/,
                loaders: ['awesome-typescript-loader']
            },
            {
                test: /\.html$/,
                loader: 'html'
            },
            {
                test: /\.scss$/,
                // loaders: ["file?name=style.[ext]", "style", "css", "sass"]
                loader: ExtractTextPlugin.extract("css!resolve-url!sass?sourceMap")
            },
            { // font & img
                test: /\.(png|jpg|svg|ttf|eot|woff|woff2)$/,
                include: /\/node_modules\//,
                loader: 'file?name=[1][name].[ext]&regExp=node_modules/(.*)'
            },
            { // font & img
                test: /\.(png|jpg|svg|ttf|eot|woff|woff2)$/,
                exclude: /\/node_modules\//,
                loader: 'file?name=[path][name].[ext]'
            }
        ]
    },


    plugins: debug ? [
        new ExtractTextPlugin("style.css", { allChunks: true })
    ] : [
        new ExtractTextPlugin("style.css", { allChunks: true }),
        new DashboardPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            mangle: false,
            sourcemap: false,
            compress: {
                warnings: false,
                drop_console: true,
                unsave: true
            }
        }),
    ]
};