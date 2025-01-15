// convertToExcel.js
const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

// 1. 读取 data.js 文件
const jsFilePath = path.join(__dirname, 'data.js');
let jsContent = fs.readFileSync(jsFilePath, 'utf-8');

// 2. 简单处理：去掉开头的 "var elementsData ="，以及末尾分号。如果有需要可以做更复杂处理
jsContent = jsContent.replace(/var elementsData\s*=\s*/, '');  // 去掉前缀
jsContent = jsContent.trim();
if (jsContent.endsWith(';')) {
  jsContent = jsContent.slice(0, -1);
}

// 3. 将单引号替换成双引号（非常粗糙的做法，若数据中包含单引号字符串则需要更智能的替换）
jsContent = jsContent.replace(/'/g, '"');

// 4. 把注释行去掉（本示例简单粗暴，用正则匹配 // 开头的行；如果有多行注释还需更高级处理）
jsContent = jsContent.replace(/\/\/.*$/gm, '');

// 5. 现在尝试 JSON.parse
let elementsData;
try {
  elementsData = JSON.parse(jsContent);
} catch (error) {
  console.error('JSON.parse 失败，请检查 data.js 内容是否能转换为 JSON：', error);
  process.exit(1);
}

// 6. 遍历 elementsData，将节点与边分别收集
const nodes = [];
const edges = [];

elementsData.forEach((item) => {
  const data = item.data;
  // 根据结构判断：如果有 "gender" 字段，则是节点；如果有 "source"、"target"、"relationship" 则是边
  if (data.gender !== undefined) {
    // 是节点
    nodes.push({
      id: data.id,
      gender: data.gender,
    });
  } else if (data.source !== undefined && data.target !== undefined && data.relationship !== undefined) {
    // 是边
    edges.push({
      id: data.id,
      source: data.source,
      target: data.target,
      relationship: data.relationship,
    });
  }
});

// 7. 用 exceljs 输出到 Excel
(async () => {
  const workbook = new ExcelJS.Workbook();

  // Nodes 工作表
  const nodeSheet = workbook.addWorksheet('Nodes');
  nodeSheet.columns = [
    { header: 'id', key: 'id', width: 30 },
    { header: 'gender', key: 'gender', width: 10 }
  ];
  // 写入节点行
  nodeSheet.addRows(nodes.map(n => [n.id, n.gender]));

  // Edges 工作表
  const edgeSheet = workbook.addWorksheet('Edges');
  edgeSheet.columns = [
    { header: 'id', key: 'id', width: 10 },
    { header: 'source', key: 'source', width: 30 },
    { header: 'target', key: 'target', width: 30 },
    { header: 'relationship', key: 'relationship', width: 20 }
  ];
  // 写入边行
  edgeSheet.addRows(edges.map(e => [e.id, e.source, e.target, e.relationship]));

  // 8. 保存
  await workbook.xlsx.writeFile('output.xlsx');
  console.log('已成功导出到 output.xlsx');
})();
