
// 业务内 alias 引入
import 'layout-css';
// 业务内 相对目录引入
import message from './message';
// 公共模块引入
import fastclick from 'libs/fastclick/fastclick';

import xdialog from 'comps-vue/dialog/dialog';

import Vue from 'vue';

fastclick(document.body);

const app = new Vue({
	delimiters : ["{=", "=}"],

	data: {
		dialogOptions : {
			show : true,
			title : 'ff',
			content : 'xx'
		},
		msg : message
		
	},

	components : {
		xdialog
	},

	methods : {
		onDialogRemove(){
			this.dialogOptions.show = false;
		}
	}
});

app.$mount('#box');








