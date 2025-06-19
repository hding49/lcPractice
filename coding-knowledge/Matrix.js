/*
矩阵（Matrix）知识点总结

矩阵是一个二维数组（array of arrays），在算法题中常用于模拟网格地图、动态规划表、图结构等。

常见应用场景：
- 遍历与搜索：岛屿数量、最短路径、染色、扩散等
- 动态规划：路径数量、最大子矩阵、状态转移表
- 模拟操作：旋转图像、扫雷、填充、游戏规则

核心操作包括：
1. 初始化与构建
2. 遍历（四向/八向）
3. 边界处理
4. 常见模板（DFS、BFS、前缀和等）

*/

// === 1. 初始化一个 m x n 的矩阵 ===
const m = 3, n = 4;
const matrix = Array.from({ length: m }, () => new Array(n).fill(0));

console.log(matrix);
/*
输出：
[
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0]
]
*/


// === 2. 遍历矩阵（最常见模板）===
for (let i = 0; i < m; i++) {
  for (let j = 0; j < n; j++) {
    console.log(`matrix[${i}][${j}] = ${matrix[i][j]}`);
  }
}


// === 3. 四个方向（上、下、左、右）偏移量模板 ===
const directions = [
  [0, 1],   // 右
  [1, 0],   // 下
  [0, -1],  // 左
  [-1, 0],  // 上
];

// 遍历某个 cell 的四邻域（记得判断边界）
function visitNeighbors(i, j, matrix) {
  const m = matrix.length;
  const n = matrix[0].length;

  for (const [dx, dy] of directions) {
    const ni = i + dx;
    const nj = j + dy;

    if (ni >= 0 && ni < m && nj >= 0 && nj < n) {
      console.log(`neighbor of (${i}, ${j}): (${ni}, ${nj}) = ${matrix[ni][nj]}`);
    }
  }
}


// === 4. DFS 遍历矩阵（例如岛屿计数） ===
function dfs(matrix, i, j, visited) {
  const m = matrix.length;
  const n = matrix[0].length;

  // 边界或已访问或不是目标值，直接返回
  if (i < 0 || i >= m || j < 0 || j >= n || visited[i][j] || matrix[i][j] === 0) return;

  visited[i][j] = true;

  for (const [dx, dy] of directions) {
    dfs(matrix, i + dx, j + dy, visited);
  }
}

// 例子：计算“岛屿”的数量
function numIslands(grid) {
  const m = grid.length;
  const n = grid[0].length;
  const visited = Array.from({ length: m }, () => new Array(n).fill(false));
  let count = 0;

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (!visited[i][j] && grid[i][j] === '1') {
        dfs(grid, i, j, visited);
        count++;
      }
    }
  }
  return count;
}


// === 5. BFS 模板 ===
function bfs(matrix, i, j, visited) {
  const queue = [[i, j]];
  const m = matrix.length;
  const n = matrix[0].length;
  visited[i][j] = true;

  while (queue.length > 0) {
    const [x, y] = queue.shift();

    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;

      if (nx >= 0 && nx < m && ny >= 0 && ny < n &&
          !visited[nx][ny] && matrix[nx][ny] === 1) {
        visited[nx][ny] = true;
        queue.push([nx, ny]);
      }
    }
  }
}


/*
=== 6. 经典题型方向 ===

✔ 搜索类：
- Number of Islands
- Surrounded Regions
- Flood Fill
- Walls and Gates
- Pacific Atlantic Water Flow

✔ DP 类：
- Unique Paths
- Minimum Path Sum
- Maximal Square / Maximal Rectangle
- Cherry Pickup (3D DP)

✔ 模拟操作类：
- Rotate Image
- Game of Life
- Spiral Matrix

✔ 前缀和优化：
- Submatrix Sum
- 2D Range Query
*/


/*
=== 小技巧总结 ===

✅ directions 通用模板：上下左右移动偏移量  
✅ 判断边界： (i >= 0 && i < m && j >= 0 && j < n)  
✅ visited 数组防止重复访问  
✅ DFS 适合深入遍历；BFS 适合最短路径问题  
✅ 某些题可对原 matrix 进行修改替代 visited（节省空间）  
*/
