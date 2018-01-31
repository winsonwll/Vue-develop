<style>
[cloak] { display: none;  }
.vs-pannel-title { background-color: #fff; padding: .5rem .5rem 0;  }
.vs-pannel-title+.vs-pannel { padding-top:0;  }
.vs-pannel { text-align: center; padding: .85rem .25rem; background-color: #fff; line-height: 1.3; }
.vs-pannel .score { width: 1.8rem; -webkit-box-flex : 0; box-flex:0; overflow: hidden; }
.vs-pannel img { width: 2.2rem; height: 2.2rem; }
.vs-pannel .info { width: 7.35rem; -webkit-box-flex : 0; box-flex : 0; }
.vs-pannel .notvs{width: 100%;}
</style>

<template>
	<div>
		<h5 class="vs-pannel-title kui-txt-info" v-cloak v-if="!vsType">{{ info.name }}</h5>
		<ul class="vs-pannel kui-tiled kui-txt-sub">
			<template v-if='vsType'>
				<li>
					<div>
						<img v-bind:src="info.hostTeamLogo" v-if='info.hostTeamLogo' alt="">
					</div>
					<p v-cloak>{{ info.hostTeamName }}</p>
				</li>
				<li class="score" v-show="info.result"><h2 v-cloak>{{ info.hostTeamScore }}</h2></li>
			</template>
			<li class="info" :class="!vsType ? 'notvs' : '' ">
				<div v-cloak>{{ info.date }}</div>
				<!-- <div v-cloak>{{ info.name }} {{ info.lun }}</div> -->
				<div v-cloak v-if="vsType">{{ info.name }} {{ info.rule }} {{ info.turn }}</div>
				<div v-cloak v-else>{{ info.title }}</div>
			</li>
			<template v-if='vsType'>
				<li class="score" v-show="info.result" ><h2 v-cloak>{{ info.guestTeamScore }}</h2></li>
				<li>
					<div>
						<img v-bind:src="info.guestTeamLogo" v-if='info.guestTeamLogo' alt="">
					</div>
					<p v-cloak>{{ info.guestTeamName }}</p>
				</li>
			</template>
		</ul>
	</div>
</template>

<script>
import "kui-css";

const defaultLogo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFQAAABmCAYAAABV2bZnAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA25pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoyOTU0OEVCMUFGRDgxMUU2QUIzQzlEMDhBNERGQjg5QSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpDQzJFNTA2N0JBRDQxMUU2OERDMENCMzUyODZGQkFCQiIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpDQzJFNTA2NkJBRDQxMUU2OERDMENCMzUyODZGQkFCQiIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxNCAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo3M2Y5Mjc2My0yMjE4LWNlNDUtODdkNC05YjM3MDJiOTkzZmMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6Mjk1NDhFQjFBRkQ4MTFFNkFCM0M5RDA4QTRERkI4OUEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6mg33TAAAExklEQVR42uydaWxMURTH7zChiqqIWkOpJZQgjQgRS8QaYg9BKOkHPggJommQiAhp+EAafLCExpIQYom1ESq2xBK0tNagxNpQtZP6H+9Vmk6nnfHufXPn3fNP/m3Tvjnnza8z991377l3fGVlZYIlT768gocH8b0n/ENy7LrwXjjDQYwJ8Dq4BC6Fi+H38EP4KXzX/rlEB5jJnZOEH99T4DaKcnR2+PgEuF0Nx3yCb8KX4PNwLvwlUlBrwe8Uxv/o8PFfQzimITwATodPwM/g3fBEuE4kgHpNTeBp8AH4ud1kdGCgckRNxiL4gd2e92Kg8jQVvgFnh9AuM9AwNMN+xa5goPJUG14J34H7MVB56gZfhJcxULlaZXe5YhmoPI2A8+FODFSeEuFbTtpVBhqoGLtdHcxA5eos3J+BytUFOJmByocaz0DlqTF8joHKVQ94MwOVq7nwaAYqV/vgegxUnurDW2sC2kDhCcRKeAK6iWYDUoL9kSbpaBbxt5A/60l3HB8cxiiC7wtr3qiFRlC32xeqANE0cpzdLvyUnJSmkWl697OEWPSPbyasuaHe8BB4qLDGNSOlMfCxir+gaWSfk0KH/MJHkXyVtIKnw2lwxwjkvwd3rQw0mi9KL+BMYQ23zRfOp6zDVRd4kFev8ll2c3DI5bzpXu42UcEGle4sczHncLil1/uhq+FUF/PNMqFjvxOe51KuKabcKW2BN7iQh/qj7Uy59VworJJHN9pSY+7lJ7uQY6BJQOkVukdxjj4mASVlKI5PbWhbk4BS+XiO4hzJJgEl7VIcP8k0oGdglUteEumLP7/w0XhhlVGrEI1l5moC9BWcB3dXFL/5X6DCGiyNV5TklEZAhWKgTcrf8o8VPoGXmr3tixTGjjWtDSUVK4wdYyLQXwpj+00EqnKG95uJQJsqjP3dRKBJCmOXmAaUnqvKlXRvTANK1R4JqrtkJgEdpzj+E9OApiqOX2gS0Emi0nSvZNGGB/kmAc1UHJ/WNpWaAnSpULic29blil0JL4v2PFnrQp4zJgCl/UZyXMhD5ZrnTABK47CtXchzrPw+3qtAqYycthzq41K+7Mq3Y14Sbeh1G+7rUj6q+DvuVaBUq0kbYrV3MSfVT5V5DSiVhVN1yJoI5A4oRvNHKUQaNRoLz3ShjxlMW0UVu7LpDrStfXFpJKyxTHo70yqQRA3OrcryHt2B0trKLA3Paz38tqo/6N6Glmp4TiWimuIzXusZvmaLalYdMtDwRH3Og9UdwEDDa34m1XQQAw1do0QIG8Qy0NC0WFibuQgG6lzb7G6SYKDORUNzaeE8gIEG10lhrYkXDNS5jsAj/+eBDDRQO4Q18CIYqHMth+c4CeBnhv/uz2ko8LDTQPwKtaaAu8iAaTpQKpBdAA8TEhdXmAqUNiigweqNsgObBpQ66jQjmioULfkx5aJEy7s3CWtvZaXyMlBaNbdfWB+q8sCtpLoD9YV5/DVhLYc8Cl+NxAnrDjQuyO9pnz76ICraK45qM6/A14W1Lj6i0h3oaXiJ3fEm00wjzYXTyuLXOp6w7kALbEeN+E6JgTJQBspioAyUgbIYKANloCwGykCjD6jOH64SdaLRJtp8RNXi/GLTgDr6LBBWoP4IMACEa8fnwmqUsQAAAABJRU5ErkJggg==";

const defaultInfo = {
		// 主队 logo
		hostTeamLogo : defaultLogo,
		// 客队 logo
		guestTeamLogo : defaultLogo,
		// 主队名称
		hostTeamName : "主队名称",
		// 客队名称
		guestTeamName : "客队名称",
		// 是否有比赛结果
		result : false,
		// 主队得分
		hostTeamScore : "",
		// 客队得分
		guestTeamScore : "",
		// 比赛时间
		date : "比赛日期 时间",
		// 赛事名称
		name : "赛事名称",
		// 赛事轮次
		lun : "赛事轮次",
};

export default {
	props : {
		gameInfo : {
			type : Object,
			required : true
		}
	},

	computed : {
		info(){
			var ret = Object.assign({}, defaultInfo, this.gameInfo);
			ret.hostTeamLogo = ret.hostTeamLogo || defaultLogo;
			ret.guestTeamLogo = ret.guestTeamLogo || defaultLogo;
			return ret;
		},

		// 对阵信息
		vsType (){
			return this.info.hostTeamName && this.info.guestTeamName
		}
	},

	data(){
		return {
			defaultStyles : {
				"background-image" : "url(" + defaultLogo + ")",
				"background-size" : "contain",
				"background-repeat" : "no-repeat"
			}
		}
	}
}	
</script>




