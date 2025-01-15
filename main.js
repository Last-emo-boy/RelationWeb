// main.js

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
    // 先获取节点名称列表 (id字段)，并构造 fuse.js
    const nodeList = cy.nodes().map(n => ({ id: n.data('id') }));
    const fuse = new Fuse(nodeList, {
      keys: ['id'],
      includeScore: true,
      threshold: 0.4, // 匹配阈值，可根据需要调优
    });
  
    // 实时监听搜索输入变化
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.trim();
      cy.elements().style('display', 'element'); // 先重置为显示
  
      if (!query) return; // 输入空则不做匹配
  
      // fuse.js 进行模糊搜索
      const results = fuse.search(query);
      // 提取匹配到的节点 ID
      const matchedIds = results.map(r => r.item.id);
  
      // 显示匹配到的节点以及相关连的边 / 节点，隐藏其他
      const matchedNodes = cy
        .nodes()
        .filter(n => matchedIds.includes(n.data('id')));
      if (matchedNodes.length > 0) {
        const connectedElems = matchedNodes
          .connectedEdges()
          .connectedNodes()
          .add(matchedNodes.connectedEdges())
          .add(matchedNodes);
        // 隐藏不相关的
        cy.elements().not(connectedElems).style('display', 'none');
      } else {
        // 未匹配到任何节点，提示或可留空
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
          .filter(e => e.data('relationship').toLowerCase() === selectedRelationship);
        const connectedNodes = targetEdges.connectedNodes();
        const elementsToShow = targetEdges.add(connectedNodes);
        cy.elements().style('display', 'none');
        elementsToShow.style('display', 'element');
      } else {
        // 显示所有元素
        cy.elements().style('display', 'element');
      }
    });
  
    // ===============================
    // 10. 重置视图功能
    // ===============================
    document.getElementById('resetBtn').addEventListener('click', () => {
        cy.elements().style('display', 'element');
        
        // 重新运行布局（以 cose-bilkent 为例）
        cy.layout({
          name: 'cose-bilkent',
          // 其他 layout 参数与初始保持一致即可
          fit: false  // 先不自动fit, 我们会手动再调用 cy.fit()
        }).run();
        
        // 结束后，再自适应视口
        cy.once('layoutstop', () => {
          cy.fit();
        });
      });
      
  
    // ===============================
    // 11. 导出图片功能
    // ===============================
    const exportImage = format => {
      const dataUrl = format === 'jpg' ? cy.jpg() : cy.png();
      const downloadLink = document.createElement('a');
      downloadLink.href = dataUrl;
      downloadLink.download = `graph.${format}`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };
    document.getElementById('exportPng').addEventListener('click', () => {
      exportImage('png');
    });
    document.getElementById('exportJpg').addEventListener('click', () => {
      exportImage('jpg');
    });
  
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
        case 'r': // 重置视图
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
    // 示例：节点被选中时显示通知
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
    // 若在HTML里有个按钮 <button id="themeToggleBtn">切换主题</button>
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
  });
  