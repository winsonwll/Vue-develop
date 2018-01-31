
// 加载 Fastclick 优化点击相应
import Fastclick from 'fastclick';

const win = window, doc = document;
window.addEventListener('DOMContentLoaded', ()=>{
	var evt = 'orientationchange' in win ? 'orientationchange' : 'resize';

	// Fastclick
	Fastclick(document.body);

	// 初始化根节点字号
	window.addEventListener(evt, computedRootSize, false);

	function computedRootSize(){
		var rootNode = doc.documentElement, 
			clientWidth = rootNode.clientWidth;
		rootNode.style.fontSize = clientWidth * 20 / 375 + 'px';
	}

	computedRootSize();

}, false);



