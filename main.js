// main.js

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
                selector: '[relationship = "EX_PARTNER"]',
                style: {
                    'line-style': 'dashed'
                }
            },
            {
                selector: '.highlighted',
                style: {
                    'background-color': '#ff0',
                    'line-color': '#f00',
                    'target-arrow-color': '#f00',
                    'transition-property': 'background-color, line-color, target-arrow-color',
                    'transition-duration': '0.5s'
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
        }
    });

    // 以下是交互逻辑和事件处理代码
    // 查找最短路径
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

    // 节点搜索
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

    // 关系过滤
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

    // 重置视图
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

    // 节点交互效果
    cy.on('mouseover', 'node', function(event) {
        event.target.animate({
            style: { 'border-width': '2px', 'border-color': '#000', 'border-style': 'solid' }
        }, {
            duration: 200
        });
    });

    cy.on('mouseout', 'node', function(event) {
        event.target.animate({
            style: { 'border-width': 0 }
        }, {
            duration: 200
        });
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
});
