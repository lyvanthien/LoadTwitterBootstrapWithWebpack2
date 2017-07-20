const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require('webpack');
const path = require("path");
const bootstrapEntryPoints = require('./webpack.bootstrap.config');
const glob = require('glob');
const PurifyCSSPlugin = require('purifycss-webpack');

const isProd = process.env.NODE_ENV === 'production'; // true or false
const cssDev = ['style-loader', 'css-loader?sourceMap', 'sass-loader'];
const cssProd = ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: ["css-loader", "sass-loader"],
    publicPath: "/dist"
});
const cssConfig = isProd ? cssProd : cssDev;

const bootstrapConfig = isProd ? bootstrapEntryPoints.prod : bootstrapEntryPoints.dev;



module.exports = {
    entry: {
        app: './src/app.js',
        contact:'./src/contact.js',
        about: './src/about.js',
        bootstrap: bootstrapConfig
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: 'bundles/[name].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: cssConfig
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                    'file-loader?name=images/[name].[ext]',
                    //'file-loader?name=[name].[ext]&outputPath=images/',
                    'image-webpack-loader'
                ]
            },
            { test: /\.(woff2?|svg)$/, loader: 'url-loader?limit=10000&name=fonts/[name].[ext]' },
            { test: /\.(ttf|eot)$/, loader: 'file-loader?name=fonts/[name].[ext]' },
            // Bootstrap 3
            {
                test: /bootstrap-sass[\/\\]assets[\/\\]javascripts[\/\\]/, loader:
                    'imports-loader?jQuery=jquery'
            }
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        /*For  webpack.HotModuleReplacementPlugin(), webpack.NamedModulesPlugin()*/
        hot: true,
        /*port: 9000,*/
        stats: "errors-only",
        open: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Project Demo',
            minify: {
                collapseWhitespace: true
            },
            hash: true,
            excludeChunks: ['contact', 'about'],
            /*filename: './../index.html',*/
            template: './src/index.html'
        }),
        new HtmlWebpackPlugin({
            title:'Contact Page',
            minify:{
                collapseWhitespace: true
            },
            hash: true,
            chunks: ['contact'],
            filename: 'contact.html',
            template: './src/views/contact.html'
        }),
        new HtmlWebpackPlugin({
            title:'About Page',
            minify:{
                collapseWhitespace: true
            },
            hash: true,
            chunks: ['about'],
            filename: 'about.html',
            template: './src/views/about.html'
        }),
        new ExtractTextPlugin({
            filename: "css/[name].css",
            disable: !isProd,
            allChunks: true
        }),

        // Make sure this is after ExtractTextPlugin!
        new PurifyCSSPlugin({
            // Give paths to parse for rules. These should be absolute!
            paths: glob.sync(path.join(__dirname, 'src/*.html')),
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        
    ]
};