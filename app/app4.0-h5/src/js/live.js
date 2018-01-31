
import "kui-css";
import "common-css";
import "live-css";

import "common";

import Vue from 'vue';
import VueResource from 'vue-resource';
import {URL} from "urlstuff";

import Loading from "Loading";
import xDialog from "Dialog";
import vsPannel from "Vs-pannel";
import matchResult from "Matchresult";

import dateFns from "date-fns";
import configs from "configs";
import restrictor from "./pub/restrictor";
import reqwest from "reqwest";

const SID = URL.parse("sectionid");
const TIME = 30;

const app = new Vue({
	delimiters : ["{=", "=}"],

	components : { Loading, xDialog, vsPannel, matchResult },

	data : {
		showLoading : false,
		dialogOptions : {
			show : false
		},
		gameInfo : {
			hostTeamLogo : "",
			guestTeamLogo : "",
			hostTeamScore : 0,
			guestTeamScore : 0,
			result : false,
			date : "",
			hostTeamName : "",
			guestTeamName : "",
			title : "",
			season: "", //赛事
			rule: "", //赛制
			turn: "" //轮次
		},

		result : [],
		
		matchInfo: {
			title: '',
			type: 0,
			result: []
		}
	},

	computed : {
		vsdata(){
			return this.gameInfo.guestTeamName && this.gameInfo.guestTeamName;
		}
	},

	methods : {
		// 对话框事件绑定
		onDialogRemove(){
			this.dialogOptions.show = false;
		},

		// 获取实时赛况
		getGameResult(showLoader){
			if(!SID){
				this.dialogOptions = {
					show : true,
					content : "SECTION ID不能为空"
				};
				return;
			}

			// 显示 Loading
			if(showLoader){
				this.showLoading = true;
			}

			reqwest({
				url : `${configs.api}/mobile/v1/live/show?section_id=${SID}&cdn=${restrictor(0.5)}`,
				type : 'jsonp',
				jsonpCallback : 'cb',
				jsonpCallbackName : 'anything'
			})
			.then((response)=>{
					const { code, msg, data } = response;
					if(code == 0){
						let { gamerecord:gameRecord, schedule, server_time:serverTime } = data;
						this.result = gameRecord;
						this.gameInfo = {
							hostTeamLogo : schedule.host_team_logo,
							guestTeamLogo : schedule.guest_team_logo,
							hostTeamScore : schedule.host_team_score,
							guestTeamScore : schedule.guest_team_score,
							result : true,
							date : dateFns.format(schedule.start_time * 1000, "YYYY-MM-DD HH:mm"),
							name: schedule.league_name,
							hostTeamName : schedule.host_team_title,
							guestTeamName : schedule.guest_team_title,
							title : schedule.title,
							season: schedule.league_season,
							rule: schedule.league_rule,
							turn: schedule.league_turn,
							type: schedule.league_type
						};
						this.matchInfo.title = '实时赛况';
						this.matchInfo.type = data.schedule.league_type ? data.schedule.league_type : 0;
						this.matchInfo.result = gameRecord;

						// 当且仅当比赛未结束, 轮询数据接口
						if(serverTime < schedule.end_time){
							setTimeout(()=>{
								this.getGameResult(false);
							}, 1000 * TIME)
						}
					}
					else {
						this.dialogOptions = {
							show : true,
							title : msg
						}		
					}

					this.showLoading = false;
				}
				
				
				,(response)=>{
					// 轮询数据接口
					setTimeout(()=>{
						this.getGameResult();
					}, 1000 * TIME);

					// this.dialogOptions = {
					// 	show : true,
					// 	title : "实时赛况接口挂了",
					// 	content : "Error:" + response.status
					// }

					this.showLoading = false;
				}
				
			)
			
		}
	},

	filters : {
		translate(value){
			return {
				"0" : "进球",
				"1" : "点球",
				"2" : "乌龙球"
			}[value];
		}
	},

	mounted(){
		// 获取实时赛况
		this.getGameResult(true);
	}
});

app.$mount("#layout");




