// Unique Paths
// Solved 
// There is an m x n grid where you are allowed to move either down or to the right at any point in time.

// Given the two integers m and n, return the number of possible unique paths that can be taken from the top-left corner of the grid (grid[0][0]) to the bottom-right corner (grid[m - 1][n - 1]).

// You may assume the output will fit in a 32-bit integer.

// Example 1:



// Input: m = 3, n = 6

// Output: 21
// Example 2:

// Input: m = 3, n = 3

// Output: 6
// Constraints:

// 1 <= m, n <= 100


function uniquePaths(m, n) {
    let aboveRow = Array(n).fill(1); // 初始化第一行

    for (let row = 1; row < m; row++) { // 遍历每一行（从第二行开始）
        let currentRow = Array(n).fill(1); // 初始化当前行
        for (let col = 1; col < n; col++) { // 遍历当前行的列
            currentRow[col] = currentRow[col - 1] + aboveRow[col];
        }
        aboveRow = currentRow; // 更新上一行数据
    }

    return aboveRow[n - 1]; // 返回右下角的值
    }