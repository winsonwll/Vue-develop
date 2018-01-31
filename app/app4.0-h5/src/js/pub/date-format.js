
/**
 * 格式化时间(毫秒转可读性文本)
 */

// 一分钟 毫秒表示
const MINUTE = 1000 * 60; 
// 一小时 毫秒表示
const HOUR = MINUTE * 60;
// 一天 毫秒表示
const DAY = HOUR * 24;

// 处理前导0
function prefix(value){
	value = parseInt(value, 10);
	return value >= 10 ? value : ("0" + value);
}

export default function(value){
	// value = 1481094590138 - MINUTE * 18;
	var now = Date.now(), d = new Date(value);

	var year = d.getFullYear(), 
		month = d.getMonth() + 1,
		date = d.getDate(),
		ms = +d;

	var space = now - ms;
	var dateStr;
	
	// 10分钟内 显示 刚刚
	if(space <= MINUTE * 10){
		return "刚刚";
	}

	// 10-60 分钟内 显示 N 分钟前
	if(space <= MINUTE * 60){
		dateStr = parseInt(space / MINUTE, 10);
		return dateStr + "分钟前";
	}

	// 24小时内 显示 N 小时之前
	if(space <= HOUR * 24){
		dateStr = parseInt(space / HOUR, 10);
		return dateStr + "小时前";
	}
	
	// 7天内 显示 N 天前

	// 超过7天显示日期
	month = prefix(month);
	date = prefix(date);
	dateStr = [year, month, date].join("-");
	return dateStr;
}


















