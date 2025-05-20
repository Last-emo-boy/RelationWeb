// easter_eggs.js - 节日彩蛋逻辑文件
// 用于在特殊日期(如520、七夕、情人节)触发特效

// 东八区时间转换
function getChineseDate() {
  const now = new Date();
  // 获取当前时间的UTC时间
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  // 东八区时间 (UTC+8)
  return new Date(utc + (3600000 * 8));
}

// 检测特殊日期函数
function checkSpecialDates() {
  const date = getChineseDate();
  const month = date.getMonth() + 1; // 月份是0-11,所以+1
  const day = date.getDate();
  
  // 520特效 (5月20日)
  if (month === 5 && day === 20) {
    return {
      isSpecial: true,
      festivalName: "520表白日",
      effects: {
        nodeEffect: "heartbeat",
        edgeEffect: "love-flow",
        backgroundColor: "#ffebee",
        specialClass: "festival-520"
      }
    };
  }
  
  // 七夕特效 (农历七月初七,这里使用固定日期近似)
  // 2025年七夕是8月1日
  if (month === 8 && day === 1) {
    return {
      isSpecial: true,
      festivalName: "七夕节",
      effects: {
        nodeEffect: "starlight",
        edgeEffect: "magpie-bridge",
        backgroundColor: "#e8f5e9",
        specialClass: "festival-qixi"
      }
    };
  }
  
  // 情人节特效 (2月14日)
  if (month === 2 && day === 14) {
    return {
      isSpecial: true, 
      festivalName: "情人节",
      effects: {
        nodeEffect: "rose-glow",
        edgeEffect: "heart-pulse",
        backgroundColor: "#fce4ec",
        specialClass: "festival-valentine"
      }
    };
  }
  
  // 非特殊日期
  return {
    isSpecial: false
  };
}

// 应用特效的函数
function applyFestivalEffects(cy) {
  const festivalStatus = checkSpecialDates();
  
  // 如果不是特殊日期,直接返回
  if (!festivalStatus.isSpecial) {
    return false;
  }
  
  // 显示节日通知
  showFestivalNotification(festivalStatus.festivalName);
  
  // 修改背景色
  document.body.style.backgroundColor = festivalStatus.effects.backgroundColor;
  document.body.classList.add(festivalStatus.effects.specialClass);
  
  // 为图节点添加特效
  cy.nodes().forEach(node => {
    node.addClass(festivalStatus.effects.nodeEffect);
    
    // 添加节点鼠标交互特效
    node.on('mouseover', function(e) {
      this.addClass('festival-hover');
      // 如果是CURRENT_PARTNER关系，则给相连的边也加上特效
      this.connectedEdges().forEach(edge => {
        if (edge.data('relationship') === 'CURRENT_PARTNER') {
          edge.addClass('festival-edge-hover');
        }
      });
    });
    
    node.on('mouseout', function(e) {
      this.removeClass('festival-hover');
      this.connectedEdges().forEach(edge => {
        edge.removeClass('festival-edge-hover');
      });
    });
    
    // 添加点击节点特效和隐藏彩蛋
    node.on('click', function(e) {
      triggerNodeEasterEgg(this, festivalStatus.festivalName);
    });
  });
  
  // 为边添加特效
  cy.edges().forEach(edge => {
    // 对CURRENT_PARTNER关系的边应用特殊效果
    if (edge.data('relationship') === 'CURRENT_PARTNER') {
      edge.addClass(`${festivalStatus.effects.edgeEffect}-special`);
    } else {
      edge.addClass(festivalStatus.effects.edgeEffect);
    }
  });
  
  // 添加特殊装饰元素
  addFestivalDecorations(festivalStatus.festivalName);
  
  // 添加隐藏的文字彩蛋
  addHiddenTextEasterEgg(festivalStatus.festivalName);
  
  return true;
}

// 节点点击隐藏彩蛋
async function triggerNodeEasterEgg(node, festivalName) {
  // 已经找到彩蛋的节点不再触发
  if (node.hasClass('easter-egg-found')) {
    return;
  }
  
  // 添加找到彩蛋标记
  node.addClass('easter-egg-found');
  node.addClass('loading-message');
  
  // 创建弹出的节日祝福
  const popupElement = document.createElement('div');
  popupElement.className = 'node-easter-egg';
  
  // 根据节日设置样式类
  let specialClass = '';
  let emoji = '';
  
  switch(festivalName) {
    case "520表白日":
      specialClass = 'love-message';
      emoji = ['💕', '💘', '🎁', '💑', '💖'][Math.floor(Math.random() * 5)];
      break;
      
    case "七夕节":
      specialClass = 'qixi-message';
      emoji = ['🌌', '🏞', '👩‍❤️‍👨', '👫', '✨'][Math.floor(Math.random() * 5)];
      break;
      
    case "情人节":
      specialClass = 'valentine-message';
      emoji = ['🎀', '💍', '💝', '🌹', '💞'][Math.floor(Math.random() * 5)];
      break;
  }
  
  // 获取节点的屏幕位置
  const nodePosition = node.renderedPosition();
  const containerRect = document.getElementById('cy').getBoundingClientRect();
  
  // 显示加载中提示
  popupElement.innerHTML = `<span class="${specialClass} loading">正在获取情话...</span>`;
  document.body.appendChild(popupElement);
  // 设置弹窗位置 - 确保显示在节点上方，并且居中对齐
  popupElement.style.left = (containerRect.left + nodePosition.x) + 'px';
  popupElement.style.top = (containerRect.top + nodePosition.y - 120) + 'px'; // 更高位置以确保在节点上方完全可见
  
  // 添加显示动画
  setTimeout(() => {
    popupElement.classList.add('show');
  }, 50);
    // 异步获取情话，添加超时控制
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('请求超时')), 5000);
  });
  
  try {
    // 添加超时控制
    const loveMessage = await Promise.race([
      fetchLoveMessage(),
      timeoutPromise
    ]);
    
    // 添加表情符号到消息末尾
    const messageText = `${loveMessage} ${emoji}`;
    
    // 更新弹窗内容
    popupElement.innerHTML = `<span class="${specialClass}">${messageText}</span>`;
    node.removeClass('loading-message');
  } catch (error) {
    console.error('获取情话失败:', error);
    // 使用备用消息
    const fallbackMessage = `心动的感觉就是看见你 ${emoji}`;
    popupElement.innerHTML = `<span class="${specialClass}">${fallbackMessage}</span>`;
    node.removeClass('loading-message');
  }
  
  // 一段时间后消失 - 延长到5秒，因为需要加载API数据
  setTimeout(() => {
    popupElement.classList.add('hide');
    setTimeout(() => {
      if (popupElement.parentNode) {
        popupElement.parentNode.removeChild(popupElement);
      }
    }, 1000);
  }, 5000);
  
  // 计算已找到的彩蛋数量
  const foundCount = cy.nodes('.easter-egg-found').length;
  const totalCount = cy.nodes().length;
  
  // 如果找到一定数量，显示特殊通知
  if (foundCount === 5) {
    showNotification('🎉 你已经找到5个隐藏彩蛋了！继续探索吧~');
  } else if (foundCount === totalCount) {
    showNotification('🏆 恭喜你！已找到所有隐藏彩蛋！你是真正的爱情大师！');
    
    // 全部找到时的特殊效果
    setTimeout(() => {
      const confetti = document.createElement('div');
      confetti.className = 'confetti-container';
      document.body.appendChild(confetti);
      
      // 创建50个彩色碎片
      for (let i = 0; i < 50; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = Math.random() * 100 + 'vw';
        piece.style.animationDelay = Math.random() * 3 + 's';
        piece.style.backgroundColor = ['#f94144', '#f3722c', '#f8961e', '#f9c74f', '#90be6d', '#43aa8b', '#577590'][Math.floor(Math.random() * 7)];
        confetti.appendChild(piece);
      }
      
      // 10秒后移除
      setTimeout(() => {
        if (confetti.parentNode) {
          confetti.parentNode.removeChild(confetti);
        }
      }, 10000);
    }, 1000);
  }
}

