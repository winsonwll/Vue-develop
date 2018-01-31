/**
 * 封装一些手机设备相关的 API
 * kv.wang87@gmail.com
 * 2016-10-16
 */

export default {
	getPlatform(){
		var UA = navigator.userAgent;
		var factors = ['iphone', 'android', 'ipad'];

		for(let i = 0, len = factors.length; i < len; i++){
			let item = factors[i], reg = new RegExp(item, 'i');
			if(reg.test(UA)){
				return item;
			}
		}
		return 'unkown';
	},

	/**
	 *  获取浏览器版本号
	 */
	getVersion(){
		var { appVersion } = navigator;
		var nums = appVersion.match(/^[\d\.]+/);
		return nums ? nums[0] : null;
	}
}







