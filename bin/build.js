/**
 * 生产环境构建配置
 * kv.wang87@gmail.com
 * 2017-02-05
 */

"use strict";

var path = require('path');
var fs = require('fs');
var ora = require('ora'), spinner;


var checker = require('./checker');
var webpack = require('webpack');
var utils = require('./utils');
var config = require('../config');
var webpackConfig = require('./webpack.build.config');
var snapshoot = path.join(config.appPath, 'snapshoot.json');


// 获取产出目录的完整路径
const distPath = config.production.distPath;
const appPath = config.appPath;
const jsPath = path.posix.join(appPath, 'src/js');
const appConfig = utils.readFile(config.appConfigPath); 
const { watch } = JSON.parse(appConfig);

spinner = new ora('Start building for production, wait for seconds...').start();

// 检查命令行合法性
checker.checkCMD(spinner);

// 构建之前先清空构建目录
utils.rmdirSync(config.production.distPath);

// 生成配置快照
utils.writeFile(snapshoot, JSON.stringify(webpackConfig, null, 4));

// 构建
var compiler =  webpack(webpackConfig);
var compileHandle = (err, stats)=> {
	var jsonStats = stats.toJson();
	var log = stats.toString({
		color : true,
		version : false,
		hash : false,
		modules : false,
		chunks : false,
		chunkModules : false,
		assets : true,
		errorDetails : true,
		children : false
	});
	if(err){
		spinner.fail(err);
		process.exit(0);
	}
	if(jsonStats.errors.length){
		return console.error('Compile occurs error : %s', jsonStats.errors.join('\n'));
	}
	if(jsonStats.warnings.length){
		return console.error('Compile occurs warnings : %s', jsonStats.warnings.join('\n'));
	}
	process.stdout.write(log + '\n');
};

// 是否开启 watch 模式
if(watch){
	spinner.text = 'Watch mode is open';
	compiler.watch({ aggregateTimeout : 300, poll : true }, (err, stats)=>{
		compileHandle(err, stats);
		spinner.succeed('Build successfully in watch mode');
	})
}
else {
	compiler.run((err, stats)=>{
		compileHandle(err, stats);
		spinner.succeed('Build successfully in normal mode');
	})
}

















 