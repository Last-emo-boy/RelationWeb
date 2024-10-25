// main.js

// 导入必要的库（如果使用模块化，可以使用 import 语句）
document.addEventListener('DOMContentLoaded', function(){
    const cy = cytoscape({
        container: document.getElementById('cy'),

        elements: elementsData, // 使用从 data.js 引入的 elementsData

        style: [
            {
                selector: 'node',
                style: {
                    'background-color': ele => ele.data('gender') === '男' ? '#1E90FF' : '#FF69B4',
                    'label': 'data(id)',
                    'text-valign': 'center',
                    'color': '#fff',
                    'text-outline-width': 2,
                    'text-outline-color': '#888',
                    'font-size': '10px',
                    'text-wrap': 'wrap',
                    'text-max-width': 80,
                    'width': '60px',
                    'height': '60px'
                }
            },
            {
                selector: 'edge',
                style: {
                    'width': 3,
                    'line-color': '#ccc',
                    'target-arrow-color': '#ccc',
                    'target-arrow-shape': 'triangle',
                    'curve-style': 'bezier',
                    'label': 'data(relationship)',
                    'text-rotation': 'autorotate',
                    'text-margin-y': -20,
                    'font-size': '8px',
                    'color': '#666',
                    'text-background-opacity': 1,
                    'text-background-color': '#fff',
                    'text-background-shape': 'roundrectangle',
                    'text-background-padding': 2,
                    'edge-text-rotation': 'autorotate'
                }
            },
            {
                selector: 'edge[relationship = "EX_PARTNER"]',
                style: {
                    'line-style': 'dashed',
                    'line-color': '#FF6347',
                    'target-arrow-color': '#FF6347'
                }
            },
            {
                selector: 'edge[relationship = "CURRENT_PARTNER"]',
                style: {
                    'line-color': '#32CD32',
                    'target-arrow-color': '#32CD32'
                }
            },
            {
                selector: 'edge[relationship = "AFFECTION"]',
                style: {
                    'line-style': 'dotted',
                    'line-color': '#1E90FF',
                    'target-arrow-color': '#1E90FF'
                }
            },
            {
                selector: '.highlighted',
                style: {
                    'background-color': '#FFD700',
                    'line-color': '#FFD700',
                    'target-arrow-color': '#FFD700',
                    'transition-property': 'background-color, line-color, target-arrow-color',
                    'transition-duration': '0.5s'
                }
            },
            {
                selector: 'node.hover',
                style: {
                    'border-width': 6,
                    'border-color': '#FFD700',
                    'overlay-opacity': 0
                }
            },
            {
                selector: 'edge.hover',
                style: {
                    'width': 6,
                    'line-color': '#FFD700',
                    'target-arrow-color': '#FFD700',
                    'overlay-opacity': 0
                }
            }
        ],

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
        boxSelectionEnabled: true
    });

    // 初始化 panzoom
    cy.panzoom({
        zoomFactor: 0.05,
        minZoom: 0.1,
        maxZoom: 10,
        fitPadding: 50,
        position: {
            left: '10px',
            top: '10px'
        }
    });

    // 初始化 qTip 工具提示
    cy.nodes().forEach(function(node) {
        node.qtip({
            content: function() {
                return `
                    <strong>${node.data('id')}</strong><br>
                    性别: ${node.data('gender')}
                `;
            },
            position: {
                my: 'top center',
                at: 'bottom center',
            },
            style: {
                classes: 'qtip-bootstrap',
            },
            show: {
                solo: true,
            },
        });
    });

    cy.edges().forEach(function(edge) {
        edge.qtip({
            content: function() {
                return `
                    <strong>关系: ${edge.data('relationship')}</strong><br>
                    来源: ${edge.data('source')}<br>
                    目标: ${edge.data('target')}
                `;
            },
            position: {
                my: 'top center',
                at: 'bottom center',
            },
            style: {
                classes: 'qtip-dark',
            },
            show: {
                solo: true,
            },
        });
    });

    // 添加节点和边的悬停高亮效果
    cy.on('mouseover', 'node', function(event) {
        var node = event.target;
        node.addClass('hover');
        node.connectedEdges().addClass('hover');
    });

    cy.on('mouseout', 'node', function(event) {
        var node = event.target;
        node.removeClass('hover');
        node.connectedEdges().removeClass('hover');
    });

    cy.on('mouseover', 'edge', function(event) {
        var edge = event.target;
        edge.addClass('hover');
    });

    cy.on('mouseout', 'edge', function(event) {
        var edge = event.target;
        edge.removeClass('hover');
    });

    // 初始化上下文菜单
    cy.contextMenus({
        menuItems: [
            {
                id: 'details',
                content: '查看详情',
                tooltipText: '查看节点或边的详情',
                selector: 'node, edge',
                onClickFunction: function(event) {
                    var target = event.target || event.cyTarget;
                    if (target.isNode()) {
                        showModalWithNodeDetails(target);
                    } else if (target.isEdge()) {
                        showModalWithEdgeDetails(target);
                    }
                },
                hasTrailingDivider: true
            },
            {
                id: 'highlight',
                content: '高亮',
                tooltipText: '高亮节点或边',
                selector: 'node, edge',
                onClickFunction: function(event) {
                    var target = event.target || event.cyTarget;
                    target.addClass('highlighted');
                }
            },
            {
                id: 'remove-highlight',
                content: '取消高亮',
                tooltipText: '取消高亮状态',
                selector: 'node.highlighted, edge.highlighted',
                onClickFunction: function(event) {
                    var target = event.target || event.cyTarget;
                    target.removeClass('highlighted');
                }
            }
        ]
    });

    // 实现详情弹窗函数
    function showModalWithNodeDetails(node) {
        var content = `
            <strong>${node.data('id')}</strong><br>
            性别: ${node.data('gender')}
        `;
        $('#modalContent').html(content);
        $('#detailsModal').modal('show');
    }

    function showModalWithEdgeDetails(edge) {
        var content = `
            <strong>关系: ${edge.data('relationship')}</strong><br>
            来源: ${edge.data('source')}<br>
            目标: ${edge.data('target')}
        `;
        $('#modalContent').html(content);
        $('#detailsModal').modal('show');
    }

    // 查找最短路径功能
    document.getElementById('findPath').addEventListener('click', function() {
        const startId = document.getElementById('nodeA').value.trim();
        const endId = document.getElementById('nodeB').value.trim();
        if (startId && endId) {
            const shortestPath = cy.elements().aStar({ root: `[id='${startId}']`, goal: `[id='${endId}']` });
            if (shortestPath.found) {
                cy.elements().removeClass('highlighted');
                shortestPath.path.addClass('highlighted');
            } else {
                alert('未找到路径');
            }
        }
    });

    // 节点搜索功能
    document.getElementById('searchBtn').addEventListener('click', function() {
        var keyword = document.getElementById('searchInput').value.trim().toLowerCase();
        if (keyword) {
            var targetNode = cy.nodes().filter(function(n) {
                return n.data('id').toLowerCase() === keyword;
            });

            if (targetNode.length > 0) {
                var connectedElems = targetNode.connectedEdges().connectedNodes().add(targetNode.connectedEdges()).add(targetNode);
                cy.elements().not(connectedElems).style('display', 'none');
                connectedElems.style('display', 'element');
            } else {
                alert('未找到匹配的节点');
            }
        }
    });

    // 关系过滤功能
    document.getElementById('filterBtn').addEventListener('click', function() {
        var selectedRelationship = document.getElementById('relationshipFilter').value;
        if (selectedRelationship) {
            var targetEdges = cy.edges().filter(function(e) {
                return e.data('relationship').toLowerCase() === selectedRelationship;
            });
            var connectedNodes = targetEdges.connectedNodes();
            var elementsToShow = targetEdges.add(connectedNodes);
            cy.elements().style('display', 'none');
            elementsToShow.style('display', 'element');
        } else {
            cy.elements().style('display', 'element');
        }
    });

    // 重置视图功能
    document.getElementById('resetBtn').addEventListener('click', function() {
        cy.elements().style('display', 'element');
    });

    // 导出为PNG
    document.getElementById('exportPng').addEventListener('click', function() {
        var png64 = cy.png();
        var downloadLink = document.createElement('a');
        downloadLink.href = png64;
        downloadLink.download = 'graph.png';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    });

    // 导出为JPG
    document.getElementById('exportJpg').addEventListener('click', function() {
        var jpg64 = cy.jpg();
        var downloadLink = document.createElement('a');
        downloadLink.href = jpg64;
        downloadLink.download = 'graph.jpg';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    });

    // 节点点击事件，显示信息
    cy.on('tap', 'node', function(evt) {
        var node = evt.target;
        var connectedEdges = node.connectedEdges();
        var affectionCount = connectedEdges.filter(edge => edge.data('relationship') === 'AFFECTION').length;
        var otherRelationshipsCount = (connectedEdges.length - affectionCount) / 2;
        var totalRelationships = affectionCount + otherRelationshipsCount;

        var info = document.getElementById('info');
        info.innerHTML = '选中节点: ' + node.data('id') +
                        '<br>性别: ' + node.data('gender') +
                        '<br>单向关系数 (AFFECTION): ' + affectionCount +
                        '<br>双向关系数 (EX_PARTNER, CURRENT_PARTNER等): ' + otherRelationshipsCount +
                        '<br>总关系数: ' + totalRelationships;
    });

    // 初始化自动完成功能
    var nodeNames = cy.nodes().map(function(node) {
        return node.data('id');
    }).sort();

    $(function() {
        $("#searchInput").autocomplete({
            source: nodeNames,
            minLength: 1
        });
    });

    // 更新统计信息
    function updateStats() {
        var totalNodes = cy.nodes().length;
        var totalEdges = cy.edges().length;
        var maleCount = cy.nodes('[gender = "男"]').length;
        var femaleCount = cy.nodes('[gender = "女"]').length;

        document.getElementById('stats').innerHTML = `
          <p>总节点数: ${totalNodes}</p>
          <p>总关系数: ${totalEdges}</p>
          <p>男性: ${maleCount}</p>
          <p>女性: ${femaleCount}</p>
        `;
    }

    // 初始化时调用
    updateStats();

    // 添加键盘快捷键
    document.addEventListener('keydown', function(event) {
        if (event.key === 'f') { // 按 'f' 键适应视图
            cy.fit();
        } else if (event.key === 'r') { // 按 'r' 键重置视图
            cy.reset();
        } else if (event.key === 's') { // 按 's' 键保存图像
            var png64 = cy.png();
            var downloadLink = document.createElement('a');
            downloadLink.href = png64;
            downloadLink.download = 'graph.png';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
    });

    // 显示通知函数
    function showNotification(message) {
        $('#toastBody').text(message);
        $('#notification').toast('show');
    }

    // 示例：在节点被选中时显示通知
    cy.on('select', 'node', function(event) {
        var node = event.target;
        showNotification('选中节点: ' + node.data('id'));
    });

    // 切换搜索框显示
    document.getElementById('toggleSearchBox').addEventListener('click', function() {
        $('#searchBox').collapse('toggle');
    });
});
