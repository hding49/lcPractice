/*
图（Graph）总结

图是一种重要的数据结构，由顶点（nodes/vertices）和边（edges）组成。
根据边的方向性，可分为：
- 有向图（Directed Graph）
- 无向图（Undirected Graph）

根据边的权重，可分为：
- 带权图（Weighted Graph）
- 无权图（Unweighted Graph）

---

1. 图的表示

常用两种方法：

1) 邻接矩阵（Adjacency Matrix）
- 使用二维数组表示顶点间连接关系
- matrix[i][j] = 1/权重 表示 i -> j 有边
- 优点：查询边是否存在 O(1)
- 缺点：空间复杂度 O(V^2)，不适合稀疏图

2) 邻接表（Adjacency List）
- 用数组或哈希表存储每个顶点的邻居列表
- 适合稀疏图，空间效率高

示例：邻接表表示无向图
*/

const graph = {
  0: [1, 2],
  1: [0, 3],
  2: [0],
  3: [1],
};

/*
---

2. 图的遍历

主要有两种遍历方式：

- 深度优先搜索（DFS）
- 广度优先搜索（BFS）

下面分别给出代码模板。
*/

// DFS（递归版）
function dfs(graph, node, visited = new Set()) {
  if (visited.has(node)) return;
  visited.add(node);

  // 访问节点逻辑
  console.log(node);

  for (const neighbor of graph[node] || []) {
    if (!visited.has(neighbor)) {
      dfs(graph, neighbor, visited);
    }
  }
}

// BFS（队列版）
function bfs(graph, start) {
  const visited = new Set();
  const queue = [start];
  visited.add(start);

  while (queue.length > 0) {
    const node = queue.shift();

    // 访问节点逻辑
    console.log(node);

    for (const neighbor of graph[node] || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
}

/*
---

3. 常见图算法模板示例

3.1 拓扑排序（Kahn算法，基于入度）

适用于有向无环图（DAG），输出一个节点线性排序，使得所有边从前驱指向后继。

*/
function topologicalSort(graph, numNodes) {
  const inDegree = new Array(numNodes).fill(0);
  for (const node in graph) {
    for (const neighbor of graph[node]) {
      inDegree[neighbor]++;
    }
  }

  const queue = [];
  for (let i = 0; i < numNodes; i++) {
    if (inDegree[i] === 0) queue.push(i);
  }

  const order = [];
  while (queue.length > 0) {
    const node = queue.shift();
    order.push(node);

    for (const neighbor of graph[node] || []) {
      inDegree[neighbor]--;
      if (inDegree[neighbor] === 0) queue.push(neighbor);
    }
  }

  // 如果排序节点数少于图节点数，说明有环
  if (order.length !== numNodes) return [];

  return order;
}

/*
---

4. 最短路径算法简单示例

4.1 无权图最短路径 - BFS（层序遍历）

从起点出发，计算每个点距离起点的最短边数。

*/
function shortestPathUnweighted(graph, start, end) {
  const visited = new Set();
  const queue = [[start, 0]]; // [节点，距离]
  visited.add(start);

  while (queue.length > 0) {
    const [node, dist] = queue.shift();
    if (node === end) return dist;

    for (const neighbor of graph[node] || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([neighbor, dist + 1]);
      }
    }
  }

  return -1; // 不可达
}

/*
---

5. 其他知识点

- 判断图中是否有环：  
  - DFS 标记递归栈检测环  
  - 拓扑排序节点数检测环  
- 连通分量：  
  - 使用 DFS 或 BFS 统计无向图的连通块数  
- 加权图算法：  
  - Dijkstra 最短路径算法（优先队列）  
  - Bellman-Ford 算法（可处理负权边）  
  - Floyd-Warshall 算法（任意两点最短路径）  
- 最小生成树：  
  - Kruskal 算法（并查集）  
  - Prim 算法（贪心）

---
*/
