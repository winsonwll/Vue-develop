var path = require('path');
var fs = require('fs');
var ora = require('ora');
var webpack = require('webpack');
var opn = require('opn');
var co = require('co');
var webpackDevServer = require('webpack-dev-server');

var utils = require('./utils');
var config = require('../config');
var devConfig = require('./webpack.dev.config');

var { appConfigPath, development, appPath, htmlPath } = config;
var { port, buildPath } = development;
var appConfig = utils.readFile(appConfigPath);
var { home, open } = JSON.parse(appConfig);

var snapshoot = path.resolve(appPath, 'snapshoot.json');
var compiler = webpack(devConfig);

// 打印 webpack 配置快照
utils.writeFile(snapshoot, JSON.stringify(devConfig, null, 4));

var options = {
    // webpack-dev-server options
    // Can also be an array, or: contentBase: "http://localhost/",
    contentBase: buildPath,
    // Enable special support for Hot Module Replacement
    // Page is no longer updated, but a "webpackHotUpdate" message is sent to the content
    // Use "webpack/hot/dev-server" as additional module in your entry point
    // Note: this does _not_ add the `HotModuleReplacementPlugin` like the CLI option does.
    hot: true,
    // Set this as true if you want to access dev server from arbitrary url.
    // This is handy if you are using a html5 router.
    historyApiFallback: false,
    // Set this if you want to enable gzip compression for assets
    compress: true,
    // Set this if you want webpack-dev-server to delegate a single path to an arbitrary server.
    // Use "**" to proxy all paths to the specified server.
    // This is useful if you want to get rid of 'http://localhost:8080/' in script[src],
    // and has many other use cases (see https://github.com/webpack/webpack-dev-server/pull/127 ).
    proxy: {},
    quiet: false,
    noInfo: false,
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
    },
    // It's a required option.
    publicPath: "",
    stats: { colors: true }
};

var spinner = ora('Start to build dev-server...').start();
var server = new webpackDevServer(compiler, options);

spinner.start();

server.listen(port, '127.0.0.1', function(){
    co(function* (){
        var files = yield utils.readFileNames(htmlPath);
        if(!files.length){
            throw '没有在' + htmlPath + '下找到任何可以打开的预览页面';
            return;
        }

        home = home || files[0];

        if(open){
            opn(`http://localhost:${port}/${ home }`);
            return;
        }
        else {
            console.log("\nListen: http://localhost:%s/%s", port, home);
        }
        spinner.succeed("Server build successfully");
    })
    .catch((err)=>{
        console.error(err);
    })
})
