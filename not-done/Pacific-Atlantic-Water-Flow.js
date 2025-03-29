// Pacific Atlantic Water Flow
// You are given a rectangular island heights where heights[r][c] represents the height above sea level of the cell at coordinate (r, c).

// The islands borders the Pacific Ocean from the top and left sides, and borders the Atlantic Ocean from the bottom and right sides.

// Water can flow in four directions (up, down, left, or right) from a cell to a neighboring cell with height equal or lower. Water can also flow into the ocean from cells adjacent to the ocean.

// Find all cells where water can flow from that cell to both the Pacific and Atlantic oceans. Return it as a 2D list where each element is a list [r, c] representing the row and column of the cell. You may return the answer in any order.

// Example 1:



// Input: heights = [
//   [4,2,7,3,4],
//   [7,4,6,4,7],
//   [6,3,5,3,6]
// ]

// Output: [[0,2],[0,4],[1,0],[1,1],[1,2],[1,3],[1,4],[2,0]]
// Example 2:

// Input: heights = [[1],[1]]

// Output: [[0,0],[0,1]]
// Constraints:

// 1 <= heights.length, heights[r].length <= 100
// 0 <= heights[r][c] <= 1000

var pacificAtlantic = function(M) {
    if (!M.length) return M;  // 处理空输入
    let y = M.length,  // 行数
        x = M[0].length,  // 列数
        ans = [],  // 结果数组
        dp = new Uint8Array(x * y);  // 一维数组标记访问情况

    // DFS 递归函数
    const dfs = (i, j, w, h) => {
        let ij = i * x + j;  // 将 (i, j) 映射到一维数组索引
        if ((dp[ij] & w) || M[i][j] < h) return;  // 如果已访问或高度不符合，返回
        dp[ij] += w;  // 记录该点可以流向的海洋（1=太平洋，2=大西洋）
        h = M[i][j];  // 更新当前高度
        if (dp[ij] === 3) ans.push([i, j]);  // 如果该点能流向两个大洋，加入结果集

        // 递归搜索四个方向
        if (i + 1 < y) dfs(i + 1, j, w, h);  // 向下
        if (i > 0) dfs(i - 1, j, w, h);  // 向上
        if (j + 1 < x) dfs(i, j + 1, w, h);  // 向右
        if (j > 0) dfs(i, j - 1, w, h);  // 向左
    };

    // **从太平洋的边界开始 DFS**
    for (let i = 0; i < y; i++) {
        dfs(i, 0, 1, M[i][0]);  // 左边界
        dfs(i, x - 1, 2, M[i][x - 1]);  // 右边界
    }

    // **从大西洋的边界开始 DFS**
    for (let j = 0; j < x; j++) {
        dfs(0, j, 1, M[0][j]);  // 上边界
        dfs(y - 1, j, 2, M[y - 1][j]);  // 下边界
    }

    return ans;  // 返回能流向两个大洋的点
};
