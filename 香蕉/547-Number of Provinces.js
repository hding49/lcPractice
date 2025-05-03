// 547. Number of Provinces
// Medium
// Topics
// Companies
// There are n cities. Some of them are connected, while some are not. If city a is connected directly with city b, and city b is connected directly with city c, then city a is connected indirectly with city c.

// A province is a group of directly or indirectly connected cities and no other cities outside of the group.

// You are given an n x n matrix isConnected where isConnected[i][j] = 1 if the ith city and the jth city are directly connected, and isConnected[i][j] = 0 otherwise.

// Return the total number of provinces.

 

// Example 1:


// Input: isConnected = [[1,1,0],[1,1,0],[0,0,1]]
// Output: 2
// Example 2:


// Input: isConnected = [[1,0,0],[0,1,0],[0,0,1]]
// Output: 3
 

// Constraints:

// 1 <= n <= 200
// n == isConnected.length
// n == isConnected[i].length
// isConnected[i][j] is 1 or 0.
// isConnected[i][i] == 1
// isConnected[i][j] == isConnected[j][i]

/**
 * @param {number[][]} isConnected
 * @return {number}
 */

function findCircleNum(isConnected) {
    const n = isConnected.length;
    const visited = new Array(n).fill(false);
    let provinces = 0;
  
    function dfs(city) {
      for (let neighbor = 0; neighbor < n; neighbor++) {
        if (isConnected[city][neighbor] === 1 && !visited[neighbor]) {
          visited[neighbor] = true;
          dfs(neighbor);
        }
      }
    }
  
    for (let city = 0; city < n; city++) {
      if (!visited[city]) {
        provinces++;
        visited[city] = true;
        dfs(city);
      }
    }
  
    return provinces;
  }



// 时间复杂度：O(n²)，因为我们最多遍历整个邻接矩阵。

// 空间复杂度：O(n)，用于 visited 数组和递归栈。
  
