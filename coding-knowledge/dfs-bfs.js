/*
DFS（深度优先搜索）和 BFS（广度优先搜索）总结

两者都是图、树、网格等结构的遍历算法，区别在于遍历顺序和数据结构：

- DFS 使用栈（递归本质上是系统调用栈）实现，深入每个分支到底  
- BFS 使用队列实现，按层级（距离）逐层遍历

适用场景：

- DFS: 寻找路径、连通块、拓扑排序、回溯问题  
- BFS: 最短路径、层序遍历、逐层搜索问题  

*/

/* === DFS 模板（递归写法） === */
function dfs(graph, start, visited = new Set()) {
  if (visited.has(start)) return;
  visited.add(start);

  // 访问节点 start
  console.log(start);

  // 递归遍历邻居
  for (const neighbor of graph[start]) {
    if (!visited.has(neighbor)) {
      dfs(graph, neighbor, visited);
    }
  }
}

/*
说明：
- 传入图结构（邻接表），起点，和已访问集合
- 递归深入每个邻居节点，直到没有新节点可访问
- 适合树或图的深度遍历
*/


/* === BFS 模板（队列写法） === */
function bfs(graph, start) {
  const visited = new Set();
  const queue = [];

  visited.add(start);
  queue.push(start);

  while (queue.length > 0) {
    const node = queue.shift(); // 取出队首节点
    console.log(node);

    // 遍历邻居
    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
}

/*
说明：
- 使用队列先进先出特性，按层遍历节点
- 适合找最短路径、层序遍历
- 需要维护访问集合避免重复访问
*/


/* === 示例：图的邻接表 === */
const graph = {
  0: [1, 2],
  1: [0, 3, 4],
  2: [0, 5],
  3: [1],
  4: [1, 5],
  5: [2, 4]
};

// DFS 调用示例
dfs(graph, 0); // 输出节点访问顺序

// BFS 调用示例
bfs(graph, 0); // 输出节点访问顺序
