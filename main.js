/**
 * Love Graph - 主应用程序
 * 现代化重构版本，使用 ES6+ 语法
 */

// ==========================================
// 全局状态管理
// ==========================================
const AppState = {
  cy: null,
  fuse: null,
  theme: localStorage.getItem('theme') || 'light',
  sidebarOpen: window.innerWidth > 1024,
  selectedNode: null,
  highlightedPath: [],
  compareNode: null, // 用于对比的节点
};

// ==========================================
// 数据分析工具
// ==========================================
const Analytics = {
  // 获取基础统计
  getBasicStats() {
    const cy = AppState.cy;
    const nodes = cy.nodes();
    const edges = cy.edges();
    
    const maleCount = nodes.filter('[gender = "男"]').length;
    const femaleCount = nodes.filter('[gender = "女"]').length;
    
    const currentCount = edges.filter('[relationship = "CURRENT_PARTNER"]').length;
    const exCount = edges.filter('[relationship = "EX_PARTNER"]').length;
    const affectionCount = edges.filter('[relationship = "AFFECTION"]').length;
    
    // 计算连接度
    const degrees = nodes.map(n => n.degree());
    const avgDegree = degrees.length ? (degrees.reduce((a, b) => a + b, 0) / degrees.length).toFixed(1) : 0;
    const maxDegree = degrees.length ? Math.max(...degrees) : 0;
    
    return {
      totalNodes: nodes.length,
      totalEdges: edges.length,
      maleCount,
      femaleCount,
      currentCount,
      exCount,
      affectionCount,
      avgDegree,
      maxDegree
    };
  },
  
  // 获取连接度分布
  getConnectionDistribution() {
    const cy = AppState.cy;
    const distribution = {};
    
    cy.nodes().forEach(node => {
      const degree = node.degree();
      const key = degree > 10 ? '10+' : String(degree);
      distribution[key] = (distribution[key] || 0) + 1;
    });
    
    // 按数字排序
    const sorted = {};
    const keys = Object.keys(distribution).sort((a, b) => {
      if (a === '10+') return 1;
      if (b === '10+') return -1;
      return parseInt(a) - parseInt(b);
    });
    keys.forEach(k => sorted[k] = distribution[k]);
    
    return sorted;
  },
  
  // 获取排行榜数据
  getRankings(type = 'connections') {
    const cy = AppState.cy;
    let rankings = [];
    
    cy.nodes().forEach(node => {
      const id = node.data('id');
      const gender = node.data('gender');
      const edges = node.connectedEdges();
      
      let value = 0;
      let label = '';
      
      switch (type) {
        case 'connections':
          value = node.degree();
          label = '个连接';
          break;
        case 'admirers':
          // 被单向好感的数量
          value = edges.filter(e => 
            e.data('relationship') === 'AFFECTION' && e.data('target') === id
          ).length;
          label = '人喜欢';
          break;
        case 'exes':
          // 前任数量
          value = edges.filter(e => e.data('relationship') === 'EX_PARTNER').length;
          label = '段前任';
          break;
      }
      
      rankings.push({ id, gender, value, label });
    });
    
    // 排序并返回前15
    return rankings.sort((a, b) => b.value - a.value).slice(0, 15);
  },
  
  // 获取节点的关系详情
  getNodeRelations(node) {
    const id = node.data('id');
    const edges = node.connectedEdges();
    
    const relations = {
      current: [],
      ex: [],
      admirers: [],  // 喜欢我的
      admiring: []   // 我喜欢的
    };
    
    edges.forEach(edge => {
      const source = edge.data('source');
      const target = edge.data('target');
      const relationship = edge.data('relationship');
      const otherId = source === id ? target : source;
      const otherNode = AppState.cy.getElementById(otherId);
      const otherGender = otherNode.data('gender');
      
      const item = { id: otherId, gender: otherGender };
      
      switch (relationship) {
        case 'CURRENT_PARTNER':
          relations.current.push(item);
          break;
        case 'EX_PARTNER':
          relations.ex.push(item);
          break;
        case 'AFFECTION':
          if (source === id) {
            relations.admiring.push(item);
          } else {
            relations.admirers.push(item);
          }
          break;
      }
    });
    
    return relations;
  },
  
  // 查找两人的共同关系
  findCommonConnections(nodeId1, nodeId2) {
    const node1 = AppState.cy.getElementById(nodeId1);
    const node2 = AppState.cy.getElementById(nodeId2);
    
    const neighbors1 = new Set(node1.neighborhood('node').map(n => n.data('id')));
    const neighbors2 = new Set(node2.neighborhood('node').map(n => n.data('id')));
    
    const common = [...neighbors1].filter(id => neighbors2.has(id) && id !== nodeId1 && id !== nodeId2);
    
    return common.map(id => {
      const node = AppState.cy.getElementById(id);
      return {
        id,
        gender: node.data('gender')
      };
    });
  }
};

