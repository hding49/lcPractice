// Given a directed graph with n nodes labeled from 0 to n−1, where each edge represents an influence relationship between stocks and carries a multiplier value. Your task is to determine the maximum product of multipliers along any simple path (i.e., visiting each node at most once) from a given start node to a given end node.

// The graph is provided as a list of edges, where each edge is represented as [u, v, w], indicating a directed edge from node u to node v with a multiplier value w.

// Return the maximum product possible from the start node to the end node. If no such simple path exists from the start node to the end node, return -1.

// Constraints:

// Each multiplier w is an integer in the range of [1, 105].
// The start and end nodes are valid indices within the range [0, n - 1].
// The graph may contain cycles, but each edge can be used at most once when calculating the product of multipliers.
// Example 1:

// Input: n = 5, edges = [[0, 1, 2], [1, 2, 3], [2, 1, 4], [1, 3, 5], [2, 4, 6], [4, 3, 10]], start = 0, end = 3
// Output: 360
// Explanation: There are two valid simple paths from node 0 to node 3:

// Path 0 → 1 → 3 gives a product of 2 × 5 = 10.
// Path 0 → 1 → 2 → 4 → 3 gives a product of 2 × 3 × 6 × 10 = 360.
// The maximum product among these is 360.
// Example 2:

// Input: n = 4, edges = [[0, 1, 1], [1, 2, 2], [2, 1, 3], [1, 3, 4]], start = 0, end = 3
// Output: 4

// Example 3:

// Input: n = 6, edges = [[0, 1, 2], [1, 2, 3], [2, 0, 4], [3, 4, 5], [4, 5, 6]], start = 0, end = 3
// Output: -1

/**
 * 求从 start 到 end 的最大乘积简单路径
 * @param {number} n - 节点数量
 * @param {number[][]} edges - 边数组，每个元素 [u, v, w]，表示 u->v 权重 w
 * @param {number} start - 起点
 * @param {number} end - 终点
 * @return {number} 最大乘积，找不到路径返回 -1
 */
function maxProductPath(n, edges, start, end) {
  // 构建邻接表 graph[node] = [{to, weight}, ...]
  const graph = Array.from({ length: n }, () => []);
  for (const [u, v, w] of edges) {
    graph[u].push({ to: v, weight: w });
  }

  let maxProduct = -1;
  const visited = new Array(n).fill(false);

  /**
   * dfs 搜索路径，返回当前路径最大乘积
   * @param {number} node 当前节点
   * @param {number} product 当前路径乘积
   */
  function dfs(node, product) {
    if (node === end) {
      // 到达终点，更新最大乘积
      maxProduct = Math.max(maxProduct, product);
      return;
    }
    visited[node] = true;
    for (const { to, weight } of graph[node]) {
      if (!visited[to]) {
        dfs(to, product * weight);
      }
    }
    visited[node] = false;
  }

  dfs(start, 1);

  return maxProduct;
}

// 测试示例：
console.log(
  maxProductPath(
    5,
    [
      [0, 1, 2],
      [1, 2, 3],
      [2, 1, 4],
      [1, 3, 5],
      [2, 4, 6],
      [4, 3, 10],
    ],
    0,
    3
  )
); // 360
console.log(
  maxProductPath(
    4,
    [
      [0, 1, 1],
      [1, 2, 2],
      [2, 1, 3],
      [1, 3, 4],
    ],
    0,
    3
  )
); // 4
console.log(
  maxProductPath(
    6,
    [
      [0, 1, 2],
      [1, 2, 3],
      [2, 0, 4],
      [3, 4, 5],
      [4, 5, 6],
    ],
    0,
    3
  )
); // -1
