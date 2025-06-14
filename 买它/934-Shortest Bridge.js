// 934. Shortest Bridge
// Medium
// Topics
// Companies
// You are given an n x n binary matrix grid where 1 represents land and 0 represents water.

// An island is a 4-directionally connected group of 1's not connected to any other 1's. There are exactly two islands in grid.

// You may change 0's to 1's to connect the two islands to form one island.

// Return the smallest number of 0's you must flip to connect the two islands.

 

// Example 1:

// Input: grid = [[0,1],[1,0]]
// Output: 1
// Example 2:

// Input: grid = [[0,1,0],[0,0,0],[0,0,1]]
// Output: 2
// Example 3:

// Input: grid = [[1,1,1,1,1],[1,0,0,0,1],[1,0,1,0,1],[1,0,0,0,1],[1,1,1,1,1]]
// Output: 1
 

// Constraints:

// n == grid.length == grid[i].length
// 2 <= n <= 100
// grid[i][j] is either 0 or 1.
// There are exactly two islands in grid.


var shortestBridge = function(grid) {
    const n = grid.length;
    const dirs = [[1,0], [-1,0], [0,1], [0,-1]];
    const visited = Array.from({ length: n }, () => Array(n).fill(false));
    const queue = [];

    let found = false;

    // Step 1: 找到第一个岛屿并用 DFS 标记，同时加入队列
    const dfs = (i, j) => {
        if (i < 0 || j < 0 || i >= n || j >= n || visited[i][j] || grid[i][j] === 0) return;
        visited[i][j] = true;
        queue.push([i, j]); // 加入BFS队列
        for (const [dx, dy] of dirs) {
            dfs(i + dx, j + dy);
        }
    };

    // 找第一个岛屿
    for (let i = 0; i < n; i++) {
        if (found) break;
        for (let j = 0; j < n; j++) {
            if (grid[i][j] === 1) {
                dfs(i, j);
                found = true;
                break;
            }
        }
    }

    // Step 2: BFS 从第一个岛屿扩展，直到遇到第二个岛屿
    let steps = 0;
    while (queue.length > 0) {
        let size = queue.length;
        while (size--) {
            const [x, y] = queue.shift();
            for (const [dx, dy] of dirs) {
                const nx = x + dx;
                const ny = y + dy;
                if (nx >= 0 && ny >= 0 && nx < n && ny < n && !visited[nx][ny]) {
                    if (grid[nx][ny] === 1) {
                        return steps; // 找到第二个岛屿所用的步数
                    }
                    queue.push([nx, ny]);
                    visited[nx][ny] = true;
                }
            }
        }
        steps++;
    }

    return -1; // 理论上不会到这一步
};
