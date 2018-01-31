<style scoped>

.mr-info { padding: .5rem 0; background-color: #fff; margin-top: .25rem; }
.mr-info .hd { padding-left: .55rem; height: .9rem; line-height: .9rem; margin-bottom: .5rem  }
.mr-info .bd { padding: .5rem 0; }
.mr-info .bd ul { height: 3.5rem;  } 
.mr-info .bd li { height: 100%; -webkit-box-pack:start; }
.mr-info .bd li:first-of-type { -webkit-box-align:end; box-align:end; }
.mr-info .bd li:last-of-type { -webkit-box-align:start; box-align:start; }
.mr-info .bd .item { height: 1.7rem; line-height: 1.7rem; }
.mr-info .bd .time { -webkit-box-flex : 0; box-flex:0; width: auto; background: url(../css/dot.jpg) center 0 repeat-y; background-size: 1px auto; margin: 0 .3rem; }
.mr-info .bd .time .item { display: block; position: relative; background-color: #fff; width: 1.7rem;  }
.mr-info .bd .time .item { border-radius: 100%; border:1px solid #cfcfcf; text-align: center; }
.mr-info .bd .time .item:before { content: "′"; position: absolute; right: .18rem; top: 0;  }

.mr-info .bd .card,
.mr-info .bd .cardx2,
.mr-info .bd .cardx2:before { width: .7rem; height: 1rem; border-radius: .15rem;  }
.mr-info .bd .card,
.mr-info .bd .cardx2 { margin: 0 .25rem; position: relative; }
.mr-info .bd .cardx2 { margin: .2rem .25rem 0; }
.mr-info .bd .cardx2:before { position: absolute; left: 30%; top: -.35rem; content: ""; }
.mr-info .bd .red,
.mr-info .bd .cardx2.red:before { background-color: #ff5c5d; }
.mr-info .bd .yellow,
.mr-info .bd .cardx2.yellow:before{ background-color: #ffd926;  }

.mr-info .bd .ball { height: .8rem; width: .8rem; background: url(../css/ball.png) no-repeat; background-size: contain; }

.mr-info .bd .substitution i { width: 1rem; height: 1rem; background: url(../css/substitution.png) no-repeat; background-size: contain; margin:0 .2rem; }
.mr-info .bd .substitution .detail { line-height: 1.4;  } 
.mr-info .bd .substitution .detail span { display: block;  }
.mr-info .bd .up { color: #82b800; }
.mr-info .bd .down { color: #c0c0c0; }
.mr-info .bd .end { padding: .5rem; border:1px solid #ccc; border-radius: .2rem;  }
</style>


<template>
    <section class="mr-info kui-txt-sub" v-if="info.result != ''">
        <h5 class="kui-border-tit kui-txt-info hd" v-cloak>{{ info.title }}</h5>
        <div class="bd" v-cloak>
            <div class="hook" v-for="(item, index) in info.result" :data-id="index" :key="index" :data-event="item.event" :data-type="item.type">
                <ul class="kui-tiled" v-if="item.event != -1" >
                    <li>
                        <div class="item" v-if="item.type == 1" v-bind:class="[item.event == 6 ? 'substitution' : '']">
                            <!-- 人物 -->
                            <div class="i-b" v-cloak>{{ item.pname }}</div>
                            <!-- 事件 : 0进球 1点球 2乌龙球-->
                            <template v-if="[0, 1, 2].indexOf(item.event) > -1">
                                <div class="i-b kui-txt-red" v-cloak>({{ item.event | translate }})</div>
                                <div class="i-b ball" ></div>
                            </template>
                            <!-- 事件 3黄牌 -->
                            <div class="i-b yellow card" v-if="item.event == 3"></div>
                            <!-- 事件 4红牌 -->
                            <div class="i-b red card" v-if="item.event == 4"></div>
                            <!-- 事件 5两黄变一红 -->
                            <template v-if="item.event == 5">
                                <div class="i-b yellow cardx2"></div>
                                <div class="i-b red card"></div>
                            </template>
                            <!-- 事件 6换人 -->
                            <template class="item substitution" v-if="item.event == 6">
                                <div class="i-b detail">
                                    <span class="up" v-cloak>{{ item.upname }}</span>
                                    <span class="down" v-cloak>{{ item.downname }}</span>
                                </div>
                                <i class="i-b"></i>
                            </template>
                        </div>
                    </li>
                    <li class="time">
                        <div class="item" v-cloak>{{ item.minute }}</div>
                    </li>
                    <li>
                        <div class="item" v-if="item.type == 2" v-bind:class="[item.event == 6 ? 'substitution' : '']">
                            <!-- 事件 : 0进球 1点球 2乌龙球-->
                            <template v-if="[0, 1, 2].indexOf(item.event) > -1">
                                <div class="i-b ball" ></div>
                                <div class="i-b kui-txt-red" v-cloak>({{ item.event | translate }})</div>
                            </template>
                            <!-- 事件 3黄牌 -->
                            <div class="i-b yellow card" v-if="item.event == 3"></div>
                            <!-- 事件 4红牌 -->
                            <div class="i-b red card" v-if="item.event == 4"></div>
                            <!-- 事件 5两黄变一红 -->
                            <template v-if="item.event == 5">
                                <div class="i-b red card"></div>
                                <div class="i-b yellow cardx2"></div>
                            </template>
                            <!-- 事件 6换人 -->
                            <template class="item substitution" v-if="item.event == 6">
                                <i class="i-b"></i>
                                <div class="i-b detail">
                                    <span class="up" v-cloak>{{ item.upname }}</span>
                                    <span class="down" v-cloak>{{ item.downname }}</span>
                                </div>
                            </template>
                            <!-- 人物 -->
                            <div class="i-b" v-cloak>{{ item.pname }}</div>
                        </div>
                    </li>
                </ul>
                <!-- 比赛结束 -->
                <div class="kui-center" v-else>
                    <div class="end">比赛结束</div>
                </div>  
            </div>
        </div>
    </section>
</template>


<script>
import "kui-css";

const defaultInfo = {
	title: '',
	type: 0,
	result: []	
};

export default {
	props : {
		matchInfo : {
			type : Object,
			required : true
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

	computed: {
		info(){
			var ret = Object.assign({}, defaultInfo, this.matchInfo);
			return ret;
		}
	},

	data(){
		return {}
	}
}
</script>