/**
 * webpack 开发环境配置
 * kv.wang87@gmail.com
 * 2017-02-07
 */

"use strict";

var webpack = require('webpack');
var webpackBaseConfig = require('./webpack.base.config');
var config = require('../config');

var devConf = {};
var { output, entry, plugins } = webpackBaseConfig;
var { port, buildPath } = config.development;
var points = {};


// 重新定义 dev-server 环境下 产出目录
var outputs = Object.assign({}, output, {
    path: config.development.buildPath
});

// 
var plugs = [].concat(plugins, new webpack.HotModuleReplacementPlugin());

// 遍历每个入口文件插入 HMR 及 inline mode 脚本
Object.keys(entry).forEach((point) => {
    var ent = entry[point];
	var hmr = ["webpack-dev-server/client?http://localhost:" + port + "/", "webpack/hot/dev-server"];
    points[point] = Array.isArray(ent) ? hmr.concat(ent) : (hmr.push(ent), hmr);
})

devConf.output = outputs;
devConf.entry = points;
devConf.plugins = plugs;

module.exports = Object.assign(webpackBaseConfig, devConf);
