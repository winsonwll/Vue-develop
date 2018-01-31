/**
 * 定义一些全局的配置
 * kv.wang87@gmail.com
 * 2016-12-20
 */

var configs = {
	api : (()=>{
		var reg = /(?:http:\/\/)([\w\.]+)(?=m\.sports\.pptv\.com)/;
		var match = location.href.match(reg);
		var env = match ? match[1] : "";
		return 'http://' + env + 'api.sports.pptv.com';
	})()
};

export default configs;



