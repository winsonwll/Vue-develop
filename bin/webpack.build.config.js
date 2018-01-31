/**
 * 生产环境构建配置
 * kv.wang87@gmail.com
 * 2017-02-04
 */

var path = require('path');
var fs = require('fs');
var webpack = require('webpack');

var config = require('../config');
var baseConf = require('./webpack.base.config');
var utils = require('./utils');

var buildConf = {};
var { output, plugins } = baseConf;
var { appName } = config;
var { publicPath, publicDirectory } = config.production;

var appConfig = utils.readFile(config.appConfigPath);
var staticversion = JSON.parse(appConfig).staticversion || "v_00000";

var plugs = plugins.concat(
				new webpack.optimize.UglifyJsPlugin({
			        compress: { warnings: false }
			    })
			);

// 定义输出目录配置
var outputs = Object.assign({}, output, {
	path : config.production.distPath,
	publicPath : [publicPath, 'assets/mobile/app', appName, publicDirectory, staticversion, ''].join('/')  
});

buildConf.plugins = plugs;
buildConf.output = outputs;

module.exports = Object.assign({}, baseConf, buildConf);








