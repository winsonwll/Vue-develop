var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var env = process.env.NODE_ENV;
var DEV = env != 'production';
var bundles = ['comments', 'news', 'live', 'before', 'replay'];
var version = 'v_20170109173956';

console.log("环境变量: " + env, "是否开发模式：" + DEV);

module.exports = {

	entry : (function(){
		var ret = {};
		bundles.forEach(function(value, index){
			ret[value] = path.resolve('src/js', value);
		})
		return ret;
	})(),
	
	output : {
		path : DEV ?  './build' : path.resolve('./static'),
		filename : DEV ? 'js/[name].js' : "js/[name].js",
		publicPath : DEV ? '' : 'http://staticsports.pplive.cn/2016/app4.0-h5/static/' + version + '/'
	},

	module : {
		loaders : [
			{
				test : /\.js$/,
				loader : "babel",
                exclude: /node_modules/
			},
			{
				test : /\.vue$/,
				loader : 'vue',
				include : [
					path.resolve(__dirname, 'src/components')
				]
			},
			{
		        test: /\.scss$/,
		        loaders: ["style-loader", "css-loader", "sass-loader"]
		    },
			{
	        	test: /\.css$/,
	        	loader: ExtractTextPlugin.extract("style-loader", "css-loader", "sass-loader")
	        	// loader: "style!css"
	    	},
			{
		        test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
		        loader: 'url-loader',
		        query: {
		        	limit : 1,
		        	name: '[name].[ext]'
		        }
		    },
		    {
		        test: /\.(png|jpe?g|gif|svg)(\?\S*)?$/,
		        loader: 'url-loader',
		        query: {
		        	limit : 1,
		        	name: '[name].[ext]'
		        }
		    }
		]
	},

	vue : {
		loaders : {
			css : ExtractTextPlugin.extract("css"),
			sass : ExtractTextPlugin.extract("css!sass")
		}
	},

	babel: {
	    presets: ['es2015', 'stage-0'],
	    plugins: ['transform-runtime']
	},

	resolve : {
		alias : {
			"vue$": "vue/dist/vue.js",
			"kui-css" : path.resolve("src/css", "kui.css"),
			"common-css" : path.resolve("src/css", "common.css"),
			"comments-css" : path.resolve("src/css", "comments.css"),
			"news-css" : path.resolve("src/css", "news.css"),
			"loading-css" : path.resolve("src/css", "loading.css"),
			"dialog-css" : path.resolve("src/css", "dialog.css"),
			"player-css": path.resolve("src/css", "player.css"),
			"live-css" : path.resolve("src/css", "live.css"),
			"spin-css" : path.resolve("src/css", "spin.css"),

			// JS common
			"fastclick" : path.resolve("src/js/pub", "fastclick"),
			"common" : path.resolve("src/js/pub", "common"),
			"iscroll-probe" : path.resolve("src/js/pub", "iscroll-probe"),
			"date-format" : path.resolve("src/js/pub", "date-format"),
			"zepto" : path.resolve("src/js/pub", "zepto"),
			"sports-player" : path.resolve("src/js/pub", "sports-player"),
			"swiper": path.resolve("src/js/pub", "swiper"),
			"chart": path.resolve("src/js/pub", "chart"),
			"urlstuff" : path.resolve("src/js/pub", "urlstuff"),
			"bridge" : path.resolve("src/js/pub", "bridge"),
			"mobile" : path.resolve("src/js/pub", "mobile"),
			"bip" : path.resolve("src/js/pub", "bip"),
			"configs" : path.resolve("src/js/pub", "configs"),

			// Component
			"Loading" : path.resolve("src/components", "Loading.vue"),
			"Dialog" : path.resolve("src/components", "Dialog.vue"),
			"Vs-pannel" : path.resolve("src/components", "Vs-pannel.vue"),
			"Matchresult" : path.resolve("src/components", "Matchresult.vue")
		},
		extensions : ["", ".webpack.js", ".web.js", ".js", '.vue', '.css', '.scss']
	},

	plugins: (function(){
		var plugin = [
			new webpack.optimize.CommonsChunkPlugin('vendors', DEV ? 'js/vendors.js' : 'js/vendors.js'),
			new ExtractTextPlugin(!DEV ? "css/[name].css" : "css/[name].css")
		];

		bundles.forEach(function(value, index){
			plugin.push(
				new HtmlWebpackPlugin({
			    	template: value + '.html',
			    	filename: value + '.html',
			    	inject: 'body',
			    	chunks: ['vendors', value]
			    	// chunks: [value]
			    })
			);
		})

		!DEV && plugin.push(
			    new webpack.DefinePlugin({
			    	'process.env': {
			        	NODE_ENV: 'production'
			    	}
			    }),
				new webpack.optimize.UglifyJsPlugin({
			        compress: {
			            warnings: false
			        }
			        // ,mangle: {
			        //     except: ['$super', '$', 'exports', 'require']
			        // }
			    }));
		
		return plugin;
	})(),

	devServer: {
	    contentBase : './build',
	    historyApiFallback: true,
	    port : 3105,
	    progress: true,
	    compress: true,
	    quiet : false,
	    noInfo : true,
	    hot : true
	}
	// 'cheap-module-eval-source-map' 该模式在一些安卓机上存在作用域解析问题
	// 谨慎使用 webpack 的 eval devtool 模式。如 cheap-module-eval-source-map、eval、cheap-eval-source-map 等 
	// 详细参考：https://webpack.github.io/docs/configuration.html#devtool
	// devtool: 'cheap-module-eval-source-map'
};



