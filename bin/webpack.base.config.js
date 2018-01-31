/**
 * webpack 基本配置
 * kv.wang87@gmail.com
 */

var webpack = require('webpack');
var path = require('path');
var utils = require('./utils');
var config = require('../config');
var libsAlias = require('./alias');

var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');

var { jsPath, htmlPath } = config;
var jsSource = utils.getEntry({ filepath: jsPath, filter: 'js' });
var htmlSource = utils.getEntry({ filepath: htmlPath, filter: 'html' });

var appConfig = utils.readFile(config.appConfigPath);
var { alias } = JSON.parse(appConfig);
var { appPath, appName, cssPath } = config;

alias = utils.resolveAlias(alias, appPath);

module.exports = {
    // 修剪掉 js map 文件中非入口文件(webpack 不允许被依赖文件也作为入口文件)
    entry: utils.prune(htmlSource, jsSource),

    output: {
        filename: 'js/[name].js',
        publicPath: ''
    },

    module: {
        loaders: [{
            test: /\.jsx?$/,
            loader: "babel",
            exclude: /node_modules/
        }, {
            test: /\.vue$/,
            loader: 'vue'
        }, {
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader')
        }, {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract("style-loader", "css-loader", "sass-loader")
        }, {
            test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
            loader: 'resource-url-loader',
            query: {
                limit: 1,
                invokerRoot : cssPath,
                publicPath : ''
            }
        }, {
            test: /\.(png|jpe?g|gif|svg)(\?\S*)?$/,
            loader: 'resource-url-loader',
            query: {
                limit: 1,
                invokerRoot : cssPath,
                publicPath : ''
            }
        }]
    },

    resolve: {
        extensions: ["", ".webpack.js", ".web.js", ".js", '.vue', '.css', '.scss'],
        alias: Object.assign(   //把多个object合并到一起
        	{"vue$": "vue/dist/vue.js"},
        	libsAlias,
        	alias
        )
    },

    vue: {
        loaders: {
            css: ExtractTextPlugin.extract("css"),
            sass: ExtractTextPlugin.extract("css!sass")
        }
    },

    plugins: (function() {
        var plugin = [
            new webpack.optimize.CommonsChunkPlugin('vendors', 'js/vendors.js'),
            new webpack.optimize.OccurenceOrderPlugin(),
            new ExtractTextPlugin("css/[name].css")
        ];

        Object.keys(htmlSource).forEach((file) => {
            plugin.push(
                new HtmlWebpackPlugin({
                    template: path.resolve(htmlPath, file + '.html'),
                    filename: file + '.html',
                    inject: 'body',
                    chunks: ['vendors', file]
                })
            );
        });

        return plugin;
    })()

    // 'cheap-module-eval-source-map' 该模式在一些安卓机上存在作用域解析问题
    // 谨慎使用 webpack 的 eval devtool 模式。如 cheap-module-eval-source-map、eval、cheap-eval-source-map 等 
    // 详细参考：https://webpack.github.io/docs/configuration.html#devtool
    // devtool: 'cheap-module-eval-source-map'
};