// ==========================================
// 工具函数
// ==========================================
const Utils = {
  // 显示 Toast 通知
  showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  },
  
  // 显示模态框
  showModal(title, content, buttons = []) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalFooter = document.getElementById('modalFooter');
    
    modalTitle.textContent = title;
    modalBody.innerHTML = content;
    
    // 清空并添加按钮
    modalFooter.innerHTML = '';
    buttons.forEach(btn => {
      const button = document.createElement('button');
      button.className = `btn ${btn.class || 'btn-secondary'}`;
      button.textContent = btn.text;
      button.onclick = () => {
        if (btn.onClick) btn.onClick();
        if (btn.closeOnClick !== false) this.hideModal();
      };
      modalFooter.appendChild(button);
    });
    
    modal.classList.add('show');
  },
  
  // 隐藏模态框
  hideModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('show');
  },
  
  // 隐藏加载动画
  hideLoader() {
    const loader = document.getElementById('loader');
    loader.classList.add('hidden');
  },
  
  // 防抖函数
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
  
  // 获取关系类型的中文名称
  getRelationshipName(type) {
    const names = {
      'CURRENT_PARTNER': '现任伴侣',
      'EX_PARTNER': '前任伴侣',
      'AFFECTION': '单向好感'
    };
    return names[type] || type;
  },
  
  // 获取关系类型的颜色
  getRelationshipColor(type) {
    const colors = {
      'CURRENT_PARTNER': '#22c55e',
      'EX_PARTNER': '#ef4444',
      'AFFECTION': '#8b5cf6'
    };
    return colors[type] || '#94a3b8';
  }
};

// 全局通知函数（兼容旧代码）
window.showNotification = Utils.showToast.bind(Utils);

// ==========================================
// Cytoscape 配置
// ==========================================
const CytoscapeConfig = {
  // 获取样式配置
  getStyles() {
    return [
      // 节点基础样式
      {
        selector: 'node',
        style: {
          'background-color': ele => ele.data('gender') === '男' ? '#3b82f6' : '#ec4899',
          'background-opacity': 0.9,
          'label': 'data(id)',
          'text-valign': 'center',
          'text-halign': 'center',
          'color': '#ffffff',
          'text-outline-width': 2,
          'text-outline-color': ele => ele.data('gender') === '男' ? '#1e40af' : '#9d174d',
          'font-size': '11px',
          'font-weight': 500,
          'width': 50,
          'height': 50,
          'border-width': 3,
          'border-color': ele => ele.data('gender') === '男' ? '#60a5fa' : '#f472b6',
          'transition-property': 'background-color, border-color, width, height',
          'transition-duration': '0.2s',
        },
      },
      // 节点悬停样式
      {
        selector: 'node:active',
        style: {
          'overlay-opacity': 0,
        },
      },
      {
        selector: 'node.hover',
        style: {
          'width': 60,
          'height': 60,
          'border-width': 4,
          'z-index': 999,
        },
      },
      // 边基础样式
      {
        selector: 'edge',
        style: {
          'width': 2,
          'line-color': '#94a3b8',
          'target-arrow-color': '#94a3b8',
          'target-arrow-shape': 'triangle',
          'curve-style': 'bezier',
          'opacity': 0.7,
          'transition-property': 'width, line-color, opacity',
          'transition-duration': '0.2s',
        },
      },
      // 现任关系
      {
        selector: 'edge[relationship = "CURRENT_PARTNER"]',
        style: {
          'line-color': '#22c55e',
          'target-arrow-color': '#22c55e',
          'width': 3,
        },
      },
      // 前任关系
      {
        selector: 'edge[relationship = "EX_PARTNER"]',
        style: {
          'line-style': 'dashed',
          'line-color': '#ef4444',
          'target-arrow-color': '#ef4444',
        },
      },
      // 单向好感
      {
        selector: 'edge[relationship = "AFFECTION"]',
        style: {
          'line-style': 'dotted',
          'line-color': '#8b5cf6',
          'target-arrow-color': '#8b5cf6',
        },
      },
      // 高亮样式
      {
        selector: '.highlighted',
        style: {
          'background-color': '#fbbf24',
          'line-color': '#fbbf24',
          'target-arrow-color': '#fbbf24',
          'border-color': '#f59e0b',
          'width': 4,
          'z-index': 999,
        },
      },
      // 悬停边样式
      {
        selector: 'edge.hover',
        style: {
          'width': 4,
          'opacity': 1,
          'z-index': 998,
        },
      },
      // 淡出样式
      {
        selector: '.faded',
        style: {
          'opacity': 0.2,
        },
      },
      // 选中样式
      {
        selector: 'node:selected',
        style: {
          'border-color': '#fbbf24',
          'border-width': 4,
        },
      },
    ];
  },
  
  // 获取布局配置
  getLayout(name = 'cose-bilkent') {
    const layouts = {
      'cose-bilkent': {
        name: 'cose-bilkent',
        quality: 'proof',
        nodeDimensionsIncludeLabels: true,
        refresh: 30,
        fit: true,
        padding: 50,
        randomize: true,
        nodeRepulsion: 6000,
        idealEdgeLength: 120,
        edgeElasticity: 0.45,
        nestingFactor: 0.1,
        gravity: 0.15,
        numIter: 2500,
        tile: true,
        animate: 'end',
        animationDuration: 500,
        animationEasing: 'ease-out',
      },
      'circle': {
        name: 'circle',
        fit: true,
        padding: 50,
        animate: true,
        animationDuration: 500,
      },
      'grid': {
        name: 'grid',
        fit: true,
        padding: 50,
        animate: true,
        animationDuration: 500,
      },
      'concentric': {
        name: 'concentric',
        fit: true,
        padding: 50,
        animate: true,
        animationDuration: 500,
        concentric: node => node.degree(),
        levelWidth: () => 2,
      },
      'breadthfirst': {
        name: 'breadthfirst',
        fit: true,
        padding: 50,
        animate: true,
        animationDuration: 500,
        directed: false,
      },
    };
    
    return layouts[name] || layouts['cose-bilkent'];
  }
};

