
var path = require('path');
var fs = require('fs');
var utils = require('./utils');

module.exports = {
	checkCMD : (spinner) =>{
		var directory = process.argv[2], cwd = process.cwd(), app;
		if(!directory){
			spinner.fail('构建终止，构建目录需要通过 npm 命令传入 如: npm run build -- demo1');
			process.exit(0);
		}
		app = path.resolve(cwd, 'app', directory);
		if(!fs.existsSync(app)){
			spinner.fail(`app目录下没有找到子目录${directory}`);
			process.exit(0);
		}
		
	}
};

