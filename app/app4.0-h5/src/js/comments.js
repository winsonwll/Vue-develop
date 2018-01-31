
import "kui-css";
import "common-css";
import "comments-css";

import "common";
import dateFormat from "date-format";
import {URL} from "urlstuff";
import IScroll from "iscroll-probe";
import {JSEventEmitter, NativeApi} from "bridge";

import mobile from 'mobile';
import restrictor from "./pub/restrictor";


import Vue from 'vue';
import reqwest from "reqwest";

import Loading from "Loading";
import xDialog from "Dialog";

var myScroll, step = 0, pageIndex = 0;
var APPDATA = {};
var once = true;

const encode = encodeURIComponent, decode = decodeURIComponent;
const TYPEMAP = {"video" : "vod_", "photos" : "sportsphoto_", "article" : "sportsarticle_"};
// 评论ID
const COMMENTID = URL.parse('commentid');
// 评论类型
const TYPE = URL.parse('type');
// 平台产品线 pplive|live|sport|tribe
const PLATFORM = "pplive";
// 主题标志
const REFNAME = (()=> TYPEMAP[TYPE] + COMMENTID)();
// 来源设备端
const APPPLT = 'web';
// 来源
const FROM = 'web';

// alert(location.href);

const app = new Vue({
	delimiters : ["{=", "=}"],

	components : { Loading, xDialog },

	data : {
		showLoading : false,
		loadingTips : "数据加载中",
		once : true,
		noComments : false,

		dialogOptions : {
			show : false
		},
		// 评论总数
		counter : 0,
		commentLists : [],

		// 下拉更新 状态样式 loading | refresh
		pdStyles : "",
		// 下拉更新 状态是否可见
		pdShow : false,
		// 下拉更新 状态文本提示
		pdLabel : "",
		// 下拉更新 静态文本是否可见
		pdTipsShow : true,

		// 上拉加载更多
		puStyles : "",
		puLabel : "",
		puShow : false,
		// 当前一级登录的用户昵称
		webnickname : ''
	},

	methods : {
		/**
		 * 获取评论列表信息
		 * @param  {str|num}  pn         获取第几页评论
		 * @param  {str|num}  ps         获取多少条数据
		 * @param  {Boolean} showLoader  是否显示加载提示
		 * @param  {String}  action      获取到信息之后是刷新[update](下拉)还是追加[add](上拉)
		 */

		 //函数的解构赋值	在我们封装函数的时候，如果形参较多，为了使用者不需要按顺序来传入参数，往往用一个object来承载所有的参数
		getComments({ pn, ps, showLoader, action, onSuccess }){
			ps = ps || 20;
			showLoader = showLoader || false;
			action = action || "update"; 
			onSuccess = onSuccess || function(){};

			const COMMENTLIST = `http://apicdn.sc.pptv.com/sc/v3/${PLATFORM}/ref/${REFNAME}/feed/list?appplt=${APPPLT}&action=1&pn=${pn}&ps=${ps}&from=${FROM}&version=1.0.0&format=jsonp&cdn=${restrictor(1)}`;
			const self = this;

			if(showLoader){
				this.showLoading = true;
			}

			reqwest({
				url : COMMENTLIST,
				type : 'jsonp',
				jsonpCallback : 'cb',
				jsonpCallbackName : 'whatever'
			})
			.then(
				(response)=>{
					const {err, data, msg} = response;
					this.showLoading = false;
					if(!err){
						// 更新评论总数	
						this.counter = data.total;
						// console.log(data.page_list);
						if(data.page_list.length){
							this.upInit.call(this, data.page_list);
						}
						// update 下拉刷新
						if(action == "update"){
							this.commentLists = data.page_list;
						}
						// 加载更多
						else {
							this.commentLists = this.commentLists.concat(data.page_list);
							// 若下拉加载不到更多数据，页码还原到上一页
							if(!data.page_list.length){
								pageIndex--;
							}
						}

						// 首次加载
						if(once){
							once = false;
							this.once = false;
							if(!this.commentLists.length){
								this.noComments = true;
							}
						}

						// DOM 更新时重新初始化滚动
						this.$nextTick(function(){
							// 若滚动条尚未初始化 则先初始化滚动条 
							if(!myScroll){
								this.createScroll();
								this.once = false;
								pageIndex++;
							}
							else {
								onSuccess();
							}
						}.bind(this))
						return;
					}
					this.dialogOptions = {
						show : true,
						title : msg
					};
				}
				
				/*
				,(response)=>{
					this.showLoading = false;
					this.dialogOptions = {
						show : true,
						title : 'Woops, 接口请求错误',
						content : response.url
					};
				}
				*/
			)
		},

		// 点赞
		praise(id, nums, item){
			var { praise } = item;
			var api = `http://apicdn.sc.pptv.com/sc/v3/${PLATFORM}/feed/${id}/invoke/up?_method=post&appplt=${APPPLT}&appver=`;
			if(praise){
				setTimeout(()=>{
					this.dialogOptions = {
						show : true,
						title : "您已经点过赞了"
					};	
				}, 30)
				return;
			}

			// 显示请求进度
			this.showLoading = true;
			this.loadingTips = "正在点赞";

			reqwest({
				url : api,
				type : 'jsonp',
				jsonpCallback : 'cb'
			})
			.then(
				(response)=>{
					const { err, msg, data } = response;
					// 隐藏请求进度
					this.showLoading = false;
					this.loadingTips = "数据加载中";

					if(!err){
						this.$set(item, "praise", 1);
						item.up_ct = (parseInt(item.up_ct, 10) || 0) + 1;
						return;
					}
					this.dialogOptions = {
						show : true,
						title : msg
					};

				}
				
				/*
				,(dfd)=>{
					this.dialogOptions = {
						show : true,
						title : "Woops! 点赞接口挂了"
					};
					// 隐藏请求进度
					this.showLoading = false;
					this.loadingTips = "数据加载中";
				}
				*/
			)

		},

		// 对话框事件绑定
		onDialogRemove(){
			this.dialogOptions.show = false;
		},

		// 初始化滚动条
		createScroll(){
			var scrollerID = "#scroller-wrap";
			var pdNode = document.querySelector(".pull-down");
		    var threshold;
			var self = this;

			if(!pdNode){
				return;
			} 

			threshold = this.getStyle(pdNode, "height");
			
		    //加载状态 只有当为0时才能再次加载，这是防止过快拉动刷新
		    // 0 默认 
		    // 1 处于显示加载状态
		    // 2 正在加载数据

		    myScroll = new IScroll(scrollerID, {
		        scrollbars: false,
		        mouseWheel: false,
		        // The scrollbar becomes draggable and user can interact with it.
		        interactiveScrollbars: false,
		        // When scrolling outside of the boundaries the scrollbar is shrunk by a small amount.
		        shrinkScrollbars: 'scale',
		        fadeScrollbars: true,
		        scrollY: true,
		        click : true,
		        tap : true,
		        probeType: 2,
		        bindToWrapper: true,
		        preventDefault : false
		    });

		    myScroll.on("scroll", function() {
		    	// 只相应 处于 idl 状态下的滚动 防止 数据请请假期间频繁发出滚动数据请求
		        var pdRunning = /(?:loading)|(?:refresh)/.test(self.pdStyles),
		        	puRuning = self.puStyles.indexOf("refresh") > -1;

		        if (step == 0 && !pdRunning && !puRuning) {
		            //下拉刷新操作  
		            if (this.y > threshold) { 
		                self.pdTipsShow = false;
		                self.pdStyles = "refresh";
		                self.pdShow = true;
		                self.pdLabel = "松开刷新...";
		                self.$nextTick(function(){
		                	step = 1;
		                	myScroll.refresh();
		                })
		            
		            //上拉加载更多  
		            } else if (this.y < (this.maxScrollY - threshold/3)) { 
		            	self.puStyles = "refresh";
		            	self.puShow = true;
		            	self.puLabel = "正在载入...";
		                step = 1;
		                // 防止数据过快返回 造成上拉抽搐...体验不好
		                setTimeout(()=>{
		                	self.getComments({
		                		pn : ++pageIndex,
		                		ps : 20,
		                		showLoader : false,
		                		action : "add",
		                		onSuccess : function(){
		                			self.puShow = false;
		                			self.puStyles = "";
		                			self.$nextTick(()=>{
		                				myScroll.refresh();
		                				step = 0;
		                			})
		                		}
		                	})
		                }, 500)
		                
		            }
		        }
		    });

		    myScroll.on("scrollEnd", function() {
		    	console.log("scrollEnd");
		        //下拉刷新操作
		        if (step == 1) {
		            if (self.pdStyles == "refresh") {
		            	self.pdStyles = "loading";   
		            	self.pdLabel = "正在刷新...";
		                step = 2;
        		        self.getComments({
        		        	pn : 0,
        		        	ps : 20,
        		        	showLoader : false,
        		        	action : "update",
        		        	onSuccess : function(){
        		        		pageIndex = 0;
            			        self.pdStyles = "";
            			        self.pdShow = false;
        		        		self.pdTipsShow = true;
        		        		self.$nextTick(()=>{
        		        			myScroll.refresh();
            		            	step = 0;
        		        		})
        		        	}
        		        });
		            }
		        }
		    });
		},

		// 获取样式
		getStyle(node, name){
			var style = getComputedStyle(node, null)[name];
			return parseFloat(style, 10);
		},

		// 禁用页面滑动
		disabledMove(){
			var prevX = 0, prevY = 0;
			document.addEventListener('touchmove', function(e) {
				e.preventDefault();
				return;
				// var { clientY, clientX } = e.touches[0], diffx, diffy;

				// if(!prevX || !prevY){
				// 	e.preventDefault();
				// 	prevX = clientX;
				// 	prevY = clientY;
				// 	return;
				// }
				
				// diffx = Math.abs(clientX - prevX);
				// diffy = Math.abs(clientY - prevY);

				// if(diffx < 100 && diffy){
				// 	e.preventDefault();
				// 	prevX = clientX;
				// 	prevY = clientY;
				// }

			}, false);
		},

		// 解析 json 对象
		parseJSON(jsonStr){
			return typeof jsonStr == "string" ? JSON.parse(jsonStr) : jsonStr;
		},

		// 回复
		// pid 该评论回复的那条评论 ID
		// id  该评论的评论ID
		// index 该数据在数据列表中的索引
		// atnickname 该评论的用户名
		// atusername 该评论的用户昵称
		// level 改评论的级别 一级评论还是二级评论
		replyHandle({pid, id, index, atnickname, atusername, level}){
			const {username, nickname, token} = APPDATA;

			// alert(JSON.stringify({pid, id, index, atnickname, atusername, level}));

			// 未登录 弹出登录框
			if(!token){
				// alert("未登录，准备弹窗");
				NativeApi.callLoginBox({
					'api' : 'callLoginBox', 
					"attempt" : "callSoftKeyboard", 
					pid, id, index, atnickname, atusername, level
				});
				return;
			}

			// alert("已经登录, 准备唤起软键盘");
			// 已经登录 唤醒软键盘 同时注册输入完成之后的事件监听

			NativeApi.callSoftKeyboard({'api' : 'callSoftKeyboard', pid, id, index, atnickname, atusername, level});
			// JSEventEmitter.send('user-input', JSON.stringify({content:"一二三四五上山打老虎"}), JSON.stringify({'api' : 'callSoftKeyboard', pid, id, index, atnickname, atusername, level}));
		},

		// 初始化点赞状态 判断用户是否已经顶过
		upInit(result){
			const maps = this.extract(result);
			const feedids =  Object.keys(maps);
			const url = `http://api.sc.pptv.com/sc/v3/${PLATFORM}/feed/invoke/isup?appplt=${APPPLT}&appver=''&feedids=${feedids.join(',')}&cdn=${restrictor(1)}`;
			reqwest({
				url : url,
				type : 'jsonp',
				jsonpCallback : 'cb',
				jsonpCallbackName : "whatever"
			})
			.then(
				(res)=>{
					const { err, data, msg } = res;
					if(!err){
						for(let p in data){
							if(data.hasOwnProperty(p)){
								this.$set(maps[p], 'praise', data[p]) ;
							}
						}
						return;
					}
					this.dialogOptions = {
						show : true,
						title : `${msg}:${err}`
					}
				},
				(dfd, status)=>{
					// do nothing
				}
			)
		},

		// 遍历传入的数据对象 萃取 ID
		// 返回一个 评论id 和 数据原始对象的映射表
		extract(list){
			var ret = {};
			if(list.length){
				list.forEach((v)=>{
					ret[v['id']] = v;
					if(v.replys.length){
						v.replys.forEach((it)=>{
							ret[it['id']] = it;
						})
					}
				})
			}
			return ret;
		},

		// 注册各种事件回调
		nativeListener(){
			// 监听 设备信息事件
			JSEventEmitter.on('device-info', (payload, bookmark)=>{
				// alert("收到 device-info");
				APPDATA = payload;
				this.webnickname = APPDATA.nickname;
				// alert("device-info的内容为:" + JSON.stringify(payload));
			})

			// 监听用户输入完成事件
			JSEventEmitter.on('user-input', (payload, bookmark)=>{
				// alert("收到 user-input");

				if(!bookmark){
					this.dialogOptions = {
						show : true,
						title : "说好的 bookmark 呢"
					};
					return;
				}

				var { id, pid, index, atnickname, atusername, level } = bookmark;
				var { content, token } = payload;
				var rid = level == 1 ? id : pid;
				var token = token || APPDATA.token;
				var raw = {
					"content" : encode(content),
					"user_name" : APPDATA.username,
					"at_id" : level == 1 ? "" : id,
					"at_user_name" : atusername,
					"at_nick_name" : atnickname   
				};

				var data = (()=>{
					var _raw = JSON.stringify(raw);
					return _raw;
				})();

				var RELAYAPI = `http://apicdn.sc.pptv.com/sc/v3/${PLATFORM}/ref/${REFNAME}/feed/${rid}/reply?appplt=${APPPLT}&_method=post&_json=${data}&tk=${token}&from=${FROM}&version=1.0.0&format=jsonp`;

				this.showLoading = true;

				reqwest({
				    url: RELAYAPI, 
				    type: 'jsonp', 
				    jsonpCallback: 'cb'
				})
				.then(
					// 成功
					(response)=>{
				    	const { data, err, msg } = response;
						if(!err){
							this.dialogOptions = {
								show : true,
								title : "评论成功"
							}
							// alert("评论 data:" + data + "nickname:" +  APPDATA.nickname + "username:" + APPDATA.username);
							this.commentLists[index].replys.unshift({
								id : data,
								create_time : Date.now(),
								content : content,
								user : {
									nick_name : APPDATA.nickname,
									user_name : APPDATA.username,
									icon : APPDATA.usericon
								},
								at_nick_name : atnickname,
								up_ct : 0,
								reply_ct : 0
							})

							this.$nextTick(function(){
								myScroll.refresh();
							})
							return;
						}
						this.dialogOptions = {
							show : true,
							title : msg
						}
					}
					
					// 失败
					/*
					,(response)=>{
						this.dialogOptions = {
							show : true,
							title : 'Woops，接口挂了'
						}
					}
					*/
				)
				.always(()=>{
					this.showLoading = false;
				})
			});

			// 监听用户完成登录、注册、退出事件
			JSEventEmitter.on('user-info', (payload, bookmark)=>{
				// alert('收到 user-info 内容为:' + JSON.stringify(payload) + "bookmark:" + JSON.stringify(bookmark));
				APPDATA = payload;
				switch(bookmark.attempt){
					case 'callSoftKeyboard' :
						let { attempt, ...args } = bookmark;	//传递数组的每个元素作为参数
						// alert("args:" + JSON.stringify(args));
						NativeApi.callSoftKeyboard(args);
						break;

				}
			});

			// 监听用户退出事件
			JSEventEmitter.on("user-logout", (payload, bookmark)=>{
				// alert('收到 user-logout 内容为:' + JSON.stringify(payload) + "bookmark:" + JSON.stringify(bookmark));
				APPDATA = payload;
				location.reload();
			})

			// setTimeout(()=>{
			// 	alert('准备退出');
			// 	NativeApi.applyUserLogout({"api" : "applyUserLogout"});
			// }, 3000)

		},

		// 获取用户信息
		getDeviceInfo(){
			NativeApi.getDeviceInfo({"api" : "getDeviceInfo"})
			// var token = 'GdZCpRA0phvAam2FdVP5xcGgCd4VKsdc_6ekccNHALKid3bUmOc1ZJsQ20bWG4L0Lv3IoZUG99IzP4AtujsvQUXeZnnI87ORG35Sfmp4PJtjccl_OOVoLR291i5DKg2R6YkWjonnUODIMW7sRD1ncnYtmgnQZw_XsmwkrleWwvQ';
			// JSEventEmitter.send(
			// 	'device-info', 
			// 	JSON.stringify({
			// 		username : "lei_evol",
			// 		token : btoa(token),
			// 		nickname : "lei_evol",
			// 		avator : "https://ss2.baidu.com/-vo3dSag_xI4khGko9WTAnF6hhy/image/h%3D200/sign=4870f53f0b087bf462ec50e9c2d2575e/d439b6003af33a87bcb5ca6ecf5c10385243b5ee.jpg"
			// 	}), 
			// 	JSON.stringify({"api" : "getDeviceInfo"})
			// );
		}
	},

	filters : { dateFormat },

	mounted(){
		// 初次加载获取页面评论内容
		if(!COMMENTID || !TYPE){
			this.dialogOptions = {
				show : true,
				title : "commentid和type都不能为空"
			}
			return;
		}
		this.getComments({showLoader : true, ps : 20, pn : 0 });
		// 禁用页面滑动
		this.disabledMove();
		// 注册各种事件回调
		this.nativeListener();
		// 获取设备信息
		this.getDeviceInfo();
		
	}
});

app.$mount("#layout");




