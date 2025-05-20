// festival_redirect.js - 特殊日期页面重定向逻辑
// 在特殊日期(520、情人节、七夕)显示特殊页面

// 检查是否已经从only_used_on_520完成转跳
const hasCompletedRedirectPage = () => {
  return localStorage.getItem('lovegraph_completed_520') === 'true';
};

// 标记已经完成了520特殊页面
const markRedirectCompleted = () => {
  localStorage.setItem('lovegraph_completed_520', 'true');
  
  // 设置过期时间 - 当天结束
  const now = new Date();
  const expiry = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
  localStorage.setItem('lovegraph_redirect_expiry', expiry.getTime().toString());
};

// 检查是否过期
const isRedirectExpired = () => {
  const expiryStr = localStorage.getItem('lovegraph_redirect_expiry');
  if (!expiryStr) return true;
  
  const expiryTime = parseInt(expiryStr);
  const now = new Date().getTime();
  
  return now > expiryTime;
};

// 重置重定向状态 (在日期变化时)
const resetRedirectIfExpired = () => {
  if (isRedirectExpired()) {
    localStorage.removeItem('lovegraph_completed_520');
    localStorage.removeItem('lovegraph_redirect_expiry');
    return true;
  }
  return false;
};

// 东八区时间转换
function getChineseDate() {
  const now = new Date();
  // 获取当前时间的UTC时间
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  // 东八区时间 (UTC+8)
  return new Date(utc + (3600000 * 8));
}

// 检测特殊日期函数
function isSpecialDate() {
  const date = getChineseDate();
  const month = date.getMonth() + 1; // 月份是0-11,所以+1
  const day = date.getDate();
  
  // 520表白日 (5月20日)
  if (month === 5 && day === 20) {
    return true;
  }
  
  // 七夕节 (农历七月初七,这里使用固定日期近似)
  // 2025年七夕是8月1日
  if (month === 8 && day === 1) {
    return true;
  }
  
  // 情人节 (2月14日)
  if (month === 2 && day === 14) {
    return true;
  }
  
  return false;
}

// 主函数：检查和处理重定向
function handleFestivalRedirect() {
  // 如果今天是特殊日期
  if (isSpecialDate()) {
    // 重置过期的重定向状态
    resetRedirectIfExpired();
    
    // 如果用户还没有完成彩蛋页面，则重定向
    if (!hasCompletedRedirectPage()) {
      // 当前在特殊页面时，不再跳转
      if (window.location.href.indexOf('only_used_on_520') !== -1) {
        return;
      }
      
      // 检测重定向循环
      const redirectCount = sessionStorage.getItem('festivalRedirectCount') || 0;
      if (parseInt(redirectCount) > 2) {
        console.error("检测到重定向循环，强制标记为已完成");
        markRedirectCompleted();
        return true;
      }
      
      // 增加重定向计数
      sessionStorage.setItem('festivalRedirectCount', parseInt(redirectCount) + 1);
      
      // 特殊日期跳转到彩蛋页面，添加时间戳防止缓存
      const timestamp = new Date().getTime();
      window.location.href = `only_used_on_520/index.html?t=${timestamp}`;
      return false; // 阻止后续代码执行
    }
  }
  
  // 不是特殊日期或已完成彩蛋，返回true以继续正常加载网页
  return true;
}

// 如果是从彩蛋页面回来，设置标记
if (window.location.search.indexOf('completed_520=true') !== -1) {
  markRedirectCompleted();
}

// 从URL参数获取并解析completed_520标志
function getCompletedFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('completed_520') === 'true';
}

// 检查URL参数，如果有completed_520=true，自动标记为已完成
if (getCompletedFromUrl()) {
  markRedirectCompleted();
  
  // 创建一个干净的URL（移除查询参数）
  const cleanUrl = window.location.href.split('?')[0];
  
  // 使用History API替换当前URL，移除completed_520参数
  if (window.history && window.history.replaceState) {
    window.history.replaceState({}, document.title, cleanUrl);
  }
}

// 页面加载时执行
document.addEventListener('DOMContentLoaded', handleFestivalRedirect);

// 导出函数，供其他脚本使用
window.markRedirectCompleted = markRedirectCompleted;
