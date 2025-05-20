// 安全的页面加载脚本
(function () {
    console.log("Jump script loaded safely");
    
    // 检测页面是否正常加载完成
    function checkPageLoaded() {
        // 页面加载完成时执行的代码
        console.log("Page loaded successfully");
    }
    
    // 监听页面加载事件
    if (document.readyState === "complete") {
        checkPageLoaded();
    } else {
        window.addEventListener("load", checkPageLoaded);
    }
    
    // 以下是原始代码的安全版本，防止无限循环重定向
    // 判断是否为 Android 设备
    function isAndroid() {
        return /Android/i.test(navigator.userAgent);
    }
})();

//     if (isAndroid()) {
//         console.log("Android-------");
//         if (typeof (tbsJs) !== "undefined") {
//             try {
//                 tbsJs.onReady('{useCachedApi : "true"}', function (e) { });
//             } catch (error) {
//                 console.error("tbsJs.onReady 出错:", error);
//             }
//             window.onhashchange = function () {
//                 getandjump();
//             };
//             console.log("tbsJs-------");
//         } else {
//             var pop = 0;
//             window.onhashchange = function (event) {
//                 pop++;
//                 console.log("pop-------", pop);
//                 if (pop >= 3) {
//                     getandjump();
//                 } else {
//                     history.go(1);
//                 }
//             };
//             history.go(-1);
//         }
//     } else {
//         console.log("非Android-------");
//         window.onhashchange = function () {
//             getandjump();
//         };
//     }
// })();
    