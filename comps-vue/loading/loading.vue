<style></style>

<template>
	<div class="spin" v-show="show">
		<div class="inner"></div>
	</div>
</template>

<script>

import "./spin.css";

export default {
	props : {
		show : {
			type : Boolean,
			default : false
		}
	},

	data(){
		return {}
	}
}	

</script>