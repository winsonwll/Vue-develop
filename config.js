/**
 * 一些配置项目
 * kv.wang87@gmail.com
 * 2016-01-15 
 */
var path = require('path');
var utils = require('./bin/utils');

const appname = process.argv[2];
const cwd = process.cwd();
const appPath = path.join(cwd, 'app', appname);

const port = 5000; // utils.random(3000, 4000);

module.exports = {
	root : cwd,
	appPath : appPath,
	appName : appname,
	appConfigPath : path.join(appPath, 'appconfig.json'),
	htmlPath : path.join(appPath, 'html'),
	jsPath : path.join(appPath, 'src/js'),
	cssPath : path.join(appPath, 'src/css'),
	production : {
		distPath : path.join(cwd, 'app', appname, 'dist'),
		publicPath : 'http://staticsports.pplive.cn',
		publicDirectory : 'dist',
		productionSourceMap : false,
		productionGzip : false,
		productionGzipExtension : ['js', 'css']
	},
	development : {
		buildPath : path.join(cwd, 'app', appname, '.build'),
		port : port,
		proxyTable : {},
		assetsRoot : '',
		cssSourceMap : {}
	}
};




