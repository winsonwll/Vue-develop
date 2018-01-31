/**
 * 通用模块 alias 生成
 */

var config = require('../config');
var fs = require('fs');
var path = require('path');

const ROOT = config.root;

var alias = {};
var libsPath = path.join(ROOT, 'libs');
var vueCompsPath = path.join(ROOT, 'comps-vue');
var reactCompsPath = path.join(ROOT, 'comps-react');

function travel(filepath, ext = 'js'){
	var files = fs.readdirSync(filepath);
	files.forEach((file)=>{
		var absolute = path.resolve(filepath, file);
		var stats = fs.statSync(absolute);
		if(stats.isDirectory()){
			travel(absolute, ext)
		}
		else {
			// 过滤掉隐藏文件
			if(file.charAt(0) !== '.'){
				let extname = path.extname(absolute);
				if(extname.slice(1) === ext){
					let folders = path.dirname(absolute).replace(ROOT + path.sep, '').split(path.sep);
					let filename = file.split('.')[0];
					folders.push(filename);
					alias[folders.join('/')] = absolute;
				}
				
			}
		}
	})
}

travel(libsPath);
travel(vueCompsPath, 'vue');
travel(reactCompsPath, 'jsx');

module.exports = alias;