// ==========================================
// 应用程序类
// ==========================================
class LoveGraphApp {
  constructor() {
    this.init();
  }
  
  // 初始化应用
  async init() {
    try {
      this.initCytoscape();
      this.initSearch();
      this.bindEvents();
      this.applyTheme();
      this.updateStats();
      
      // 隐藏加载动画
      setTimeout(() => {
        Utils.hideLoader();
      }, 500);
      
    } catch (error) {
      console.error('初始化失败:', error);
      Utils.showToast('应用加载失败，请刷新页面重试');
    }
  }
  
  // 初始化 Cytoscape
  initCytoscape() {
    AppState.cy = cytoscape({
      container: document.getElementById('cy'),
      elements: elementsData,
      style: CytoscapeConfig.getStyles(),
      layout: CytoscapeConfig.getLayout(),
      userZoomingEnabled: true,
      userPanningEnabled: true,
      boxSelectionEnabled: true,
      minZoom: 0.2,
      maxZoom: 3,
    });
    
    // 导出到全局
    window.cy = AppState.cy;
    
    // 绑定 Cytoscape 事件
    this.bindCytoscapeEvents();
  }
  
  // 绑定 Cytoscape 事件
  bindCytoscapeEvents() {
    const cy = AppState.cy;
    
    // 节点悬停
    cy.on('mouseover', 'node', evt => {
      const node = evt.target;
      node.addClass('hover');
      node.connectedEdges().addClass('hover');
      document.body.style.cursor = 'pointer';
    });
    
    cy.on('mouseout', 'node', evt => {
      const node = evt.target;
      node.removeClass('hover');
      node.connectedEdges().removeClass('hover');
      document.body.style.cursor = 'default';
    });
    
    // 边悬停
    cy.on('mouseover', 'edge', evt => {
      evt.target.addClass('hover');
      document.body.style.cursor = 'pointer';
    });
    
    cy.on('mouseout', 'edge', evt => {
      evt.target.removeClass('hover');
      document.body.style.cursor = 'default';
    });
    
    // 节点点击
    cy.on('tap', 'node', evt => {
      const node = evt.target;
      this.showNodeInfo(node);
    });
    
    // 边点击
    cy.on('tap', 'edge', evt => {
      const edge = evt.target;
      this.showEdgeInfo(edge);
    });
    
    // 背景点击
    cy.on('tap', evt => {
      if (evt.target === cy) {
        this.hideNodeInfo();
      }
    });
  }
  
  // 初始化搜索
  initSearch() {
    const nodeList = AppState.cy.nodes().map(n => ({
      id: n.data('id'),
      gender: n.data('gender')
    }));
    
    AppState.fuse = new Fuse(nodeList, {
      keys: ['id'],
      includeScore: true,
      threshold: 0.4,
    });
  }
  
