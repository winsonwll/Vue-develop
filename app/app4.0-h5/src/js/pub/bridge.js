/**
 * JS与App(Android/ios)端通讯
 * kv.wang87@gmail.com
 * 2016-12-14
 */

import mobile from './mobile';

const win = window;


/**
 * Android 使用全局 DeviceAPI
 * IOS 使用 全局webkit.messageHandlers
 */

const PLATFORM = mobile.getPlatform();

function uniqueID(){
	return Date.now().toString() + Math.random().toString().slice(-5);
}

function jsonStringify(data){
	return typeof data === 'string' ? data : JSON.stringify(data); 
}

function parseJSON(jsonStr){
	return typeof jsonStr == "string" ? JSON.parse(jsonStr) : jsonStr;
}

function evalJSON(jsonStr){
	return typeof jsonStr == 'string' ? (new Function("return " + jsonStr)()) : jsonStr;
}

/**
 * 格式化 null 对象 将 ‘null’ 变为 null
 */
function formatNull(str){
	return str.toLowerCase() === 'null' ? null : str; 
}

/**
 * App 调用 向 JS 广播事件
 */
class JSEventEmitter {
	/**
	 * 缓存所有事件对象和回调
	 */
	static fns = [];

	/**
	 * 一个存储需要 base64 解密的数组
	 * 有个别字段 App在收到之后需要 base64才能成功返回给 JS， 如 token
	 * JS 在拿到 token 之后需要 base64解密方可使用
	 */
	static atobItems = ['token'];

	/**
	 * App 端发起 广播对应的JS 事件
	 * @param {String} type 事件类型
	 * @param {String} payload App返回的数据对象 需要手动转成 JS 对象
	 * @param {String} bookmark 书签字符串
	 */
	static send(type, payload = {}, bookmark){
		var { fns } = JSEventEmitter, keys;
		try{
			fns.map((item, index)=>{
				if(item.type == type.toLowerCase()){
					// 避免使用 JSON.parse 解析从 App 传过来的 json 字符串。 遇到不标准的JSON格式会解析失败
					// 防火防盗防 Android
					payload = evalJSON(payload);
					bookmark = evalJSON(bookmark);
					keys = Object.keys(payload);

					// 格式化参数 如将所有后端(APP)返回的“null”变为null
					// 防火防盗防 Android
					keys.forEach((v, i)=>{
						payload[v] = formatNull(payload[v]);
					})
					
					// 对特定的值如 token 进行 BASE64 解密
					// 防火防盗防 Android
					JSEventEmitter.atobItems.forEach((v, k)=>{
						if(payload[v]){
							payload[v] = atob(payload[v]);
						}
					})

					// 依次发布 
					item['fn'](payload, bookmark);
				}
			})
			return true;	
		}catch(ex){
			// alert("[bridge]执行数据解析时发生错误:" + ex.message);
			return false;
		}
	}

	/**
	 * 页面监听事件类型 注册对应的回调函数
	 * @return {string} id 返回标记当前事件和回调的唯一索引 id 方便清除事件逻辑使用
	 */
	static on(type, fn = function(){}) {
		const id = uniqueID();
		JSEventEmitter.fns.push({ type, fn, id });
		return id;
	}

	/**
	 * 清除事件回调
	 * @param  {[string]} id 回调唯一 ID
	 * @param {Boolean} 清除是否成功 
	 */
	static remove(id){
		var { fns } = JSEventEmitter;
		for(let i = 0, len = fns.length; i < len; i++ ){
			if(fns[i].id === id){
				fns.splice(i, 1);
				return true;
			}
		}
		return false;
	}
}


/**
 * JS端调用 App 方法 
 * 获取数据或调用设备 API
 */
class NativeApi {
	/**
	 * 当前客户端是否注册了 JS api
	 */
	static checkJsApi = (()=>{
		try {
			if(PLATFORM == 'ipad' || PLATFORM == 'iphone'){
				// IOS APP 通过 UA 特殊标记区分 app和 非 app
				return /pptvsports/i.test(navigator.userAgent);
			}
			// 安卓通过全局的 DeviceAPI来处理
			return !!DeviceAPI;
		}
		catch(ex){
			// alert("checkJsApi error on bridge:" + ex.message);
		}
	})();

	/**
	 * 唤起客户端软键盘
	 * @param {String} bookmark 书签字符串
	 */
	static callSoftKeyboard = (bookmark = {}) => invoke("callSoftKeyboard", bookmark);

	/**
	 * 获取当前用户信息 检测用户是否登录
	 * App 端需要即时返回当前用户的信息 如 登录成功的 token，用户 ID 等
	 */
	static getUserInfo = (bookmark = {}) => invoke("getUserInfo", bookmark);

	/**
	 * 设备信息
	 */
	static getDeviceInfo = (bookmark = {}) => invoke("getDeviceInfo", bookmark);

	/**
	 * 唤醒登录框
	 */
	static callLoginBox = (bookmark = {}) => invoke("callLoginBox", bookmark);

	/**
	 * 唤醒注册框
	 */
	static callRegBox = (bookmark = {}) => invoke("callRegBox", bookmark);

	/**
	 * 退出登录
	 */
	static applyUserLogout = (bookmark = {}) => invoke("applyUserLogout", bookmark);

	/**
	 * 挂起播放
	 */
	static playVideo = (bookmark = {}, params = {}) => invoke("playVideo", bookmark, params);

}


function invoke(name, bookmark = {}, params){
	try {
		bookmark = jsonStringify(bookmark);
		if(params){
			params = jsonStringify(params);
		}
		if(PLATFORM == 'ipad' || PLATFORM == 'iphone'){
			win.webkit.messageHandlers.DeviceAPI.postMessage(
				Object.assign(
					{}, {action : name, content : bookmark, }, { params }
				)
			)
		}
		else {
			params ? DeviceAPI[name](bookmark, params) : DeviceAPI[name](bookmark);
		}
	}catch(ex){
		// alert('NativeApi.' + name + ":" + ex.message);
	}
}

/**
 * 对象全句化 方便 App 调用
 */
window['JSEventEmitter'] = JSEventEmitter;

export { JSEventEmitter, NativeApi };






























