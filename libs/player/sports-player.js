/**
 * 封装播放器生成方法 兼容客PC 和 移动端(H5)
 * 2016-12-09
 * kv.wang87@gmail.com
 */

const encode = encodeURIComponent;
const decode = decodeURIComponent;

const defaultOptions = {
	// 存放播放器(FRAME)的容器 ID
	playerBox : "#player-box",
	// 视频类型 vod | live
	videoType : "vod",
	// 播放器适配宽
	width : "100%",
	// 播放器适配高
	height : "100%",
	// 上下文参数 o 表示来源 其他参数可以自定义
	ctx : {
		"o" : location.hostname
	},
	// 渠道和广告配置
	adConfig : {},
	// 当前页面标题
	title : encode(document.title),
	// 当前页面地址
	pageUrl : encode(location.href),
	// 上个页面地址
	pageRefer : encode(document.referrer),
	// 播放器是否自动播放 0 手动 1 自动
	autoPlay : 0,
	// 视频 ID
	vid : 0
};

export default class SportsPlayer {

	static defaultOptions = defaultOptions;

	constructor({...args}){
		var options = Object.assign({}, defaultOptions, args);
		this.options = options;
		this.options.node = this.node = document.querySelector(this.options.playerBox);
		return this;
	}

	// 检验必填参数
	checkOptions(){
		var { playerBox, vid, videoType, node } = this.options, result = true;
		var checkers = [
			{"name" : "playerBox", "message" : "参数(playerBox)缺失, 播放器容器 ID 不能为空" },
			{"name" : "vid", "message" : "参数(vid)缺失视频，视频 ID 不能为空" },
			{"name" : "videoType", "message" : "参数(videoType)缺失, 视频类型不能为空" },
			{"name" : "node", "message" : `根据 boxID:${playerBox}未获取到DOM节点,请保证该 DOM 节点在初始化播放器之前已经生成`  }
		];

		checkers.forEach((item, index)=>{
			let it = this.options[item["name"]];
			if( it === "" || it === null ){
				result = false;
				alert(item["message"]);
				throw item["message"];
			}
		})
		return result;
	}

	serialize(value){
		var ret = "";
		for(let p in value){
			if(value.hasOwnProperty(p)){
				ret += encode( p + "=" + value[p]);
			}
		}
		return ret;
	}

	makeSource(){
		var { vid, autoPlay, width, height, ctx, title, videoType, adConfig, pageUrl, pageRefer } = this.options; 
		var src = "http://player.aplus.pptv.com/corporate/proxy/proxy.html", programs = "";

		var _ctx = encode(this.serialize(ctx));
		var _adConfig = encode(this.serialize(adConfig));
		var _pageUrl = encode(pageUrl);
		var _pageRefer = encode(pageRefer);

		programs = `#id=${vid}&autoPlay=${autoPlay}&ctx=${_ctx}&title=${title}&videoType=${videoType}&adConfig=${_adConfig}&pageUrl=${_pageUrl}&pageRefer=${_pageRefer}`;
		src += programs;
		return src;
	}

	makePlayer(){
		var { width, height } = this.options,
			w = normalize(width),
			h = normalize(height),
			frame = document.createElement("iframe");
		if(this.checkOptions()){
			frame.style.cssText = `width:${w};height:${h};border:none;`;
			frame.src = this.makeSource();
			this.node.appendChild(frame);
		}
	}

	getOpions(){
		return options;
	}
};



// 获取单位
function getUnit(value){
	var unit = value.toString().trim().match(/\D+/g);
	return unit ? unit[0] : "";
}

// 格式化参数
function normalize(value){
	return !getUnit(value) ? (value + "px") : value;
}










