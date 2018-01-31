import "kui-css";
import "common-css";
import "player-css";


import "common";
import swiper from "swiper";
import dateFormat from "date-format";
import {URL} from "urlstuff";
import configs from "configs";

import Vue from 'vue';
import VueResource from 'vue-resource';

import Loading from "Loading";
import xDialog from "Dialog";
import vsPannel from "Vs-pannel";
import matchResult from "Matchresult";
import { NativeApi, JSEventEmitter } from "bridge";
import reqwest from "reqwest";

Vue.use(VueResource);

const SID = URL.parse("sectionid");
const CID = URL.parse("channelid");
var APPDATA = {};
const app = new Vue({
	delimiters : ["{=", "=}"],
	
	components : { Loading, xDialog, vsPannel, matchResult },
	data : {
		showLoading : false,
		loadingTips : "数据加载中",
		dialogOptions : {
			show : false
		},

		schedule: {
			hostTeamLogo : "",
			guestTeamLogo : "",
			
			hostTeamScore : 0,
			guestTeamScore : 0,
			result : true,

			date : "",
			name: '',
			
			hostTeamName : "",
			guestTeamName : "",

			title: "",
			season: "", //赛事
			rule: "", //赛制
			turn: "" //轮次
		},

		playList: [],

		teamstatistics: [],

		//实时赛况
		matchInfo: {
			title: "",
			type: 0,
			result: []
		}
	},
	
	filters : {
		dateFormat,
		possession: function(a, n){
			return a == '控球率' ? n + '%' : n;
		}
	},

	methods : {
		onDialogRemove(){
			this.dialogOptions.show = false;
		},

		//获取页面接口
		onPageStatus(){
			if(!SID){
				this.dialogOptions = {
					show : true,
					content : "SECTION ID不能为空"
				};
				return;
			}

			// 显示 Loading
			this.showLoading = true;

			reqwest({
				url : `${configs.api}/mobile/v1/live/show?section_id=${SID}`,	//字符串插值  模板对象 语法${NAME}
				type : 'jsonp',
				jsonpCallback : 'cb',
				jsonpCallbackName : 'replay'
			}).then(
				(response) => {
					const { code, msg, data } = response;

					if( code == 0 ){
						// 隐藏 Loading
						this.showLoading = false;


						//主客队信息
						this.schedule.hostTeamLogo = data.schedule.host_team_logo;
						this.schedule.guestTeamLogo = data.schedule.guest_team_logo;
						this.schedule.hostTeamScore = data.schedule.host_team_score;
						this.schedule.guestTeamScore = data.schedule.guest_team_score;
						this.schedule.result = true;
						this.schedule.name = data.schedule.league_name;
						this.schedule.title = data.schedule.title;
						this.schedule.season = data.schedule.league_season; 
						this.schedule.rule = data.schedule.league_rule; 
						this.schedule.turn = data.schedule.league_turn; 
						this.schedule.type = data.schedule.league_type; //足球: 210270   篮球: 210272
						let setDate = function( d ){
							let rd = new Date(d * 1000); 
							return {
								yy: rd.getFullYear(),
								MM: rd.getMonth() + 1,
								dd: rd.getDate(),
								hh: rd.getHours(),
								mm: rd.getMinutes(),
								ss: rd.getSeconds()
							};
						};
						let getDate = setDate(data.schedule.start_time);
						let fn = function(p){ return ( p <= 9 ) ? '0' + p : p };
						this.schedule.date = fn(getDate.MM) + '月' + fn(getDate.dd) + '日 ' + fn(getDate.hh) + ':' + fn(getDate.mm);
						this.schedule.hostTeamName = data.schedule.host_team_title;
						this.schedule.guestTeamName = data.schedule.guest_team_title;


						//比赛回顾
						if( data.channel_after ){
							this.playList = data.channel_after;

							//模拟数据
							/*
							this.playList = [
								{
									channel_id: "25396073",
									title: "1欧冠-1617赛季-小组赛-第6轮-拜仁慕尼黑vs马德里竞技-全场",
									weblink: "http://v.pptv.com/show/aSgOjfVbywls6lI.html",
									clientlink: "pptv://0a2enqmepqCjnJzHraCSzLOV",
									props: "1,6128,189,352,8311,8317",
									sloturl: "http://v.img.pplive.cn/cp120/72/01/72016ef8948a42b3e2cf9b78d1cb6d2b/3.jpg",
									pay: "0",
									icon: "0",
									cornermark: "全场"
								},
								{
									channel_id: "25396079",
									title: "2欧冠-1617赛季-小组赛-第6轮-拜仁慕尼黑1:0马德里竞技-精华",
									weblink: "http://v.pptv.com/show/byoMiaicNZyQdq6FA.html",
									clientlink: "pptv://0a2enqmepqCjopzHraCSzLOV",
									props: "4,6128,189,352,8311,8317",
									sloturl: "http://v.img.pplive.cn/cp120/58/b0/58b034c6bb997eb708a739f5ed64163f/3.jpg",
									pay: "0",
									icon: "0",
									cornermark: "精华"
								}
							];
							*/

							this.$nextTick(function(){
								//监听端通知js
								this.bindClient();

								let mySwiper = new swiper('.swiper-container', {
									// autoplay: 3000, //可选选项，自动滑动
									// autoplayDisableOnInteraction: false,
									// loop: true, //重复
									slidesPerView: 3.4, //展示位
									autoHeight: true //高度随内容变化
								});
							});
						}
						

						//技术统计
						if( data.teamstatistics ){
							this.teamstatistics = data.teamstatistics;
						}

						//实时赛况
						if( data.gamerecord ){
							this.matchInfo.title = "实时赛况";
							this.matchInfo.type = data.schedule.league_type ? data.schedule.league_type : 0;
							this.matchInfo.result = data.gamerecord;
						}
					}


					//接口失败
					// else {
					// 	this.dialogOptions = {
					// 		show : true,
					// 		title : msg
					// 	}		
					// }
				}
			);
		},

		//播放列表状态处理
		playListStatus( cid ){
			let allBtns = document.querySelectorAll('.swiper-wrapper>li>a');
        	let i = 0;
        	let len = allBtns.length;
        	for( ; i < len; ++i ){
        		allBtns[i].removeAttribute('class');
        		if( allBtns[i].getAttribute('data-cid') == cid ) allBtns[i].setAttribute('class', 'on');
        	}
		},

		//切换播放
		changePlay(e){
            let _this = e.currentTarget,
            	_cid = _this.getAttribute('data-cid');

            if( NativeApi.playVideo ){
	        	this.playListStatus( _cid );
            	NativeApi.playVideo({ 'api': 'getPlayer' }, { channelid: _cid });
        	}
		},

		//监听端通知js
		bindClient(){
			CID && this.playListStatus( CID );
			
			// 监听
			JSEventEmitter.on('player', (payload, bookmark)=>{
				// alert( '收到 player 内容为:' + JSON.stringify(payload) + "bookmark:" + JSON.stringify(bookmark) );
				APPDATA = payload;
				this.playListStatus( APPDATA.channelid );
			});
		}
	},
	
	mounted(){
		//获取页面接口
		this.onPageStatus();
	}
});

app.$mount('#layout');