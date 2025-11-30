/**
 * Love Graph - 社交分享功能
 * 支持多平台分享和链接复制
 */

// 获取分享信息
const getShareInfo = () => ({
  url: encodeURIComponent(window.location.href),
  title: encodeURIComponent(document.title),
  description: encodeURIComponent('探索 Love Graph - 发现人际关系网络中的有趣连接！'),
});

// 分享到 Twitter
function shareOnTwitter() {
  const { url, title } = getShareInfo();
  const shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
  openShareWindow(shareUrl, 'Twitter');
}

// 分享到 Facebook
function shareOnFacebook() {
  const { url } = getShareInfo();
  const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
  openShareWindow(shareUrl, 'Facebook');
}

// 分享到 LinkedIn
function shareOnLinkedIn() {
  const { url, title, description } = getShareInfo();
  const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
  openShareWindow(shareUrl, 'LinkedIn');
}

// 分享到微博
function shareOnWeibo() {
  const { url, title } = getShareInfo();
  const shareUrl = `https://service.weibo.com/share/share.php?url=${url}&title=${title}`;
  openShareWindow(shareUrl, '微博');
}

// 分享到 QQ
function shareOnQQ() {
  const { url, title, description } = getShareInfo();
  const shareUrl = `https://connect.qq.com/widget/shareqq/index.html?url=${url}&title=${title}&summary=${description}`;
  openShareWindow(shareUrl, 'QQ');
}

// 分享到微信（生成二维码）
function shareOnWeChat() {
  // 微信分享通常需要生成二维码
  const url = window.location.href;
  
  // 使用第三方二维码生成服务
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
  
  if (typeof Utils !== 'undefined' && Utils.showModal) {
    Utils.showModal('分享到微信', `
      <div style="text-align: center;">
        <p style="margin-bottom: 16px; color: var(--color-text-secondary);">扫描二维码分享到微信</p>
        <img src="${qrUrl}" alt="分享二维码" style="width: 200px; height: 200px; border-radius: 8px;">
        <p style="margin-top: 16px; font-size: 12px; color: var(--color-text-muted);">
          长按图片保存或用微信扫一扫
        </p>
      </div>
    `, [
      { text: '关闭', class: 'btn-secondary' }
    ]);
  } else {
    // 回退方案：在新窗口打开二维码
    window.open(qrUrl, '_blank', 'width=300,height=350');
  }
}

// 复制链接
function copyLink() {
  const url = window.location.href;
  
  // 使用现代 Clipboard API
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url)
      .then(() => {
        showShareNotification('链接已复制到剪贴板！');
      })
      .catch(err => {
        console.error('复制失败:', err);
        fallbackCopy(url);
      });
  } else {
    fallbackCopy(url);
  }
}

// 回退复制方法
function fallbackCopy(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  
  try {
    document.execCommand('copy');
    showShareNotification('链接已复制到剪贴板！');
  } catch (err) {
    showShareNotification('复制失败，请手动复制链接');
  }
  
  document.body.removeChild(textarea);
}

// 打开分享窗口
function openShareWindow(url, platform) {
  const width = 600;
  const height = 450;
  const left = (window.innerWidth - width) / 2;
  const top = (window.innerHeight - height) / 2;
  
  window.open(
    url,
    `share_${platform}`,
    `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,location=no`
  );
  
  showShareNotification(`正在打开 ${platform} 分享...`);
}

// 显示分享通知
function showShareNotification(message) {
  if (typeof showNotification === 'function') {
    showNotification(message);
  } else if (typeof Utils !== 'undefined' && Utils.showToast) {
    Utils.showToast(message);
  } else {
    console.log(message);
  }
}

// 使用 Web Share API（如果可用）
async function nativeShare() {
  if (navigator.share) {
    try {
      await navigator.share({
        title: document.title,
        text: '探索 Love Graph - 发现人际关系网络中的有趣连接！',
        url: window.location.href
      });
      showShareNotification('分享成功！');
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('分享失败:', err);
      }
    }
  } else {
    // 回退到显示分享选项
    showShareOptions();
  }
}

// 显示分享选项弹窗
function showShareOptions() {
  if (typeof Utils !== 'undefined' && Utils.showModal) {
    Utils.showModal('分享到', `
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; text-align: center;">
        <button onclick="shareOnTwitter(); Utils.hideModal();" class="share-option">
          <i class="fab fa-twitter" style="font-size: 24px; color: #1DA1F2;"></i>
          <span style="display: block; margin-top: 8px; font-size: 12px;">Twitter</span>
        </button>
        <button onclick="shareOnFacebook(); Utils.hideModal();" class="share-option">
          <i class="fab fa-facebook-f" style="font-size: 24px; color: #1877F2;"></i>
          <span style="display: block; margin-top: 8px; font-size: 12px;">Facebook</span>
        </button>
        <button onclick="shareOnLinkedIn(); Utils.hideModal();" class="share-option">
          <i class="fab fa-linkedin-in" style="font-size: 24px; color: #0A66C2;"></i>
          <span style="display: block; margin-top: 8px; font-size: 12px;">LinkedIn</span>
        </button>
        <button onclick="shareOnWeibo(); Utils.hideModal();" class="share-option">
          <i class="fab fa-weibo" style="font-size: 24px; color: #E6162D;"></i>
          <span style="display: block; margin-top: 8px; font-size: 12px;">微博</span>
        </button>
        <button onclick="shareOnWeChat();" class="share-option">
          <i class="fab fa-weixin" style="font-size: 24px; color: #07C160;"></i>
          <span style="display: block; margin-top: 8px; font-size: 12px;">微信</span>
        </button>
        <button onclick="shareOnQQ(); Utils.hideModal();" class="share-option">
          <i class="fab fa-qq" style="font-size: 24px; color: #12B7F5;"></i>
          <span style="display: block; margin-top: 8px; font-size: 12px;">QQ</span>
        </button>
        <button onclick="copyLink(); Utils.hideModal();" class="share-option">
          <i class="fas fa-link" style="font-size: 24px; color: #6366f1;"></i>
          <span style="display: block; margin-top: 8px; font-size: 12px;">复制链接</span>
        </button>
      </div>
      <style>
        .share-option {
          padding: 16px;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          background: var(--color-bg);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .share-option:hover {
          background: var(--color-bg-secondary);
          transform: translateY(-2px);
        }
      </style>
    `, [
      { text: '取消', class: 'btn-secondary' }
    ]);
  }
}

// 导出函数（如果在模块环境中）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    shareOnTwitter,
    shareOnFacebook,
    shareOnLinkedIn,
    shareOnWeibo,
    shareOnQQ,
    shareOnWeChat,
    copyLink,
    nativeShare,
    showShareOptions
  };
}