// 添加隐藏文字彩蛋
function addHiddenTextEasterEgg(festivalName) {
  const secretDiv = document.createElement('div');
  secretDiv.className = 'hidden-text-egg';
  secretDiv.setAttribute('tabindex', '0'); // 使其可聚焦
  
  let secretText = '';
  switch(festivalName) {
    case "520表白日":
      secretText = '悄悄告诉你：点击"Love Graph"标题5次可以看到惊喜哦！';
      break;
    case "七夕节":
      secretText = '试试在键盘上输入"LOVE"看看会发生什么？';
      break;
    case "情人节":
      secretText = '双击背景，可能会出现意想不到的效果...';
      break;
  }
  
  secretDiv.textContent = secretText;
  document.body.appendChild(secretDiv);
  
  // 添加鼠标悬停特殊效果
  secretDiv.addEventListener('mouseover', function() {
    this.classList.add('visible');
  });
  
  secretDiv.addEventListener('mouseout', function() {
    this.classList.remove('visible');
  });
  
  // 设置彩蛋触发器（根据不同节日设置不同的触发方式）
  setupEasterEggTriggers(festivalName);
}

// 显示节日通知
function showFestivalNotification(festivalName) {
  // 为不同节日定制不同的问候语
  let greetingMessage = '';
  let greetingTitle = '';
  let greetingEmoji = '';
  // 每个节日的多个随机消息
  const quoteIndex = Math.floor(Math.random() * 3);
  
  switch(festivalName) {    case "520表白日":
      greetingTitle = "今天是520表白日！";
      greetingEmoji = "💘💖💝";
      // 如果API已集成，调用API获取问候消息
      if (window.festivalMessages && window.festivalMessages["520"] && window.festivalMessages["520"].length > 0) {
        greetingMessage = window.festivalMessages["520"][quoteIndex % window.festivalMessages["520"].length];
      } else {
        // 备用消息
        const loveQuotes520 = [
          "数字里藏着爱意，5爱你0要你，今天，大声说出你的爱！点击节点，解锁隐藏心意~",
          "520不只是数字，是'我爱你'的秘密暗号。今天，让爱的图谱绽放光彩！尝试点击不同节点~",
          "表白日快乐！爱是最美的连接，勇敢表达，爱意永不迟到。探索图谱，发现爱的秘密！"
        ];
        greetingMessage = loveQuotes520[quoteIndex];
      }
      break;    case "七夕节":
      greetingTitle = "七夕佳节到啦！";
      greetingEmoji = "🌌✨🎋";
      // 如果API已集成，调用API获取问候消息
      if (window.festivalMessages && window.festivalMessages["七夕"] && window.festivalMessages["七夕"].length > 0) {
        greetingMessage = window.festivalMessages["七夕"][quoteIndex % window.festivalMessages["七夕"].length];
      } else {
        // 备用消息
        const qixiQuotes = [
          "鹊桥一架，两心相依。七夕之夜，愿你的爱情故事如星河般璀璨！点击节点，邂逅浪漫~",
          "一年一度鹊桥会，今夜星河璀璨。在这个爱的节日，探索图谱中的情感连接，织就专属于你的爱情故事！",
          "七夕不只是牛郎织女的传说，更是对爱的执着与坚守。点击节点，让星光为你指引前方的路~"
        ];
        greetingMessage = qixiQuotes[quoteIndex];
      }
      break;
    case "情人节":
      greetingTitle = "情人节快乐！";
      greetingEmoji = "🌹💐🍫";
      const valentineQuotes = [
        "玫瑰、巧克力与誓言，今天是属于爱的盛宴。与Love Graph一起，描绘你的情感宇宙！双击背景，看看会发生什么？",
        "情人节的美妙不只在于礼物，更在于心与心的真诚交流。在图谱中点击节点，发现隐藏的浪漫惊喜~",
        "今天，让爱意不再害羞，让表达不再犹豫。情人节快乐！尝试与图谱互动，每个点击都藏着甜蜜~"
      ];
      greetingMessage = valentineQuotes[quoteIndex];
      break;
    default:
      greetingTitle = `特别的日子！`;
      greetingEmoji = "🎉🎊✨";
      greetingMessage = `今天是${festivalName}，愿你的爱情如图谱般丰富多彩！`;
  }
  
  // 使用已有的Toast通知组件
  if (typeof showNotification === 'function') {
    showNotification(`${greetingEmoji} ${greetingMessage}`);
    
    // 短暂延迟后显示提示信息
    setTimeout(() => {
      showNotification("💡 提示：点击节点会有惊喜，多多探索图谱吧！");
    }, 10000);
  } else {
    // 如果没有Toast,则创建一个临时的
    const notification = document.createElement('div');
    notification.className = 'festival-notification fancy-festival-notification';
    notification.innerHTML = `
      <div class="festival-notification-content">
        <div class="festival-emoji-header">${greetingEmoji}</div>
        <h3>${greetingTitle}</h3>
        <p>${greetingMessage}</p>
        <button class="festival-close-btn">我知道了</button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // 添加关闭按钮事件
    const closeBtn = notification.querySelector('.festival-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        notification.classList.add('fade-out');
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 1000);
      });
    }
    
    // 10秒后自动关闭
    setTimeout(() => {
      notification.classList.add('fade-out');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 1000);
    }, 12000); // 延长显示时间到12秒
    
    // 短暂延迟后显示提示信息
    setTimeout(() => {
      const tipsNotification = document.createElement('div');
      tipsNotification.className = 'festival-notification tips-notification';
      tipsNotification.innerHTML = `
        <div class="festival-notification-content">
          <div class="festival-emoji-header">💡</div>
          <p>提示：点击节点会有惊喜，多多探索图谱吧！</p>
        </div>
      `;
      document.body.appendChild(tipsNotification);
      
      setTimeout(() => {
        tipsNotification.classList.add('fade-out');
        setTimeout(() => {
          if (tipsNotification.parentNode) {
            tipsNotification.parentNode.removeChild(tipsNotification);
          }
        }, 1000);
      }, 8000);
    }, 13000);
  }
}

// 添加节日装饰元素
function addFestivalDecorations(festivalName) {
  const container = document.createElement('div');
  container.className = 'festival-decorations';
  
  switch (festivalName) {
    case "520表白日":
      // 添加飘落的爱心
      for (let i = 0; i < 20; i++) {
        const heart = document.createElement('div');
        heart.className = 'falling-heart';
        heart.innerHTML = '❤️';
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.animationDuration = `${Math.random() * 3 + 2}s`;
        heart.style.animationDelay = `${Math.random() * 5}s`;
        container.appendChild(heart);
      }
      break;
    
    case "七夕节":
      // 添加星星背景
      for (let i = 0; i < 30; i++) {
        const star = document.createElement('div');
        star.className = 'twinkling-star';
        star.innerHTML = '⭐';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDuration = `${Math.random() * 4 + 1}s`;
        star.style.animationDelay = `${Math.random() * 3}s`;
        container.appendChild(star);
      }
      break;
      
    case "情人节":
      // 添加玫瑰花和礼物图标
      const icons = ['🌹', '🎁', '💝', '💘'];
      for (let i = 0; i < 15; i++) {
        const icon = document.createElement('div');
        icon.className = 'floating-icon';
        icon.innerHTML = icons[Math.floor(Math.random() * icons.length)];
        icon.style.left = `${Math.random() * 100}%`;
        icon.style.top = `${Math.random() * 100}%`;
        icon.style.animationDuration = `${Math.random() * 5 + 3}s`;
        container.appendChild(icon);
      }
      break;
  }
  
  document.body.appendChild(container);
}

// 手动触发彩蛋模式（用于测试）
function triggerFestivalMode(cy, festivalType) {
  // 清除任何现有的彩蛋效果
  clearFestivalEffects();
  
  let festivalData = {};
  
  switch(festivalType) {
    case "520":
      festivalData = {
        isSpecial: true,
        festivalName: "520表白日",
        effects: {
          nodeEffect: "heartbeat",
          edgeEffect: "love-flow",
          backgroundColor: "#ffebee",
          specialClass: "festival-520"
        }
      };
      break;
      
    case "qixi":
      festivalData = {
        isSpecial: true,
        festivalName: "七夕节",
        effects: {
          nodeEffect: "starlight",
          edgeEffect: "magpie-bridge",
          backgroundColor: "#e8f5e9", 
          specialClass: "festival-qixi"
        }
      };
      break;
      
    case "valentine":
      festivalData = {
        isSpecial: true,
        festivalName: "情人节", 
        effects: {
          nodeEffect: "rose-glow",
          edgeEffect: "heart-pulse",
          backgroundColor: "#fce4ec",
          specialClass: "festival-valentine"
        }
      };
      break;
      
    default:
      return false;
  }
  
  // 显示节日通知
  showFestivalNotification(festivalData.festivalName);
  
  // 修改背景色
  document.body.style.backgroundColor = festivalData.effects.backgroundColor;
  document.body.classList.add(festivalData.effects.specialClass);
  
  // 为图节点添加特效
  cy.nodes().forEach(node => {
    node.addClass(festivalData.effects.nodeEffect);
  });
  
  // 为边添加特效 
  cy.edges().forEach(edge => {
    // 对CURRENT_PARTNER关系的边应用特殊效果
    if (edge.data('relationship') === 'CURRENT_PARTNER') {
      edge.addClass(`${festivalData.effects.edgeEffect}-special`);
    } else {
      edge.addClass(festivalData.effects.edgeEffect);
    }
  });
  
  // 添加特殊装饰元素
  addFestivalDecorations(festivalData.festivalName);
  
  return true;
}

// 清除所有节日彩蛋效果
function clearFestivalEffects() {
  // 移除背景色和类
  document.body.style.backgroundColor = '';
  document.body.classList.remove('festival-520', 'festival-qixi', 'festival-valentine');
  
  // 移除所有节点和边的特效类
  const effectClasses = [
    'heartbeat', 'love-flow', 'love-flow-special',
    'starlight', 'magpie-bridge', 'magpie-bridge-special',
    'rose-glow', 'heart-pulse', 'heart-pulse-special'
  ];
  
  // 获取所有cytoscape实例
  const cyInstances = window.cy ? [window.cy] : [];
  
  cyInstances.forEach(cy => {
    if (cy && cy.elements) {
      cy.elements().forEach(ele => {
        effectClasses.forEach(cls => {
          ele.removeClass(cls);
        });
      });
    }
  });
  
  // 移除装饰元素
  const decorations = document.querySelectorAll('.festival-decorations');
  decorations.forEach(el => {
    if (el.parentNode) {
      el.parentNode.removeChild(el);
    }
  });
  
  // 移除通知
  const notifications = document.querySelectorAll('.festival-notification');
  notifications.forEach(el => {
    if (el.parentNode) {
      el.parentNode.removeChild(el);
    }
  });
}

// 设置下拉菜单监听器（用于测试）
document.addEventListener('DOMContentLoaded', function() {
  const festivalSelect = document.getElementById('festivalSelect');
  
  if (festivalSelect) {
    festivalSelect.addEventListener('change', function() {
      const selectedFestival = this.value;
      const cyInstance = window.cy;
      
      if (!selectedFestival) {
        clearFestivalEffects();
        return;
      }
      
      if (cyInstance) {
        triggerFestivalMode(cyInstance, selectedFestival);
      }
    });
  }
});

// 设置彩蛋触发器
function setupEasterEggTriggers(festivalName) {
  switch(festivalName) {
    case "520表白日":
      // 点击标题5次触发彩蛋
      let titleClickCount = 0;
      const titleElement = document.querySelector('header h1');
      if (titleElement) {
        titleElement.addEventListener('click', function() {
          titleClickCount++;
          if (titleClickCount === 5) {
            trigger520TitleEasterEgg();
            titleClickCount = 0;
          }
        });
      }
      break;
      
    case "七夕节":
      // 键盘输入LOVE触发彩蛋
      let keySequence = '';
      document.addEventListener('keydown', function(e) {
        keySequence += e.key.toLowerCase();
        // 保持序列不超过10个字符
        if (keySequence.length > 10) {
          keySequence = keySequence.substring(keySequence.length - 10);
        }
        
        // 检查是否包含'love'序列
        if (keySequence.includes('love')) {
          triggerQixiKeyboardEasterEgg();
          keySequence = '';
        }
      });
      break;
      
    case "情人节":
      // 双击背景触发彩蛋
      const cyElement = document.getElementById('cy');
      if (cyElement) {
        cyElement.addEventListener('dblclick', function(e) {
          // 确保点击的是背景而非节点或边
          if (e.target === cyElement) {
            triggerValentineBackgroundEasterEgg(e.clientX, e.clientY);
          }
        });
      }
      break;
  }
}

// 520标题点击彩蛋
function trigger520TitleEasterEgg() {
  // 检查今天是否真的是520
  const today = getChineseDate();
  const isActually520 = today.getMonth() + 1 === 5 && today.getDate() === 20;
  
  // 创建浪漫表白弹窗
  const romancePopup = document.createElement('div');
  romancePopup.className = 'romance-popup enhanced-romance-popup';
  
  // 如果真的是520，显示特殊的增强版内容
  if (isActually520) {
    romancePopup.innerHTML = `
      <div class="romance-content">
        <div class="sparkles-container"></div>
        <h3>💘 特别的520告白日 💘</h3>
        <p class="romance-text">今天是真实的520，愿这特别的日子里，你的心意有所归处。</p>
        <p class="romance-question">你能不能做我一辈子的<span class="highlight-text">CURRENT_PARTNER</span>，不做<span class="highlight-text">EX_PARTNER</span>～</p>
        <div class="romance-buttons">
          <button class="romance-yes rainbow-btn">YES！我愿意！</button>
          <button class="romance-no">再考虑一下...</button>
        </div>
      </div>
    `;
  } else {
    // 普通模式
    romancePopup.innerHTML = `
      <div class="romance-content">
        <h3>💘 爱的宣言 💘</h3>
        <p class="romance-text">你能不能做我一辈子的CURRENT_PARTNER，不做EX_PARTNER～</p>
        <div class="romance-buttons">
          <button class="romance-yes">YES！我愿意！</button>
          <button class="romance-no">让我想想...</button>
        </div>
      </div>
    `;
  }
  
  document.body.appendChild(romancePopup);
  
  // 如果是真的是520，添加闪光效果
  if (isActually520) {
    const sparklesContainer = romancePopup.querySelector('.sparkles-container');
    for (let i = 0; i < 30; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle';
      sparkle.style.left = `${Math.random() * 100}%`;
      sparkle.style.top = `${Math.random() * 100}%`;
      sparkle.style.animationDelay = `${Math.random() * 2}s`;
      sparkle.style.animationDuration = `${Math.random() * 2 + 1}s`;
      sparklesContainer.appendChild(sparkle);
    }
  }
  
  // 添加动画
  setTimeout(() => {
    romancePopup.classList.add('show');
  }, 50);
  
  // 按钮事件
  const yesButton = romancePopup.querySelector('.romance-yes');
  const noButton = romancePopup.querySelector('.romance-no');
  
  yesButton.addEventListener('click', function() {
    // 根据是否真的是520提供不同的反馈
    if (isActually520) {
      romancePopup.innerHTML = `
        <div class="romance-content celebration-content">
          <h3>💖 真爱永恒 💖</h3>
          <p class="romance-text">在这特别的520，你的选择被永远记录！</p>
          <p class="romance-highlight">你已成功加入CURRENT_PARTNER关系！</p>
          <div class="floating-hearts"></div>
          <div class="fireworks-container"></div>
        </div>
      `;
      
      // 创建烟花效果
      const fireworksContainer = romancePopup.querySelector('.fireworks-container');
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          createFirework(fireworksContainer);
        }, i * 600);
      }
    } else {
      romancePopup.innerHTML = `
        <div class="romance-content">
          <h3>💖 恭喜！💖</h3>
          <p class="romance-text">你已加入CURRENT_PARTNER关系！祝福你们！</p>
          <div class="floating-hearts"></div>
        </div>
      `;
    }
    
    // 创建心形动画
    const hearts = romancePopup.querySelector('.floating-hearts');
    for (let i = 0; i < 30; i++) {
      const heart = document.createElement('span');
      heart.className = 'floating-heart';
      // 使用更多样的心形表情
      heart.innerHTML = ['❤️', '💖', '💘', '💕', '💓', '💗', '💝'][Math.floor(Math.random() * 7)];
      heart.style.left = `${Math.random() * 100}%`;
      heart.style.animationDuration = `${Math.random() * 3 + 2}s`;
      heart.style.animationDelay = `${Math.random() * 2}s`;
      heart.style.fontSize = `${Math.random() * 10 + 20}px`; // 随机大小
      hearts.appendChild(heart);
    }
    
    // 如果是真实的520，添加特殊效果并延长显示时间
    const closeTime = isActually520 ? 8000 : 5000;
    
    // 关闭弹窗
    setTimeout(() => {
      romancePopup.classList.remove('show');
      setTimeout(() => {
        if (romancePopup.parentNode) {
          romancePopup.parentNode.removeChild(romancePopup);
        }
      }, 1000);
    }, closeTime);
    
    // 如果是520，在图上显示特殊效果
    if (isActually520 && window.cy) {
      // 在图上所有CURRENT_PARTNER边上显示爱心
      window.cy.edges().forEach(edge => {
        if (edge.data('relationship') === 'CURRENT_PARTNER') {
          showLoveEffectOnEdge(edge);
        }
      });
    }
  });
  
  noButton.addEventListener('click', function() {
    // 按钮躲避鼠标的效果
    noButton.classList.add('move-away');
    
    const moveButton = () => {
      const newX = Math.random() * (romancePopup.offsetWidth - noButton.offsetWidth - 40);
      const newY = Math.random() * (romancePopup.offsetHeight - noButton.offsetHeight - 40);
      noButton.style.position = 'absolute';
      noButton.style.left = `${newX}px`;
      noButton.style.top = `${newY}px`;
    };
    
    // 添加一个移动事件
    noButton.addEventListener('mouseover', moveButton);
    
    // 为真实520添加调皮的反馈
    if (isActually520) {
      yesButton.classList.add('pulse-attention');
      // 每次移动后显示不同的鼓励消息
      const encouragements = [
        "真的不再考虑一下吗？",
        "今天可是520表白日哦！",
        "别犹豫啦～",
        "勇敢一点嘛～",
        "520只有一天呢！"
      ];
      
      let msgIndex = 0;
      const showMessage = () => {
        const msgElem = document.createElement('div');
        msgElem.className = 'floating-message';
        msgElem.textContent = encouragements[msgIndex % encouragements.length];
        msgIndex++;
        
        romancePopup.querySelector('.romance-content').appendChild(msgElem);
        
        setTimeout(() => {
          msgElem.classList.add('fade-out');
          setTimeout(() => {
            if (msgElem.parentNode) {
              msgElem.parentNode.removeChild(msgElem);
            }
          }, 500);
        }, 1500);
      };
      
      noButton.addEventListener('click', showMessage);
    }
    
    // 设置初始位置
    moveButton();
  });
}

// 创建烟花效果 (520特殊效果)
function createFirework(container) {
  const firework = document.createElement('div');
  firework.className = 'firework';
  
  // 随机位置
  firework.style.left = `${20 + Math.random() * 60}%`;
  firework.style.top = `${20 + Math.random() * 60}%`;
  
  // 随机颜色
  const hue = Math.floor(Math.random() * 360);
  firework.style.setProperty('--firework-color', `hsl(${hue}, 100%, 50%)`);
  
  container.appendChild(firework);
  
  // 爆炸效果
  setTimeout(() => {
    firework.classList.add('explode');
    
    // 创建火花
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.className = 'firework-particle';
        // 随机角度和距离
      const angle = Math.random() * Math.PI * 2;
      const distance = 30 + Math.random() * 70;
      
      // 计算x和y方向的距离，而不是依赖CSS中的数学函数
      const distanceX = Math.cos(angle) * distance;
      const distanceY = Math.sin(angle) * distance;
      
      particle.style.setProperty('--distance-x', `${distanceX}px`);
      particle.style.setProperty('--distance-y', `${distanceY}px`);
      particle.style.setProperty('--particle-color', `hsl(${hue}, 100%, ${50 + Math.random() * 30}%)`);
      particle.style.animationDuration = `${0.5 + Math.random() * 0.5}s`;
      
      firework.appendChild(particle);
    }
    
    // 移除烟花
    setTimeout(() => {
      if (firework.parentNode) {
        firework.parentNode.removeChild(firework);
      }
    }, 2000);
  }, 300);
}

// 在边上显示爱心效果 (520特殊效果)
function showLoveEffectOnEdge(edge) {
  const edgePos = edge.midpoint();
  const sourceNode = edge.source();
  const targetNode = edge.target();
  
  // 创建边上的爱心动画
  const loveEffect = document.createElement('div');
  loveEffect.className = 'edge-love-effect';
  document.body.appendChild(loveEffect);
  
  // 获取canvas位置
  const containerRect = document.getElementById('cy').getBoundingClientRect();
  const left = containerRect.left + edgePos.x;
  const top = containerRect.top + edgePos.y;
  
  loveEffect.style.left = `${left}px`;
  loveEffect.style.top = `${top}px`;
  
  // 添加微妙的动画，沿着边轻微移动
  const animateLoveEffect = () => {
    const t = (Date.now() % 3000) / 3000; // 0到1的循环
    const pos = edge.pointOnLine(t);
    
    if (pos) {
      loveEffect.style.left = `${containerRect.left + pos.x}px`;
      loveEffect.style.top = `${containerRect.top + pos.y}px`;
    }
    
    if (loveEffect.parentNode) {
      requestAnimationFrame(animateLoveEffect);
    }
  };
  
  // 开始动画
  requestAnimationFrame(animateLoveEffect);
  
  // 10秒后移除
  setTimeout(() => {
    loveEffect.classList.add('fade-out');
    setTimeout(() => {
      if (loveEffect.parentNode) {
        loveEffect.parentNode.removeChild(loveEffect);
      }
    }, 1000);
  }, 10000);
}

// 检测是否真正是520表白日并添加特殊互动
function check520AndAddSpecialInteraction() {
  const date = getChineseDate();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  // 如果真的是520表白日
  if (month === 5 && day === 20) {
    // 延迟一点时间，确保主UI已加载
    setTimeout(() => {
      // 添加520特殊的爱心气泡互动效果
      addLoveBubbleInteraction();
      // 添加特殊的520图案到图谱上
      add520PatternToGraph();
      // 添加随机弹出式告白语
      scheduleRandomConfessions();
    }, 3000);
    
    return true;
  }
  return false;
}

// 添加爱心气泡互动效果
function addLoveBubbleInteraction() {
  const cyContainer = document.getElementById('cy');
  if (!cyContainer) return;
  
  // 创建一个覆盖层来捕获鼠标移动，避免干扰图的操作
  const bubbleOverlay = document.createElement('div');
  bubbleOverlay.className = 'bubble-overlay';
  bubbleOverlay.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 10;
  `;
  cyContainer.appendChild(bubbleOverlay);
  
  // 添加鼠标移动监听
  cyContainer.addEventListener('mousemove', function(e) {
    // 只有鼠标移动速度快时才产生气泡，降低生成频率
    if (Math.random() > 0.1) return;
    
    const rect = cyContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // 创建爱心气泡
    createLoveBubble(bubbleOverlay, x, y);
  });
  
  // 添加点击监听产生大爱心
  cyContainer.addEventListener('click', function(e) {
    // 确保点击不在节点或边上
    if (e.target === cyContainer || e.target === bubbleOverlay) {
      const rect = cyContainer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // 创建大爱心爆炸效果
      createHeartBurst(bubbleOverlay, x, y);
    }
  });
}

// 创建爱心气泡
function createLoveBubble(container, x, y) {
  const bubble = document.createElement('div');
  bubble.className = 'love-bubble';
  
  // 随机选择爱心图案和大小
  const hearts = ['❤️', '💖', '💕', '💓', '💘', '💝'];
  const heartType = hearts[Math.floor(Math.random() * hearts.length)];
  const size = 15 + Math.random() * 15;
  
  bubble.innerHTML = heartType;
  bubble.style.cssText = `
    position: absolute;
    left: ${x}px;
    top: ${y}px;
    font-size: ${size}px;
    pointer-events: none;
    z-index: 15;
    opacity: 0.8;
    transform: translate(-50%, -50%);
    animation: float-away 3s ease-out forwards;
  `;
  
  container.appendChild(bubble);
  
  // 3秒后移除
  setTimeout(() => {
    if (bubble.parentNode) {
      bubble.parentNode.removeChild(bubble);
    }
  }, 3000);
}

// 创建爱心爆炸效果
function createHeartBurst(container, x, y) {
  // 创建爆炸容器，用于更好的动画控制
  const burstContainer = document.createElement('div');
  burstContainer.className = 'heart-burst-container';
  burstContainer.style.cssText = `
    position: absolute;
    left: ${x}px;
    top: ${y}px;
    width: 0;
    height: 0;
    pointer-events: none;
    z-index: 100;
  `;
  container.appendChild(burstContainer);
  
  // 主爱心，有放大后爆炸的效果
  const mainHeart = document.createElement('div');
  mainHeart.className = 'main-heart';
  mainHeart.innerHTML = '❤️';
  mainHeart.style.cssText = `
    position: absolute;
    left: 0;
    top: 0;
    font-size: 50px;
    pointer-events: none;
    transform: translate(-50%, -50%);
    animation: heart-pulse 0.6s ease-out forwards;
    filter: drop-shadow(0 0 5px rgba(255,0,0,0.5));
  `;
  burstContainer.appendChild(mainHeart);
  
  // 创建冲击波效果
  const shockwave = document.createElement('div');
  shockwave.className = 'heart-shockwave';
  shockwave.style.cssText = `
    position: absolute;
    left: 0;
    top: 0;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,20,147,0.8) 0%, rgba(255,105,180,0.4) 50%, rgba(255,192,203,0) 70%);
    transform: translate(-50%, -50%);
    animation: heart-shockwave 1s ease-out forwards;
    pointer-events: none;
  `;
  burstContainer.appendChild(shockwave);
  
  // 爱心碎片效果 - 更多样式和更自然的运动
  const heartTypes = ['❤️', '💖', '💕', '💓', '💘', '💝', '💗', '💞'];
  for (let i = 0; i < 20; i++) {
    const fragment = document.createElement('div');
    fragment.className = 'heart-fragment';
    
    // 更丰富的随机参数
    const heartType = heartTypes[Math.floor(Math.random() * heartTypes.length)];
    const angle = Math.random() * Math.PI * 2;
    const distance = 30 + Math.random() * 100;
    const size = 10 + Math.random() * 30;
    const duration = 0.7 + Math.random() * 1.3;
    const rotation = Math.random() * 720 - 360; // -360到360度旋转
      fragment.innerHTML = heartType;
    fragment.style.cssText = `
      position: absolute;
      left: 0;
      top: 0;
      font-size: ${size}px;
      pointer-events: none;
      z-index: 19;
      opacity: 0.9;
      transform: translate(-50%, -50%);
      animation: heart-fragment-${i % 5 + 1} ${duration}s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
      filter: drop-shadow(0 0 2px rgba(255,0,0,0.3));
    `;
    
    // 设置动画终点和物理效果
    const gravity = 0.3 + Math.random() * 0.7; // 随机重力效果
    fragment.style.setProperty('--end-x', `${Math.cos(angle) * distance}px`);
    fragment.style.setProperty('--end-y', `${Math.sin(angle) * distance + (gravity * 100)}px`); // 添加重力下坠
    fragment.style.setProperty('--rotation', `${rotation}deg`); // 添加旋转
      burstContainer.appendChild(fragment);
    
    // 动画结束后移除
    setTimeout(() => {
      if (fragment.parentNode) {
        fragment.parentNode.removeChild(fragment);
      }
    }, duration * 1000);
  }
  
  // 添加闪光效果
  for (let i = 0; i < 10; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'heart-sparkle';
    
    // 随机参数
    const angle = Math.random() * Math.PI * 2;
    const distance = 20 + Math.random() * 60;
    const size = 3 + Math.random() * 7;
    const duration = 0.3 + Math.random() * 0.7;
    const delay = Math.random() * 0.3;
    
    sparkle.style.cssText = `
      position: absolute;
      left: 0;
      top: 0;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background-color: #ffffff;
      box-shadow: 0 0 ${size*2}px ${size}px rgba(255, 255, 255, 0.7);
      pointer-events: none;
      z-index: 18;
      opacity: 0.8;
      transform: translate(-50%, -50%);
      animation: sparkle-fade ${duration}s ease-out ${delay}s forwards;
    `;
    
    sparkle.style.setProperty('--end-x', `${Math.cos(angle) * distance}px`);
    sparkle.style.setProperty('--end-y', `${Math.sin(angle) * distance}px`);
    
    burstContainer.appendChild(sparkle);
    
    // 动画结束后移除
    setTimeout(() => {
      if (sparkle.parentNode) {
        sparkle.parentNode.removeChild(sparkle);
      }
    }, (duration + delay) * 1000);
  }
  
  // 整个效果结束后移除容器
  setTimeout(() => {
    if (burstContainer.parentNode) {
      burstContainer.parentNode.removeChild(burstContainer);
    }
  }, 2000);
}
  
  // 移除主爱心
  setTimeout(() => {
    if (mainHeart.parentNode) {
      mainHeart.parentNode.removeChild(mainHeart);
    }
  }, 500);
  
  // 添加特殊事件 - 10%几率触发告白模式
  if (Math.random() < 0.1) {
    setTimeout(() => {
      trigger520TitleEasterEgg();
    }, 300);
  }

// 在图谱上添加520的图案
function add520PatternToGraph() {
  // 确保cytoscape实例可用
  if (!window.cy) return;
  
  // 每隔一段时间展示520图案
  setTimeout(() => {
    const container = document.createElement('div');
    container.className = 'love-day-pattern-container';
    container.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 1000;
      pointer-events: none;
    `;
    
    const pattern = document.createElement('div');
    pattern.className = 'love-day-pattern';
    pattern.innerHTML = `
      <div class="pattern-text">520</div>
      <div class="pattern-heart">❤️</div>
    `;
    
    container.appendChild(pattern);
    document.body.appendChild(container);
    
    // 添加动画类
    setTimeout(() => {
      pattern.classList.add('show');
    }, 100);
    
    // 5秒后消失
    setTimeout(() => {
      pattern.classList.add('hide');
      setTimeout(() => {
        if (container.parentNode) {
          container.parentNode.removeChild(container);
        }
      }, 1000);
    }, 5000);
  }, 20000); // 启动后20秒展示第一次
}

// 安排随机弹出式告白语
function scheduleRandomConfessions() {
  // 告白语列表
  const confessions = [
    "520代表我爱你，今天，说出你的心里话！",
    "生活再平凡，因为爱你而特别！",
    "喜欢你，比喜欢自己还多一点",
    "想趁着520告诉你，我们能不能不做普通朋友",
    "一生只够爱一个人，想试试和你在一起的感觉",
    "以后的路，想和你一起走",
    "草莓、蓝莓、蔓越莓，今天，我只想pick你",
    "和你在一起的时光都很耀眼",
    "你知道吗？我最喜欢的日期是520"
  ];
  
  // 随机安排时间弹出告白语
  const scheduleNextConfession = () => {
    const nextTime = 30000 + Math.random() * 60000; // 30-90秒后
    
    setTimeout(() => {
      // 随机选择一条告白语
      const confession = confessions[Math.floor(Math.random() * confessions.length)];
      
      // 随机位置显示
      const x = Math.random() * window.innerWidth * 0.8 + window.innerWidth * 0.1;
      const y = Math.random() * window.innerHeight * 0.8 + window.innerHeight * 0.1;
      
      showFloatingConfession(confession, x, y);
      
      // 安排下一条
      scheduleNextConfession();
    }, nextTime);
  };
  
  // 开始安排
  scheduleNextConfession();
}

// 显示浮动的告白语
function showFloatingConfession(text, x, y) {
  const confession = document.createElement('div');
  confession.className = 'floating-confession';
  confession.textContent = text;
  
  confession.style.cssText = `
    position: fixed;
    left: ${x}px;
    top: ${y}px;
    transform: translate(-50%, -50%);
    background: linear-gradient(135deg, #ffcdd2, #f8bbd0);
    color: #d81b60;
    padding: 15px 25px;
    border-radius: 30px;
    font-size: 16px;
    box-shadow: 0 5px 20px rgba(233, 30, 99, 0.3);
    z-index: 1000;
    opacity: 0;
    transition: opacity 0.5s ease;
    max-width: 300px;
    text-align: center;
    pointer-events: none;
  `;
  
  document.body.appendChild(confession);
  
  // 淡入显示
  setTimeout(() => {
    confession.style.opacity = "1";
  }, 100);
  
  // 6秒后淡出
  setTimeout(() => {
    confession.style.opacity = "0";
    setTimeout(() => {
      if (confession.parentNode) {
        confession.parentNode.removeChild(confession);
      }
    }, 500);
  }, 6000);
}

// 全局消息缓存
const loveMessageCache = {
  messages: [],
  lastUpdated: null,
  cacheLifetime: 30 * 60 * 1000 // 30 minutes in milliseconds
};

// 从API获取情话 - 彻底解决CORS问题，使用增强本地库
async function fetchLoveMessage() {
  // 检查是否有已缓存的消息
  if (loveMessageCache.messages.length > 0 && 
      loveMessageCache.lastUpdated && 
      Date.now() - loveMessageCache.lastUpdated < loveMessageCache.cacheLifetime) {
    // 从缓存中返回一条随机消息
    return loveMessageCache.messages[Math.floor(Math.random() * loveMessageCache.messages.length)];
  }
  
  try {
    // 由于外部API存在CORS限制，我们使用扩展的本地情话库
    const localLoveMessages = [
      "遇见你是命中注定",
      "喜欢你，比喜欢自己还多一点",
      "你是我最想留住的那颗流星",
      "时光温热，岁月静好，你还在我身边就好",
      "余生请多指教",
      "我喜欢你，像风走了八千里，不问归期",
      "每一次我想你，全世界每一处都是你",
      "我的眼里只有你，我的未来只有你",
      "陪你走过漫长岁月，是我今生最大的幸福",
      "你是我写不完的情诗，说不完的情话",
      "喜欢你，就像呼吸一样自然",
      "想和你一起走过四季三餐的温暖",
      "我知道遇见你不容易，错过了会很可惜",
      "世界上最幸福的事，是我喜欢的人也喜欢我",
      "我希望有一个门，只为你开",
      "因为有你，连平凡的日子也闪着光",
      "我想陪在你身边，像星星陪着月亮",
      "爱情是个甜甜的梦，你是个美美的人",
      "多希望我能成为你的温暖，抵挡世间寒冷",
      "我的心是旷野，你是我唯一的过客",
      "在人潮拥挤的街道偶遇你，是一种神奇的缘分",
      "喜欢你的笑容，胜过世间所有美好",
      "愿我们执手一生，看尽世间繁华",
      "有了你，我的心不再漂泊",
      "你是我爱的开始，也是我爱的结束"
    ];
    
    // 使用已缓存的消息和本地库结合，增加随机性
    let availableMessages = [...localLoveMessages];
    
    // 排除已缓存的最近几条消息，避免重复
    if (loveMessageCache.messages.length > 0) {
      const recentMessages = loveMessageCache.messages.slice(-5);
      availableMessages = availableMessages.filter(msg => !recentMessages.includes(msg));
    }
    
    // 如果过滤后没有可用消息，使用完整列表
    if (availableMessages.length === 0) {
      availableMessages = localLoveMessages;
    }
    
    // 随机选择一条情话
    const message = availableMessages[Math.floor(Math.random() * availableMessages.length)];
    
    // 更新缓存
    loveMessageCache.messages.push(message);
    loveMessageCache.lastUpdated = Date.now();
    
    // 限制缓存大小
    if (loveMessageCache.messages.length > 50) {
      loveMessageCache.messages.shift(); // 移除最早的消息
    }
    
    return message;
  } catch (error) {
    console.error('获取情话失败:', error);
    return "你是我最想收到的礼物"; // 网络错误时的备用消息
  }
}

// 获取多条情话消息 - 不再调用API，直接使用本地数据
async function fetchMultipleLoveMessages(count = 5) {
  // Check if we have enough cached messages
  if (loveMessageCache.messages.length >= count && 
      loveMessageCache.lastUpdated && 
      Date.now() - loveMessageCache.lastUpdated < loveMessageCache.cacheLifetime) {
    // Return random messages from cache
    const shuffled = [...loveMessageCache.messages].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
  
  // 本地情话库
  const localLoveMessages = [
    "遇见你是命中注定",
    "喜欢你，比喜欢自己还多一点",
    "你是我最想留住的那颗流星",
    "时光温热，岁月静好，你还在我身边就好",
    "余生请多指教",
    "我喜欢你，像风走了八千里，不问归期",
    "每一次我想你，全世界每一处都是你",
    "我的眼里只有你，我的未来只有你",
    "陪你走过漫长岁月，是我今生最大的幸福",
    "你是我写不完的情诗，说不完的情话",
    "喜欢你，就像呼吸一样自然",
    "想和你一起走过四季三餐的温暖",
    "我知道遇见你不容易，错过了会很可惜",
    "世界上最幸福的事，是我喜欢的人也喜欢我",
    "我希望有一个门，只为你开",
    "因为有你，连平凡的日子也闪着光",
    "我想陪在你身边，像星星陪着月亮",
    "爱情是个甜甜的梦，你是个美美的人",
    "多希望我能成为你的温暖，抵挡世间寒冷",
    "我的心是旷野，你是我唯一的过客",
    "世界上最远的距离是没有遇见",
    "有你，我才是完整的",
    "所有的偶然都是命运的约定",
    "和你在一起的每一天都是情人节",
    "我想要的爱情是晴天和雨天都有你"
  ];
  
  try {
    // 随机选择多条情话
    const results = [];
    const usedIndexes = new Set();
    
    for (let i = 0; i < count; i++) {
      let randomIndex;
      // 确保不重复
      do {
        randomIndex = Math.floor(Math.random() * localLoveMessages.length);
      } while (usedIndexes.has(randomIndex) && usedIndexes.size < localLoveMessages.length);
      
      usedIndexes.add(randomIndex);
      results.push(localLoveMessages[randomIndex]);
    }
    
    // 更新缓存
    loveMessageCache.messages = [...loveMessageCache.messages, ...results];
    loveMessageCache.lastUpdated = Date.now();
    
    // 限制缓存大小
    if (loveMessageCache.messages.length > 50) {
      loveMessageCache.messages = loveMessageCache.messages.slice(-50);
    }
    
    return results;
  } catch (error) {
    console.error('获取多条情话失败:', error);
    return fallbackMessages(count);
  }
}

function fallbackMessages(count = 5) {
  // 备用情话
  const backupMessages = [
    "遇见你是命中注定",
    "喜欢你，比喜欢自己还多一点",
    "你是我最想留住的那颗流星",
    "时光温热，岁月静好，你还在我身边就好",
    "余生请多指教",
    "我喜欢你，像风走了八千里，不问归期",
    "每一次我想你，全世界每一处都是你",
    "我的眼里只有你，我的未来只有你",
    "陪你走过漫长岁月，是我今生最大的幸福",
    "你是我写不完的情诗，说不完的情话"
  ];
  
  // Randomly select messages
  const result = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * backupMessages.length);
    result.push(backupMessages[randomIndex]);
  }
  return result;
}
