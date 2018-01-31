<style scoped>
	button { color: #478cfe;  }
	.ui-dialog-bd>div, 
	.ui-dialog-bd>ul, 
	.ui-dialog-bd > h4 { word-break: break-all;  }
	.ui-txt-tips { color: #000; }
</style>
<template>
	<div class="ui-dialog" v-bind:class='dialogStyles'>
	    <div class="ui-dialog-cnt">
	        <div class="ui-dialog-bd">
	            <h4>{{ dialogOptions.title }}</h4>
	            <div class="ui-txt-tips">{{ dialogOptions.content }}</div>
	        </div>
	        <div class="ui-dialog-ft">
	            <button type="button" data-role="button" v-on:click='hideDialog'>我知道了</button>
	        </div>
	    </div>        
	</div>
</template>
<script>

import 'dialog-css';

//在你要暴露出来的方法前面加上export 导出重用的一些功能
export default {
	props : {
		dialogOptions : {
			type : Object,
			default : false
		}
	},

	data(){
		return {}
	},

	computed : {
		dialogStyles(){
			return {
				show : this.dialogOptions.show 
			}
		}
	},

	methods : {
		hideDialog(){
			this.$emit('dialog-events-remove');
		}
	}
}	

</script>