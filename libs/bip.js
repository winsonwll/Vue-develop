/**
 * BIP 数据统计
 * kv.wang87@gmail.com
 * 2016-12-15
 * 
 */
import mobile from './mobile';

var encode = encodeURIComponent;
var PLATFORM = mobile.getPlatform();
var PLT = {
	"android" : 'aphsports',
	"iphone" : 'iphsports',
	"ipad" : 'ipdsports'
}[PLATFORM];

const BIP = {
	/**
	 * BIP 页面PV分析(统计) 详细参数配置请参考 http://bip/home.jsp 日志自定义-》14网站-》网站访问记录
	 * @param  {String} options.plt  [平台类型]
	 * @param  {String} options.uid  [注册会员唯一 ID]
	 * @param  {String} options.puid [用户唯一 ID] 设备号
	 * @param  {Number} options.vip  [是否 VIP]
	 * @param  {String} options.o    [分渠道字段]
	 */
	analyzePV({uid, puid, vip=0, o='' }){
		var frame = document.createElement("iframe"), src;
		var adr = encode(location.href);
		var radr = encode(document.referrer);
		var random = Math.random();
		var ua = encode(navigator.userAgent);

		vip = uid ? (vip == 0 ? 0 : 1) : 0;
		src = `http://web.data.pplive.com/pv/1.html?plt=${PLT}&uid=${uid}&puid=${puid}&vip=${vip}&adr=${adr}&radr=${radr}&_agent=${ua}&t=${random}`;

		frame.src = src;
		frame.style.display = "none";

		document.body.appendChild(frame);
	},

	/**
	 * BIP PE 页面错误分析
	 * @return {[type]} [description]
	 */
	analyzePE(){

	},

	/**
	 * BIP PC 页面点击分析
	 * @return {[type]} [description]
	 */
	anlyzePC(){

	}
}


export default BIP;














