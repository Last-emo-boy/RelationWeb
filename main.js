document.addEventListener('DOMContentLoaded', () => {
  // ===============================
  // 1. 初始化 Cytoscape
  // ===============================
  let currentTheme = 'light'; // 若需要主题切换，可留此变量
  const cy = cytoscape({
    container: document.getElementById('cy'),
    elements: elementsData, // 从 data.js 中引入的元素数据

    style: [
      // 节点基础样式 (light 主题示例)
      {
        selector: 'node',
        style: {
          'background-color': ele =>
            ele.data('gender') === '男' ? '#1E90FF' : '#FF69B4',
          label: 'data(id)',
          'text-valign': 'center',
          color: '#fff',
          'text-outline-width': 2,
          'text-outline-color': '#888',
          'font-size': '10px',
          'text-wrap': 'wrap',
          'text-max-width': 80,
          width: '60px',
          height: '60px',
        },
      },
      // 边基础样式
      {
        selector: 'edge',
        style: {
          width: 3,
          'line-color': '#ccc',
          'target-arrow-color': '#ccc',
          'target-arrow-shape': 'triangle',
          'curve-style': 'bezier',
          label: 'data(relationship)',
          'text-rotation': 'autorotate',
          'text-margin-y': -20,
          'font-size': '8px',
          color: '#666',
          'text-background-opacity': 1,
          'text-background-color': '#fff',
          'text-background-shape': 'roundrectangle',
          'text-background-padding': 2,
          'edge-text-rotation': 'autorotate',
        },
      },
      // 不同 relationship 的边样式
      {
        selector: 'edge[relationship = "EX_PARTNER"]',
        style: {
          'line-style': 'dashed',
          'line-color': '#FF6347',
          'target-arrow-color': '#FF6347',
        },
      },
      {
        selector: 'edge[relationship = "CURRENT_PARTNER"]',
        style: {
          'line-color': '#32CD32',
          'target-arrow-color': '#32CD32',
        },
      },
      {
        selector: 'edge[relationship = "AFFECTION"]',
        style: {
          'line-style': 'dotted',
          'line-color': '#1E90FF',
          'target-arrow-color': '#1E90FF',
        },
      },
      // 高亮样式
      {
        selector: '.highlighted',
        style: {
          'background-color': '#FFD700',
          'line-color': '#FFD700',
          'target-arrow-color': '#FFD700',
          'transition-property': 'background-color, line-color, target-arrow-color',
          'transition-duration': '0.5s',
        },
      },
      // 悬停时的样式
      {
        selector: 'node.hover',
        style: {
          'border-width': 6,
          'border-color': '#FFD700',
          'overlay-opacity': 0,
        },
      },
      {
        selector: 'edge.hover',
        style: {
          width: 6,
          'line-color': '#FFD700',
          'target-arrow-color': '#FFD700',
          'overlay-opacity': 0,
        },
      },
      // （可选）暗黑主题示例，实际项目中可使用其他方式切换
      {
        selector: 'node.dark-mode',
        style: {
          'background-color': ele =>
            ele.data('gender') === '男' ? '#001F3F' : '#FF1493',
        },
      },
      {
        selector: 'edge.dark-mode',
        style: {
          'line-color': '#666',
          'target-arrow-color': '#666',
        },
      },
    ],

    // 布局设定（cose-bilkent）
    layout: {
      name: 'cose-bilkent',
      nodeDimensionsIncludeLabels: false,
      refresh: 10,
      fit: true,
      padding: 15,
      randomize: true,
      idealEdgeLength: 100,
      animate: 'end',
      animationEasing: 'ease-in-out',
      animationDuration: 1000,
      infinite: true,
      avoidOverlap: true,
      allowNodesOverlap: false,
      nodeOverlap: 15,
      nodeRepulsion: 4500,
      idealInterClusterEdgeLengthCoefficient: 1.4,
      gravity: 0.1,
      gravityRange: 3.8,
      gravityCompound: 1.0,
      gravityRangeCompound: 1.5,
      nestingFactor: 0.1,
    },

    userZoomingEnabled: true,
    userPanningEnabled: true,
    boxSelectionEnabled: true,
  });

  // ===============================
  // 2. panzoom 插件配置
  // ===============================
  cy.panzoom({
    zoomFactor: 0.05,
    minZoom: 0.1,
    maxZoom: 10,
    fitPadding: 50,
    position: { left: '10px', top: '10px' },
  });

  // ===============================
  // 3. qTip 提示框
  // ===============================
  cy.nodes().forEach(node => {
    node.qtip({
      content: () => `
        <strong>${node.data('id')}</strong><br>
        性别: ${node.data('gender')}
      `,
      position: { my: 'top center', at: 'bottom center' },
      style: { classes: 'qtip-bootstrap' },
      show: { solo: true },
    });
  });

  cy.edges().forEach(edge => {
    edge.qtip({
      content: () => `
        <strong>关系: ${edge.data('relationship')}</strong><br>
        来源: ${edge.data('source')}<br>
        目标: ${edge.data('target')}
      `,
      position: { my: 'top center', at: 'bottom center' },
      style: { classes: 'qtip-dark' },
      show: { solo: true },
    });
  });

  // ===============================
  // 4. contextMenus 右键菜单
  // ===============================
  cy.contextMenus({
    menuItems: [
      {
        id: 'details',
        content: '查看详情',
        tooltipText: '查看节点或边的详情',
        selector: 'node, edge',
        onClickFunction: event => {
          const { target } = event;
          if (target.isNode()) {
            showModalWithNodeDetails(target);
          } else if (target.isEdge()) {
            showModalWithEdgeDetails(target);
          }
        },
        hasTrailingDivider: true,
      },
      {
        id: 'highlight',
        content: '高亮',
        tooltipText: '高亮节点或边',
        selector: 'node, edge',
        onClickFunction: event => {
          const { target } = event;
          target.addClass('highlighted');
        },
      },
      {
        id: 'remove-highlight',
        content: '取消高亮',
        tooltipText: '取消高亮状态',
        selector: 'node.highlighted, edge.highlighted',
        onClickFunction: event => {
          const { target } = event;
          target.removeClass('highlighted');
        },
      },
      {
        id: 'remove-element',
        content: '删除元素',
        tooltipText: '从视图中删除此元素',
        selector: 'node, edge',
        onClickFunction: event => {
          const { target } = event;
          target.remove();
          updateStats();
        },
        hasTrailingDivider: true,
      },
      {
        id: 'center-view',
        content: '聚焦到此节点',
        tooltipText: '将节点居中到视窗',
        selector: 'node',
        onClickFunction: event => {
          const node = event.target;
          cy.animate({
            fit: { eles: node, padding: 100 },
          });
        },
      },
    ],
  });

  // ===============================
  // 5. 悬停高亮事件
  // ===============================
  cy.on('mouseover', 'node', evt => {
    const node = evt.target;
    node.addClass('hover');
    node.connectedEdges().addClass('hover');
  });
  cy.on('mouseout', 'node', evt => {
    const node = evt.target;
    node.removeClass('hover');
    node.connectedEdges().removeClass('hover');
  });
  cy.on('mouseover', 'edge', evt => {
    evt.target.addClass('hover');
  });
  cy.on('mouseout', 'edge', evt => {
    evt.target.removeClass('hover');
  });

  // ===============================
  // 6. 模态框展示函数
  // ===============================
  function showModalWithNodeDetails(node) {
    const content = `
      <strong>${node.data('id')}</strong><br>
      性别: ${node.data('gender')}
    `;
    $('#modalContent').html(content);
    $('#detailsModal').modal('show');
  }

  function showModalWithEdgeDetails(edge) {
    const content = `
      <strong>关系: ${edge.data('relationship')}</strong><br>
      来源: ${edge.data('source')}<br>
      目标: ${edge.data('target')}
    `;
    $('#modalContent').html(content);
    $('#detailsModal').modal('show');
  }

  // ===============================
  // 7. 查找最短路径功能
  // ===============================
  document.getElementById('findPath').addEventListener('click', () => {
    const startId = document.getElementById('nodeA').value.trim();
    const endId = document.getElementById('nodeB').value.trim();
    if (startId && endId) {
      const shortestPath = cy.elements().aStar({
        root: `[id='${startId}']`,
        goal: `[id='${endId}']`,
      });
      cy.elements().removeClass('highlighted');
      if (shortestPath.found) {
        shortestPath.path.addClass('highlighted');
      } else {
        alert('未找到路径');
      }
    }
  });

  // ===============================
  // 8. 实时搜索（模糊匹配）
  // ===============================
  const nodeList = cy.nodes().map(n => ({ id: n.data('id') }));
  const fuse = new Fuse(nodeList, {
    keys: ['id'],
    includeScore: true,
    threshold: 0.4, // 匹配阈值，可根据需要调优
  });
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim();
    cy.elements().style('display', 'element'); // 先重置为显示
    if (!query) return; // 输入空则不做匹配

    const results = fuse.search(query);
    const matchedIds = results.map(r => r.item.id);

    const matchedNodes = cy
      .nodes()
      .filter(n => matchedIds.includes(n.data('id')));

    if (matchedNodes.length > 0) {
      const connectedElems = matchedNodes
        .connectedEdges()
        .connectedNodes()
        .add(matchedNodes.connectedEdges())
        .add(matchedNodes);
      cy.elements().not(connectedElems).style('display', 'none');
    } else {
      // 未匹配到任何节点，可提示
      // alert('未匹配到任何节点');
    }
  });

  // ===============================
  // 9. 关系过滤功能
  // ===============================
  document.getElementById('filterBtn').addEventListener('click', () => {
    const selectedRelationship = document
      .getElementById('relationshipFilter')
      .value.toLowerCase();
    if (selectedRelationship) {
      const targetEdges = cy
        .edges()
        .filter(
          e => e.data('relationship').toLowerCase() === selectedRelationship
        );
      const connectedNodes = targetEdges.connectedNodes();
      const elementsToShow = targetEdges.add(connectedNodes);
      cy.elements().style('display', 'none');
      elementsToShow.style('display', 'element');
    } else {
      cy.elements().style('display', 'element');
    }
  });

  // ===============================
  // 10. 重置视图功能
  // ===============================
  document.getElementById('resetBtn').addEventListener('click', () => {
    cy.elements().style('display', 'element');

    cy.layout({
      name: 'cose-bilkent',
      fit: false,
    }).run();

    cy.once('layoutstop', () => {
      cy.fit();
    });
  });

  // ===============================
  // 11. 导出图片功能
  // ===============================
  const exportImage = (format) => {
    let dataUrl;
    if (format === 'jpg') {
      dataUrl = cy.jpg({
        scale: 5,   // 可根据需要调大或调小
        full: true,
        bg: 'white' // 背景色可以自定义
      });
    } else {
      dataUrl = cy.png({
        scale: 5,
        full: true,
        bg: 'white'
      });
    }
  
    const downloadLink = document.createElement('a');
    downloadLink.href = dataUrl;
    downloadLink.download = `graph.${format}`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };
  

  // ===============================
  // 12. 节点点击事件：显示节点信息
  // ===============================
  cy.on('tap', 'node', evt => {
    const node = evt.target;
    const connectedEdges = node.connectedEdges();
    const affectionCount = connectedEdges.filter(
      edge => edge.data('relationship') === 'AFFECTION'
    ).length;
    const otherRelationshipsCount = (connectedEdges.length - affectionCount) / 2;
    const totalRelationships = affectionCount + otherRelationshipsCount;

    const infoDiv = document.getElementById('info');
    infoDiv.innerHTML = `
      选中节点: ${node.data('id')}<br>
      性别: ${node.data('gender')}<br>
      单向关系数 (AFFECTION): ${affectionCount}<br>
      双向关系数 (EX_PARTNER, CURRENT_PARTNER 等): ${otherRelationshipsCount}<br>
      总关系数: ${totalRelationships}
    `;
  });

  // ===============================
  // 13. 更新统计信息
  // ===============================
  function updateStats() {
    const totalNodes = cy.nodes().length;
    const totalEdges = cy.edges().length;
    const maleCount = cy.nodes('[gender = "男"]').length;
    const femaleCount = cy.nodes('[gender = "女"]').length;

    document.getElementById('stats').innerHTML = `
      <p>总节点数: ${totalNodes}</p>
      <p>总关系数: ${totalEdges}</p>
      <p>男性: ${maleCount}</p>
      <p>女性: ${femaleCount}</p>
    `;
  }
  updateStats(); // 初始化时调用

  // ===============================
  // 14. 键盘快捷键
  // ===============================
  document.addEventListener('keydown', event => {
    switch (event.key) {
      case 'f': // 适应视图
        cy.fit();
        break;
      case 'r': // 重置 Cytoscape 内部位置（保留缩放？）
        cy.reset();
        break;
      case 's': // 导出图片 (默认png)
        exportImage('png');
        break;
      default:
        break;
    }
  });

  // ===============================
  // 15. Toast 通知
  // ===============================
  const showNotification = message => {
    $('#toastBody').text(message);
    $('#notification').toast('show');
  };
  cy.on('select', 'node', evt => {
    const { id } = evt.target.data();
    showNotification(`选中节点: ${id}`);
  });

  // ===============================
  // 16. 切换搜索框显示
  // ===============================
  document
    .getElementById('toggleSearchBox')
    .addEventListener('click', () => {
      $('#searchBox').collapse('toggle');
    });

  // ===============================
  // 17. (可选) 主题切换示例 (light/dark)
  // ===============================
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      currentTheme = currentTheme === 'light' ? 'dark' : 'light';
      if (currentTheme === 'dark') {
        cy.nodes().addClass('dark-mode');
        cy.edges().addClass('dark-mode');
        document.body.style.backgroundColor = '#333';
        document.body.style.color = '#eee';
      } else {
        cy.nodes().removeClass('dark-mode');
        cy.edges().removeClass('dark-mode');
        document.body.style.backgroundColor = '';
        document.body.style.color = '';
      }
    });
  }

  // =====================================================================
  // ====================== 以下为新增的扩展示例 ===========================
  // =====================================================================

  // 1) 动态添加节点
  const addNodeBtn = document.getElementById('addNodeBtn');
  addNodeBtn.addEventListener('click', () => {
    const newId = prompt('请输入新节点ID:');
    if (!newId) return;
    const newGender = prompt('请输入性别（男 / 女）:') || '男';
    // 检查是否已存在该ID
    if (cy.getElementById(newId).nonempty()) {
      alert('该ID已存在，请使用其他ID！');
      return;
    }
    cy.add({
      group: 'nodes',
      data: {
        id: newId,
        gender: newGender
      },
      position: {
        x: cy.width() / 2,
        y: cy.height() / 2
      }
    });
    updateStats();
  });

  // 2) 动态添加边
  const addEdgeBtn = document.getElementById('addEdgeBtn');
  addEdgeBtn.addEventListener('click', () => {
    const sourceId = prompt('请输入边的起始节点ID:');
    const targetId = prompt('请输入边的目标节点ID:');
    const relationship = prompt('请输入关系类型(如 CURRENT_PARTNER):') || 'AFFECTION';
    if (!sourceId || !targetId) return;
    if (!cy.getElementById(sourceId).nonempty() || !cy.getElementById(targetId).nonempty()) {
      alert('起点或终点节点不存在！');
      return;
    }
    cy.add({
      group: 'edges',
      data: {
        source: sourceId,
        target: targetId,
        relationship: relationship
      }
    });
    updateStats();
  });

  // 3) 编辑选中元素
  const editElementBtn = document.getElementById('editElementBtn');
  editElementBtn.addEventListener('click', () => {
    const selected = cy.$(':selected'); // 获取当前选中的元素(节点或边)
    if (selected.empty()) {
      alert('请先选中一个节点或边再进行编辑。');
      return;
    }
    if (selected.length > 1) {
      alert('暂不支持同时编辑多个元素，请只选中一个。');
      return;
    }
    if (selected.isNode()) {
      const currentId = selected.data('id');
      const newId = prompt('新的节点ID:', currentId);
      const newGender = prompt('新的性别（男 / 女）:', selected.data('gender'));
      if (newId && newId !== currentId && cy.getElementById(newId).empty()) {
        selected.data('id', newId);
      }
      if (newGender) {
        selected.data('gender', newGender);
      }
    } else {
      // Edge
      const rel = selected.data('relationship');
      const newRel = prompt('新的关系类型:', rel) || rel;
      selected.data('relationship', newRel);
    }
    updateStats();
  });

  // 4) 多布局切换
  const layoutSelect = document.getElementById('layoutSelect');
  layoutSelect.addEventListener('change', e => {
    const layoutName = e.target.value;
    cy.layout({ name: layoutName, fit: true, padding: 20 }).run();
  });

  // 5) 版本 / 时间切换（演示）
  const versionSelect = document.getElementById('versionSelect');
  versionSelect.addEventListener('change', e => {
    const version = e.target.value;
    if (!version) {
      // 恢复原始数据
      cy.elements().remove();
      cy.add(elementsData);
      cy.layout({ name: 'cose-bilkent', fit: true }).run();
      updateStats();
      return;
    }
    if (version === 'v1') {
      // 示例：加载 version1 数据 (需你自己定义 version1Data)
      // 这里仅演示做法，可在 data.js 里准备多个 dataset
      cy.elements().remove();
      cy.add(version1Data);
      cy.layout({ name: 'cose-bilkent', fit: true }).run();
      updateStats();
    } else if (version === 'v2') {
      // 示例：加载 version2 数据 (需你自己定义 version2Data)
      cy.elements().remove();
      cy.add(version2Data);
      cy.layout({ name: 'cose-bilkent', fit: true }).run();
      updateStats();
    }
  });

  // ====================================
  // 6) 社区检测 (基于连通分量的简单示例)
  // ====================================
  const detectCommunityBtn = document.getElementById('detectCommunityBtn');
  detectCommunityBtn.addEventListener('click', () => {
    // 1. 获取所有连通分量
    const components = cy.elements().components();

    // 2. 准备一个颜色数组，给不同社区分别着色
    //    如果社区数多，可以再扩充这个数组，或随机生成颜色。
    const colors = [
      '#FF6961', // 浅红
      '#77DD77', // 浅绿
      '#AEC6CF', // 浅蓝
      '#F49AC2', // 粉
      '#FFD1DC', // 淡粉
      '#CFCFC4', // 灰
      '#F5CBA7', // 浅橙
      '#B19CD9', // 淡紫
    ];

    let colorIndex = 0;

    // 3. 遍历每个社区 (连通分量)，给其节点上色
    components.forEach((component, index) => {
      // 如果颜色数组不够，会循环使用
      const color = colors[colorIndex % colors.length];
      colorIndex++;

      component.nodes().forEach(node => {
        // 直接覆盖背景色(会覆盖原先的 gender 颜色)
        node.style('background-color', color);

        // 可在 data 中存储社区 ID，若后续要用
        node.data('community', index);
      });
    });

    // 4. 弹窗或 Toast 提示
    //   你可自行修改成 showNotification(...) 或其他UI提示
    alert(`已检测到 ${components.length} 个连通分量，并成功为每个社区着色！`);
  });


  // 7) 高级查询示例（多点最短路径 / AI 解析）
  const advancedQueryBtn = document.getElementById('advancedQueryBtn');
  advancedQueryBtn.addEventListener('click', () => {
    // 这里只是演示弹个窗 / 或输入
    const query = prompt('输入查询指令(示例: "展示所有与 A 直接连接的节点")');
    if (!query) return;

    // 在此做简单的关键词分析 / 或请求后端 AI
    // 这里只是示例
    if (query.includes('与') && query.includes('直接连接')) {
      // 假装提取节点ID
      const splitted = query.split('与');
      // 仅示例
      const nodeId = splitted[1].replace('直接连接的节点', '').trim();
      const centerNode = cy.getElementById(nodeId);
      if (centerNode.empty()) {
        alert('未找到该节点');
        return;
      }
      cy.elements().removeClass('highlighted');
      const neighbors = centerNode.connectedEdges().connectedNodes();
      neighbors.add(centerNode).addClass('highlighted');
      alert(`已高亮 ${nodeId} 及其直接连接节点！`);
    } else {
      alert('自然语言解析尚未实现，你可以来帮我写hh。');
    }
  });

  // 8) 导入 / 导出 JSON
  const importJsonBtn = document.getElementById('importJsonBtn');
  const importJsonFile = document.getElementById('importJsonFile');
  importJsonBtn.addEventListener('click', () => {
    const file = importJsonFile.files[0];
    if (!file) {
      alert('请先选择一个 JSON 文件！');
      return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const jsonData = JSON.parse(e.target.result);
        cy.elements().remove(); // 清空现有图
        cy.add(jsonData);
        cy.layout({ name: 'cose-bilkent', fit: true }).run();
        updateStats();
        alert('导入成功！');
      } catch (err) {
        alert('JSON 解析失败，请检查文件格式！');
      }
    };
    reader.readAsText(file);
  });

  const exportJsonBtn = document.getElementById('exportJsonBtn');
  exportJsonBtn.addEventListener('click', () => {
    const json = cy.json();
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(json.elements));
    const downloadLink = document.createElement('a');
    downloadLink.href = dataStr;
    downloadLink.download = 'graph.json';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  });
});