  // 绑定 DOM 事件
  bindEvents() {
    // 主题切换
    document.getElementById('themeToggle')?.addEventListener('click', () => {
      this.toggleTheme();
    });
    
    // 侧边栏切换
    document.getElementById('toggleSidebar')?.addEventListener('click', () => {
      this.toggleSidebar();
    });
    
    document.getElementById('closeSidebar')?.addEventListener('click', () => {
      this.toggleSidebar(false);
    });
    
    // 缩放控制
    document.getElementById('zoomIn')?.addEventListener('click', () => {
      AppState.cy.zoom(AppState.cy.zoom() * 1.2);
    });
    
    document.getElementById('zoomOut')?.addEventListener('click', () => {
      AppState.cy.zoom(AppState.cy.zoom() / 1.2);
    });
    
    document.getElementById('fitView')?.addEventListener('click', () => {
      AppState.cy.fit(undefined, 50);
    });
    
    // 数据仪表盘
    document.getElementById('showDashboard')?.addEventListener('click', () => {
      this.toggleDashboard();
    });
    
    document.getElementById('closeDashboard')?.addEventListener('click', () => {
      this.toggleDashboard(false);
    });
    
    // 排行榜
    document.getElementById('showRanking')?.addEventListener('click', () => {
      this.toggleRanking();
    });
    
    document.getElementById('closeRanking')?.addEventListener('click', () => {
      this.toggleRanking(false);
    });
    
    // 排行榜标签切换
    document.querySelectorAll('.ranking-tab').forEach(tab => {
      tab.addEventListener('click', e => {
        document.querySelectorAll('.ranking-tab').forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        this.updateRankingContent(e.target.dataset.tab);
      });
    });
    
    // 搜索
    const searchInput = document.getElementById('searchInput');
    searchInput?.addEventListener('input', Utils.debounce(e => {
      this.handleSearch(e.target.value);
    }, 200));
    
    // 路径查找
    document.getElementById('findPath')?.addEventListener('click', () => {
      this.findShortestPath();
    });
    
    // 关系筛选
    document.getElementById('relationFilter')?.addEventListener('change', e => {
      this.filterByRelation(e.target.value);
    });
    
    // 重置视图
    document.getElementById('resetView')?.addEventListener('click', () => {
      this.resetView();
    });
    
    // 布局切换
    document.querySelectorAll('.layout-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const layout = e.currentTarget.dataset.layout;
        this.changeLayout(layout);
        
        // 更新按钮状态
        document.querySelectorAll('.layout-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
      });
    });
    
    // 导出功能
    document.getElementById('exportPng')?.addEventListener('click', () => {
      this.exportImage('png');
    });
    
    document.getElementById('exportJpg')?.addEventListener('click', () => {
      this.exportImage('jpg');
    });
    
    document.getElementById('exportJson')?.addEventListener('click', () => {
      this.exportJson();
    });
    
    // 关闭节点信息
    document.getElementById('closeNodeInfo')?.addEventListener('click', () => {
      this.hideNodeInfo();
    });
    
    // 关闭模态框
    document.getElementById('closeModal')?.addEventListener('click', () => {
      Utils.hideModal();
    });
    
    document.querySelector('.modal-backdrop')?.addEventListener('click', () => {
      Utils.hideModal();
    });
    
    // 键盘快捷键
    document.addEventListener('keydown', e => {
      this.handleKeyboard(e);
    });
    
    // 响应式处理
    window.addEventListener('resize', Utils.debounce(() => {
      if (window.innerWidth > 1024 && !AppState.sidebarOpen) {
        this.toggleSidebar(true);
      }
    }, 200));
  }
  
  // 切换主题
  toggleTheme() {
    AppState.theme = AppState.theme === 'light' ? 'dark' : 'light';
    this.applyTheme();
  }
  
  // 应用主题
  applyTheme() {
    document.documentElement.setAttribute('data-theme', AppState.theme);
    localStorage.setItem('theme', AppState.theme);
    
    const themeIcon = document.querySelector('#themeToggle i');
    if (themeIcon) {
      themeIcon.className = AppState.theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
  }
  
  // 切换侧边栏
  toggleSidebar(forceState) {
    const sidebar = document.getElementById('sidebar');
    AppState.sidebarOpen = forceState !== undefined ? forceState : !AppState.sidebarOpen;
    
    if (AppState.sidebarOpen) {
      sidebar.classList.remove('collapsed');
    } else {
      sidebar.classList.add('collapsed');
    }
  }
  
  // 处理搜索
  handleSearch(query) {
    const resultsContainer = document.getElementById('searchResults');
    
    if (!query.trim()) {
      resultsContainer.innerHTML = '';
      AppState.cy.elements().removeClass('faded');
      return;
    }
    
    const results = AppState.fuse.search(query);
    
    // 显示搜索结果
    resultsContainer.innerHTML = results.slice(0, 10).map(r => `
      <div class="search-result-item" data-id="${r.item.id}">
        <span class="gender-indicator ${r.item.gender === '男' ? 'male' : 'female'}"></span>
        <span>${r.item.id}</span>
      </div>
    `).join('');
    
    // 绑定点击事件
    resultsContainer.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('click', () => {
        const nodeId = item.dataset.id;
        this.focusOnNode(nodeId);
      });
    });
    
    // 高亮匹配的节点
    const matchedIds = results.map(r => r.item.id);
    const matchedNodes = AppState.cy.nodes().filter(n => matchedIds.includes(n.data('id')));
    
    if (matchedNodes.length > 0) {
      AppState.cy.elements().addClass('faded');
      matchedNodes.removeClass('faded');
      matchedNodes.connectedEdges().removeClass('faded');
      matchedNodes.connectedEdges().connectedNodes().removeClass('faded');
    }
  }
  
  // 聚焦到节点
  focusOnNode(nodeId) {
    const node = AppState.cy.getElementById(nodeId);
    if (node.length > 0) {
      AppState.cy.elements().removeClass('faded');
      AppState.cy.animate({
        fit: { eles: node, padding: 150 },
        duration: 500,
        easing: 'ease-out'
      });
      node.addClass('highlighted');
      setTimeout(() => node.removeClass('highlighted'), 2000);
    }
  }
  
  // 查找最短路径
  findShortestPath() {
    const startId = document.getElementById('pathStart')?.value.trim();
    const endId = document.getElementById('pathEnd')?.value.trim();
    
    if (!startId || !endId) {
      Utils.showToast('请输入起始和目标节点');
      return;
    }
    
    const startNode = AppState.cy.getElementById(startId);
    const endNode = AppState.cy.getElementById(endId);
    
    if (startNode.empty() || endNode.empty()) {
      Utils.showToast('找不到指定的节点');
      return;
    }
    
    const result = AppState.cy.elements().aStar({
      root: startNode,
      goal: endNode,
    });
    
    // 清除之前的高亮
    AppState.cy.elements().removeClass('highlighted faded');
    
    if (result.found) {
      AppState.cy.elements().addClass('faded');
      result.path.removeClass('faded').addClass('highlighted');
      
      AppState.cy.animate({
        fit: { eles: result.path, padding: 100 },
        duration: 500
      });
      
      Utils.showToast(`找到路径！距离：${result.path.length - 1} 步`);
    } else {
      Utils.showToast('未找到连接路径');
    }
  }
  
  // 按关系类型筛选
  filterByRelation(relationType) {
    if (!relationType) {
      AppState.cy.elements().style('display', 'element');
      return;
    }
    
    const targetEdges = AppState.cy.edges().filter(e => 
      e.data('relationship') === relationType
    );
    const connectedNodes = targetEdges.connectedNodes();
    const elementsToShow = targetEdges.add(connectedNodes);
    
    AppState.cy.elements().style('display', 'none');
    elementsToShow.style('display', 'element');
    
    AppState.cy.fit(elementsToShow, 50);
  }
  
  // 重置视图
  resetView() {
    AppState.cy.elements().removeClass('highlighted faded');
    AppState.cy.elements().style('display', 'element');
    
    AppState.cy.fit(undefined, 50);
    
    // 重置筛选器
    const relationFilter = document.getElementById('relationFilter');
    if (relationFilter) relationFilter.value = '';
    
    // 清除搜索
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';
    document.getElementById('searchResults').innerHTML = '';
    
    Utils.showToast('视图已重置');
  }
  
  // 切换布局
  changeLayout(layoutName) {
    const layout = CytoscapeConfig.getLayout(layoutName);
    AppState.cy.layout(layout).run();
    Utils.showToast(`已切换到${layoutName}布局`);
  }
  
  // 显示节点信息
  showNodeInfo(node) {
    const nodeInfo = document.getElementById('nodeInfo');
    const content = document.getElementById('nodeInfoContent');
    
    const id = node.data('id');
    const gender = node.data('gender');
    const connectedEdges = node.connectedEdges();
    
    // 计算关系统计
    const currentCount = connectedEdges.filter(e => 
      e.data('relationship') === 'CURRENT_PARTNER'
    ).length / 2;
    const exCount = connectedEdges.filter(e => 
      e.data('relationship') === 'EX_PARTNER'
    ).length / 2;
    const affectionCount = connectedEdges.filter(e => 
      e.data('relationship') === 'AFFECTION'
    ).length;
    
    content.innerHTML = `
      <div class="node-info-header">
        <div class="node-info-avatar ${gender === '男' ? 'male' : 'female'}">
          ${gender === '男' ? '👨' : '👩'}
        </div>
        <div>
          <div class="node-info-name">${id}</div>
          <div class="node-info-gender">${gender}</div>
        </div>
      </div>
      <div class="node-info-stats">
        <div class="node-stat">
          <span class="node-stat-value">${Math.round(currentCount)}</span>
          <span class="node-stat-label">现任</span>
        </div>
        <div class="node-stat">
          <span class="node-stat-value">${Math.round(exCount)}</span>
          <span class="node-stat-label">前任</span>
        </div>
        <div class="node-stat">
          <span class="node-stat-value">${affectionCount}</span>
          <span class="node-stat-label">好感</span>
        </div>
        <div class="node-stat">
          <span class="node-stat-value">${connectedEdges.connectedNodes().length - 1}</span>
          <span class="node-stat-label">连接数</span>
        </div>
      </div>
    `;
    
    nodeInfo.classList.remove('hidden');
    AppState.selectedNode = node;
    
    Utils.showToast(`已选中: ${id}`);
  }
  
  // 显示边信息
  showEdgeInfo(edge) {
    const source = edge.data('source');
    const target = edge.data('target');
    const relationship = Utils.getRelationshipName(edge.data('relationship'));
    
    Utils.showToast(`${source} → ${target}: ${relationship}`);
  }
  
  // 隐藏节点信息
  hideNodeInfo() {
    const nodeInfo = document.getElementById('nodeInfo');
    nodeInfo.classList.add('hidden');
    AppState.selectedNode = null;
  }
  
  // 导出图片
  exportImage(format) {
    const options = {
      scale: 3,
      full: true,
      bg: AppState.theme === 'dark' ? '#0f172a' : '#ffffff'
    };
    
    const dataUrl = format === 'jpg' 
      ? AppState.cy.jpg(options) 
      : AppState.cy.png(options);
    
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `love-graph.${format}`;
    link.click();
    
    Utils.showToast(`已导出 ${format.toUpperCase()} 图片`);
  }
  
  // 导出 JSON
  exportJson() {
    const json = AppState.cy.json();
    const dataStr = 'data:text/json;charset=utf-8,' + 
      encodeURIComponent(JSON.stringify(json.elements, null, 2));
    
    const link = document.createElement('a');
    link.href = dataStr;
    link.download = 'love-graph-data.json';
    link.click();
    
    Utils.showToast('已导出 JSON 数据');
  }
  
  // 更新统计信息
  updateStats() {
    const cy = AppState.cy;
    
    document.getElementById('totalNodes').textContent = cy.nodes().length;
    document.getElementById('totalEdges').textContent = cy.edges().length;
    document.getElementById('maleCount').textContent = cy.nodes('[gender = "男"]').length;
    document.getElementById('femaleCount').textContent = cy.nodes('[gender = "女"]').length;
  }
  
  // 更新面板并排状态
  updatePanelLayout() {
    const dashboard = document.getElementById('dashboardPanel');
    const ranking = document.getElementById('rankingPanel');
    
    if (!dashboard || !ranking) return;
    
    const dashboardOpen = !dashboard.classList.contains('hidden');
    const rankingOpen = !ranking.classList.contains('hidden');
    
    // 如果两个面板都打开，给仪表盘添加 with-ranking 类使其左移
    if (dashboardOpen && rankingOpen) {
      dashboard.classList.add('with-ranking');
    } else {
      dashboard.classList.remove('with-ranking');
    }
  }
  
  // 切换数据仪表盘
  toggleDashboard(show) {
    const dashboard = document.getElementById('dashboardPanel');
    if (!dashboard) return;
    
    const shouldShow = show !== undefined ? show : dashboard.classList.contains('hidden');
    
    if (shouldShow) {
      this.updateDashboardContent();
      dashboard.classList.remove('hidden');
      // 添加内容动画
      this.animateDashboardContent();
    } else {
      dashboard.classList.add('hidden');
    }
    
    // 更新面板布局
    this.updatePanelLayout();
  }
  
  // 仪表盘内容动画
  animateDashboardContent() {
    const dashboard = document.getElementById('dashboardPanel');
    if (!dashboard) return;
    
    // 为各个元素添加渐入动画
    const overviewCards = dashboard.querySelectorAll('.overview-card');
    const chartCards = dashboard.querySelectorAll('.chart-card');
    
    overviewCards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      setTimeout(() => {
        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 100 + index * 80);
    });
    
    chartCards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      setTimeout(() => {
        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 300 + index * 100);
    });
  }
  
  // 更新仪表盘内容
  updateDashboardContent() {
    const cy = AppState.cy;
    
    // 更新概览卡片
    const nodes = cy.nodes().length;
    const edges = cy.edges().length;
    const avgDegree = nodes > 0 ? (edges * 2 / nodes).toFixed(1) : 0;
    const maxDegree = Math.max(...cy.nodes().map(n => n.connectedEdges().length), 0);
    
    document.getElementById('dashTotalNodes').textContent = nodes;
    document.getElementById('dashTotalEdges').textContent = edges;
    document.getElementById('dashAvgConnections').textContent = avgDegree;
    document.getElementById('dashMaxConnections').textContent = maxDegree;
    
    // 关系类型统计
    const relationStats = {
      'CURRENT_PARTNER': 0,
      'EX_PARTNER': 0,
      'AFFECTION': 0
    };
    
    cy.edges().forEach(edge => {
      const rel = edge.data('relationship');
      if (relationStats.hasOwnProperty(rel)) {
        relationStats[rel]++;
      }
    });
    
    // 性别分布（使用 CSS 模拟饼图）
    const genderChart = document.getElementById('genderChart');
    const genderLegend = document.getElementById('genderLegend');
    if (genderChart && genderLegend) {
      const maleCount = cy.nodes('[gender = "男"]').length;
      const femaleCount = cy.nodes('[gender = "女"]').length;
      const total = maleCount + femaleCount;
      const malePct = total > 0 ? Math.round((maleCount / total) * 100) : 0;
      const femalePct = 100 - malePct;
      
      genderChart.style.background = `conic-gradient(
        #3b82f6 0% ${malePct}%,
        #ec4899 ${malePct}% 100%
      )`;
      
      genderLegend.innerHTML = `
        <div class="legend-item"><span class="legend-color" style="background: #3b82f6"></span>男 ${maleCount} (${malePct}%)</div>
        <div class="legend-item"><span class="legend-color" style="background: #ec4899"></span>女 ${femaleCount} (${femalePct}%)</div>
      `;
    }
    
    // 关系类型分布（使用 CSS 模拟饼图）
    const relationChart = document.getElementById('relationChart');
    const relationLegend = document.getElementById('relationLegend');
    if (relationChart && relationLegend) {
      const total = Object.values(relationStats).reduce((a, b) => a + b, 0);
      const currentPct = total > 0 ? Math.round((relationStats['CURRENT_PARTNER'] / total) * 100) : 0;
      const exPct = total > 0 ? Math.round((relationStats['EX_PARTNER'] / total) * 100) : 0;
      const affectionPct = 100 - currentPct - exPct;
      
      relationChart.style.background = `conic-gradient(
        #6366f1 0% ${currentPct}%,
        #f59e0b ${currentPct}% ${currentPct + exPct}%,
        #ef4444 ${currentPct + exPct}% 100%
      )`;
      
      relationLegend.innerHTML = `
        <div class="legend-item"><span class="legend-color" style="background: #6366f1"></span>现任 ${relationStats['CURRENT_PARTNER']} (${currentPct}%)</div>
        <div class="legend-item"><span class="legend-color" style="background: #f59e0b"></span>前任 ${relationStats['EX_PARTNER']} (${exPct}%)</div>
        <div class="legend-item"><span class="legend-color" style="background: #ef4444"></span>好感 ${relationStats['AFFECTION']} (${affectionPct}%)</div>
      `;
    }
    
    // 连接度分布柱状图
    const connectionDistChart = document.getElementById('connectionDistChart');
    if (connectionDistChart) {
      const degreeDist = {};
      cy.nodes().forEach(node => {
        const degree = node.connectedEdges().length;
        degreeDist[degree] = (degreeDist[degree] || 0) + 1;
      });
      
      const maxDegreeInDist = Math.max(...Object.keys(degreeDist).map(Number), 1);
      const maxCount = Math.max(...Object.values(degreeDist), 1);
      
      let barsHtml = '';
      for (let i = 0; i <= Math.min(maxDegreeInDist, 15); i++) {
        const count = degreeDist[i] || 0;
        const height = (count / maxCount) * 100;
        barsHtml += `
          <div class="bar-wrapper">
            <div class="bar" style="height: ${height}%">
              <span class="bar-value">${count}</span>
            </div>
            <span class="bar-label">${i}</span>
          </div>
        `;
      }
      
      connectionDistChart.innerHTML = barsHtml;
    }
  }
  
  // 切换排行榜
  toggleRanking(show) {
    const ranking = document.getElementById('rankingPanel');
    if (!ranking) return;
    
    const shouldShow = show !== undefined ? show : ranking.classList.contains('hidden');
    
    if (shouldShow) {
      this.updateRankingContent('connections');
      ranking.classList.remove('hidden');
      // 添加内容动画
      this.animateRankingContent();
    } else {
      ranking.classList.add('hidden');
    }
    
    // 更新面板布局
    this.updatePanelLayout();
  }
  
  // 排行榜内容动画
  animateRankingContent() {
    const ranking = document.getElementById('rankingPanel');
    if (!ranking) return;
    
    const items = ranking.querySelectorAll('.ranking-item');
    items.forEach((item, index) => {
      item.style.opacity = '0';
      item.style.transform = 'translateX(20px)';
      setTimeout(() => {
        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        item.style.opacity = '1';
        item.style.transform = 'translateX(0)';
      }, 100 + index * 50);
    });
  }
  
  // 更新排行榜内容
  updateRankingContent(type) {
    const rankingContent = document.getElementById('rankingContent');
    if (!rankingContent) return;
    
    const cy = AppState.cy;
    let rankings = [];
    
    if (type === 'connections') {
      // 按连接数排名
      rankings = cy.nodes().map(node => ({
        id: node.data('id'),
        gender: node.data('gender'),
        value: node.connectedEdges().length,
        label: '个连接'
      })).sort((a, b) => b.value - a.value).slice(0, 10);
    } else if (type === 'admirers') {
      // 被喜欢数排名（被 AFFECTION 指向的次数）
      const admiredCount = {};
      cy.edges('[relationship = "AFFECTION"]').forEach(edge => {
        const target = edge.data('target');
        admiredCount[target] = (admiredCount[target] || 0) + 1;
      });
      
      rankings = Object.entries(admiredCount)
        .map(([id, count]) => {
          const node = cy.getElementById(id);
          return {
            id,
            gender: node.data('gender'),
            value: count,
            label: '人喜欢'
          };
        })
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);
    } else if (type === 'exes') {
      // 前任数排名
      rankings = cy.nodes().map(node => {
        const edges = node.connectedEdges();
        const exCount = edges.filter(e => 
          e.data('relationship') === 'EX_PARTNER'
        ).length;
        return {
          id: node.data('id'),
          gender: node.data('gender'),
          value: Math.round(exCount / 2), // 因为每段关系被计算两次
          label: '个前任'
        };
      }).filter(item => item.value > 0)
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);
    }
    
    rankingContent.innerHTML = rankings.length > 0 
      ? rankings.map((item, index) => `
        <div class="ranking-item" data-id="${item.id}">
          <span class="ranking-position ${index < 3 ? 'top-' + (index + 1) : ''}">${index + 1}</span>
          <span class="ranking-name">
            <span class="gender-indicator ${item.gender === '男' ? 'male' : 'female'}"></span>
            ${item.id}
          </span>
          <span class="ranking-value">${item.value} ${item.label}</span>
        </div>
      `).join('')
      : '<div class="no-data">暂无数据</div>';
    
    // 绑定点击事件
    rankingContent.querySelectorAll('.ranking-item').forEach(item => {
      item.addEventListener('click', () => {
        this.focusOnNode(item.dataset.id);
        this.toggleRanking(false);
      });
    });
    
    // 添加内容动画
    this.animateRankingContent();
  }
  
  // 处理键盘快捷键
  handleKeyboard(e) {
    // 如果在输入框中，不处理快捷键
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      return;
    }
    
    switch (e.key.toLowerCase()) {
      case 'f':
        AppState.cy.fit(undefined, 50);
        break;
      case 'r':
        this.resetView();
        break;
      case 's':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          this.exportImage('png');
        }
        break;
      case 'escape':
        this.hideNodeInfo();
        this.toggleDashboard(false);
        this.toggleRanking(false);
        Utils.hideModal();
        break;
    }
  }
}

// ==========================================
// 启动应用
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  new LoveGraphApp();
});
