/**
 * 一些工具函数
 * kv.wang87@gmail.com
 */

var fs = require('fs');
var path = require('path');
var bluebird = require('bluebird');

module.exports = {
    /**
     * 同步移除指定文件夹及文件内所有文件
     */
    rmdirSync: (filepath) => {
        var dirs = [];
        if (fs.existsSync(filepath)) {
            // 批量删除文件
            removeFiles(filepath);
            // 批量删除空文件目录
            dirs.concat(filepath).forEach((dir) => {
                fs.rmdirSync(dir);
            })
        }

        function removeFiles(filepath) {
            var stats, files, absolute;
            files = fs.readdirSync(filepath);
            files.forEach((file) => {
                absolute = path.join(filepath, file);
                stats = fs.statSync(absolute);
                if (stats.isDirectory()) {
                    dirs.unshift(absolute);
                    removeFiles(absolute);
                } else if (stats.isFile()) {
                    fs.unlinkSync(absolute);
                }
            })
        }
    },

    /**
     * 获取指定目录下指定类型的文件
     * @param  {string}  options.filepath  目录地址
     * @param  {string}  options.filter    [description]
     * @param  {boolean} options.recursion 是否递归遍历
     * @return {object}                    包含文件名和文件路径的json对象
     */
    getEntry: ({ filepath, filter, recursion = false }) => {
        var result = {};
        var walk = (filepath, filter, recursion) => {
            var files = fs.readdirSync(filepath);
            files.map((file) => {
                var absolute = path.resolve(filepath, file);
                var stats = fs.statSync(absolute);
                if (stats.isDirectory()) {
                    if (recursion) {
                        walk(absolute, filter, recursion)
                    }
                } else {
                    let ext = path.posix.extname(absolute),
                        extname = ext ? ext.split('.')[1] : '',
                        filename = path.posix.basename(file, ext);
                    if (filter && filter !== '*') {
                        if (extname === filter) {
                            result[filename] = absolute;
                        }
                    } else {
                        result[filename] = absolute;
                    }
                }
            })
        }
        walk(filepath, filter, recursion);
        return result;
    },

    /**
     * 读取指定文件内容
     * @param  {string} filepath 文件路径
     * @return {string}          文件内容
     */
    readFile: (filepath) => {
        return fs.existsSync(filepath) ? fs.readFileSync(filepath, 'utf8') : {}
    },

    /**
     * 将内容写入文件
     * @param  {string} filepath    文件路径
     * @param  {string} data        文件内容
     */
    writeFile: (filepath, data) => {
        // return new bluebird(function(resolve, reject){
        // 	var writeStream = fs.createReadStream(filepath, { 
        // 		"defaultEncoding" : 'utf8',
        // 		"flag" : "w" 
        // 	});
        // 	writeStream.write(data);
        // 	writeStream.on('end', ()=>{
        // 		resolve();
        // 	})
        // })

        return new bluebird(function(resolve, reject) {
            if(filepath && path.isAbsolute(filepath)){
                fs.writeFile(filepath, data, { 'encoding': 'utf8' }, (err) => {
                    if (err) {
                        reject(err);
                        return console.error('文件写入发生错误');
                    }
                    resolve();
                })
            }
            else {
                console.error("utils.writeFile arguments error, filePath : %s", filepath);
            }
            
        })
    },

    /**
     * 异步获取指定目录下 所有文件名
     */
    readFileNames : (dir, isFile = true)=>{
        return  new Promise((resolve, reject)=>{
            fs.readdir(dir, (err, files)=>{
                if(err){
                    return reject(err);
                }
                else {
                    let ret = [];
                    files.forEach((f)=>{
                        let absolute = path.resolve(dir, f);
                        let filename = path.basename(absolute);
                        if(filename.charAt(0) !== '.'){
                            ret.push(filename);
                        }
                    });
                    
                    resolve(ret);
                }
            });
        })     
    },

    /**
     * 退出程序
     */
    exit: () => process.exit(0),

    /**
     * 将 alias路径中相对路径转为绝对路径
     * @param  {object} alias    alias 对象
     * @param  {string} relative [description]
     * @return {object}          
     */
    resolveAlias: (alias, relative) => {
        var ret = {},
            filepath;
        Object.keys(alias).forEach((value) => {
            filepath = alias[value];
            ret[value] = path.isAbsolute(filepath) ? filepath : path.join(relative, filepath);
        })
        return ret;
    },

    /**
     * 取两个对象的交集部分
     * @param  {object} reference 参考对象
     * @param  {object} raw       原始对象(待修剪)
     * @return {object}           
     */
    prune: (reference, raw) => {
        var ret = {};
        Object.keys(raw).forEach((v) => {
            if (reference[v]) {
                ret[v] = raw[v];
            }
        })
        return ret;
    },

    /**
     * 获得一个指定范围的随机值
     */
    random : (min, max) => {
        min = parseInt(min, 10);
        max = parseInt(max, 10);
        return  parseInt(Math.random() * (max - min), 10) +  min; 
    }
};
