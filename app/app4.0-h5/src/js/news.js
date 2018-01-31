/**
 * 新闻资讯(图文资讯)
 * kv。wang87@gmail.com
 * 2016-12-11
 */

import "kui-css";
import "common-css";
import "news-css";

import "common";

import Vue from 'vue';
import VueResource from 'vue-resource';
import dateFns from "date-fns";
import {URL} from "urlstuff";
import configs from "configs";

import Loading from "Loading";
import xDialog from "Dialog";
import SportsPlayer from "sports-player";
import { NativeApi, JSEventEmitter } from "bridge";
import reqwest from "reqwest";
import bip from "bip";

Vue.use(VueResource);

const aid = URL.parse("aid");
const app = new Vue({
	delimiters: ['{=', '=}'],

	data : {
		// 加载选项
		showLoading : false,
		// 对话框选项
		dialogOptions : {
			show : false
		},
		// 图文内容
		rawHTML : "",
		// 来源
		source : "",
		// 作者
		author : "",
		// 文章标题
		title : "",
		// 文章 ID
		aid : "",
		// 发表时间
		time : "",
		// 真实地址
		mobileUrl : ""
	},

	methods : {
		// 监听对话框隐藏事件
		onDialogRemove(){
			this.dialogOptions.show = false;
		},

		// 获取图文详情
		getNews(){
			
			if(!aid){
				this.dialogOptions = {
					show : true,
					title : "图文资讯ArticleID不能为空"
				}
				return;
			}

			reqwest({
				url : `${configs.api}/mobile/v1/article/show?id=${aid}`,
				type : 'jsonp',
				jsonpCallback : 'cb',
				jsonpCallbackName : 'news'
			}).then(
				(response) => {
						const {code, msg, data, update_time} = response;
						if( code == 0 ){
							// 对象的解构赋值		从数组和对象中提取值，对变量进行赋值
							let { id, title, keyword, author, source, update_time, mobile_url } = data;
							let { vid, content } = this.parser(data.content);

							this.aid = id;
							this.rawHTML = this.fixImages(content);
							this.title = title;
							this.keyword = this.toString(keyword);
							this.source = this.toString(source);
							this.author = this.toString(author);
							this.time = update_time ? dateFns.format(update_time * 1000, "YYYY-MM-DD HH:mm") : "";
							this.mobileUrl = mobile_url;

							this.$nextTick(()=>{
								if(vid){
									// 生成播放器
									new SportsPlayer({
										playerBox : "#player",
										// vid : 25276161,
										vid : vid,
										height : "10rem",
										videoType : 0
									}).makePlayer()
								}
							});
							return;
						}
						this.dialogOptions = {
							show : true,
							title : msg
						};
					}
					
					/*
					,(response)=>{
						this.dialogOptions = {
							show : true,
							title : "Woops 数据接口异常",
							content : response.status
						};
					}
					*/
				)
		},

		// 格式化图文内容 将[MARK]...[[/MARK]]的内容替换为DOM 节点
		parser(content){
			var raw = {}, regVID = /\d+(?=\[\/MEMO\])/;
			if(regVID.test(content)){
				raw['vid'] = regVID.exec(content)[0];
			}
			raw["content"] = content.replace(/\[MARK\](.*)(\[\/MARK\])/, "<div id='player'></div>");
			return raw;
		},

		// 修补后台返回的数据中 图片 alt 属性丢失引号问题 
		fixImages(content){
			content = content.replace(/(alt\=)(.*)(?=src\=)/g, function(match, alt, text){
				if(!/['"]/.test(text)){
					text = `"${text}" `;
				}
				return alt + text;
			});
			return content;
		},

		// 禁用页面滚动
		disabledMove(){
			document.addEventListener("touchmove", function(e){
				e.preventDefault();
			}, false)
		},

		// 页面统计分析
		getDeviceInfo(){
			var isApp = NativeApi.checkJsApi;
			if(isApp){
				// 监听 device-info 事件
				JSEventEmitter.on('device-info', (payload, bookmark)=>{
					const {puid, uid, vip} = payload;
					if(bookmark.api === "bip"){
						bip.analyzePV({ puid,uid,vip });
					}
				})
				// 获取设备信息
				NativeApi.getDeviceInfo({
					api : 'bip'
				});
			}
			else {
				bip.analyzePV({ puid : '',uid : '', vip : 0 });
			}
		},

		toString(params){
			return typeof params === "string" ? params : (Array.isArray(params) ? params.join(',') : params);
		}
	},

	components : { Loading, xDialog },
	
	mounted(){
		// 获取图文详情
		this.getNews();
		// BIP 数据分析
		this.getDeviceInfo();
	}
});

app.$mount("#layout");











