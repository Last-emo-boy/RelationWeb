/**
 创建一个可以在system输出更详细时间信息以及增加mpopt面板自动添加按钮的插件
 * @author xulingluo
 * @version v1.0.1
 */
(function(){
	var p = window.performance || window.msPerformance || window.webkitPerformance, 
		pt = p.timing;
	var data = [],
		cookieName = "vconsole_open",
		btnMsg = ['关', '开'];

	var helperFun = {
		initData: function() {
			// if(pt.domainLookupEnd  != undefined && pt.domainLookupStart != undefined && pt.domainLookupEnd  != 0 && pt.domainLookupStart != 0){
			// 	data.push('DNS时间 : '+ (pt.domainLookupEnd  - pt.domainLookupStart));
			// }
			// if(pt.connectEnd  != undefined && pt.connectStart != undefined && pt.connectEnd  != 0 && pt.connectStart != 0){
			// 	data.push('TCP连接总时间 : '+ (pt.connectEnd  - pt.connectStart));
			// }
			// if(pt.connectEnd  != undefined && pt.secureConnectionStart != undefined && pt.connectEnd  != 0 && pt.secureConnectionStart != 0){
			// 	data.push('SSL连接时间 : '+ (pt.connectEnd  - pt.secureConnectionStart));
			// }
			// if(pt.responseStart  != undefined && pt.requestStart != undefined && pt.responseStart  != 0 && pt.requestStart != 0){
			// 	data.push('Request时间 : '+ (pt.responseStart  - pt.requestStart));
			// }
			// if(pt.responseEnd  != undefined && pt.responseStart != undefined && pt.responseEnd  != 0 && pt.responseStart != 0){
			// 	data.push('收包耗时 : '+ (pt.responseEnd  - pt.responseStart));
			// }
			// if(pt.domContentLoadedEventStart  != undefined && pt.domLoading != undefined && pt.domContentLoadedEventStart  != 0 && pt.domLoading != 0){
			// 	data.push('domContentLoaded时间 : '+ (pt.domContentLoadedEventStart  - pt.domLoading));
			// }
			// if(pt.domComplete  != undefined && pt.domLoading  != undefined && pt.domComplete  != 0 && pt.domLoading  != 0){
			// 	data.push('domComplete时间 : '+ (pt.domComplete  - pt.domLoading) );
			// }
			// if(pt.loadEventEnd  != undefined && pt.loadEventStart  != undefined && pt.loadEventEnd  != 0 && pt.loadEventStart  != 0){
			// 	data.push('onLoad耗时 : '+ (pt.loadEventEnd  - pt.loadEventStart) );
			// }
		},
		changeCookie: function(btn) {
			return function(){
				var ck = document.cookie;
				if(ck.indexOf(cookieName) === -1){//可以设置30分钟的cookie
					cookieOpt.setCookie(cookieName, '1', 30*100*60);
					
					btn.innerText = btnMsg[1];
				}
				else {//移除该cookie 自动返回vconsole失效
					cookieOpt.delCookie(cookieName);
					btn.innerText = btnMsg[0];
				}
			};
		}
	};
	//--------------cookie操作
	var cookieOpt = {
		delCookie: function(name) {
			var cval = cookieOpt.getCookie(name);
			if(cval != null) {
				var date = new Date();
				date.setTime(date.getTime() - 10000);
				document.cookie = name + '=;expires=' + date.toGMTString(); 
			}
		},
		getCookie: function(name) { 
			var arr,
				reg = new RegExp("(^| )"+name+"=([^;]*)(;|$)");
			if (arr = document.cookie.match(reg)) {
				return unescape(arr[2]); 
			}
			else {
				return null;
			} 
		},
		setCookie: function(name, value, expires) { 
			var expiresDate = new Date();
			expiresDate.setTime(expiresDate.getTime() + expires);
			document.cookie = name + "="+ escape (value) + ";expires=" + expiresDate.toGMTString(); 
		} 
	};

	function initPlugin() {
		if (!window.VConsole) {
			setTimeout(initPlugin, 100);
		}
		var mpOpt = new VConsole.VConsolePlugin('mpopt', 'MPopt');
		mpOpt.onInit = function() {
			// console.log('Plugin mpopt init');
		};
		mpOpt.onRenderTab = function(callback) {

			//--------加按钮设置cookie
			var html='';
			var cval=cookieOpt.getCookie(cookieName); 
			html += ('<div style="overflow:hidden;line-height:36px;padding:0 8px;border-bottom:1px solid #D9D9D9;">30分钟内打开vConsole<a id="vc_mpopt_remember" style="float:right;padding:0 10px;margin:3px 0;line-height:28px;color:#000;background:#efeff4;border:1px solid #D9D9D9;border-radius:4px;">'+ (cval === '1' ? btnMsg[1] : btnMsg[0]) +'</a></div>');
			callback(html);
			
		};
		mpOpt.onReady = function() {
			helperFun.initData();
			// for(var i = 0; i < data.length; ++i){
			// 	console.info("[system]", data[i] + 'ms'); //输出到system中
			// } 

			var cookieBtn = document.getElementById("vc_mpopt_remember");
			cookieBtn.addEventListener("click", helperFun.changeCookie(cookieBtn), false);

			// 如果URL有开关，那么自动setCookie
			if (location.href.indexOf('vconsole=1') > -1) {
				cookieOpt.setCookie(cookieName, '1', 30*100*60);
				cookieBtn.innerText = btnMsg[1];
			}
		};

		if (!window.vConsolePlugins) {
			window.vConsolePlugins = [];
		}
		window.vConsolePlugins.push(mpOpt);
	}
	initPlugin();
})();
