/*
==============================
🌲 树（Tree）知识点 + 遍历模板
==============================

树是递归结构的典型代表，常用于：
- 遍历（DFS / BFS）
- 递归解题（路径、深度、结构比较等）
- 有序结构（BST）

基本概念：
- 二叉树：每个节点最多两个子节点（left/right）
- 二叉搜索树：左 < 根 < 右
- 树的遍历：前序、中序、后序、层序
*/

// ✅ TreeNode 结构（LeetCode 默认）
function TreeNode(val, left = null, right = null) {
  this.val = val;
  this.left = left;
  this.right = right;
}

/*
=======================
1️⃣ 前序遍历（Pre-order）
=======================
顺序：根 → 左 → 右
适用场景：构建树、序列化树
*/

function preorderTraversal(root) {
  const result = [];

  function dfs(node) {
    if (!node) return;

    result.push(node.val);     // 访问当前节点（根）
    dfs(node.left);            // 递归访问左子树
    dfs(node.right);           // 递归访问右子树
  }

  dfs(root);
  return result;
}


/*
=======================
2️⃣ 中序遍历（In-order）
=======================
顺序：左 → 根 → 右
适用场景：二叉搜索树 => 升序输出
*/

function inorderTraversal(root) {
  const result = [];

  function dfs(node) {
    if (!node) return;

    dfs(node.left);            // 先访问左子树
    result.push(node.val);     // 再访问当前节点
    dfs(node.right);           // 然后访问右子树
  }

  dfs(root);
  return result;
}


/*
========================
3️⃣ 后序遍历（Post-order）
========================
顺序：左 → 右 → 根
适用场景：删除节点、合并子问题结果
*/

function postorderTraversal(root) {
  const result = [];

  function dfs(node) {
    if (!node) return;

    dfs(node.left);            // 先访问左子树
    dfs(node.right);           // 再访问右子树
    result.push(node.val);     // 最后访问当前节点
  }

  dfs(root);
  return result;
}


/*
=========================
4️⃣ 层序遍历（Level-order）
=========================
使用 BFS，逐层从左到右访问
适用场景：最短路径、每层统计、层级输出
*/

function levelOrder(root) {
  if (!root) return [];

  const result = [];
  const queue = [root];  // 初始化队列，放入根节点

  while (queue.length > 0) {
    const levelSize = queue.length;
    const level = [];

    // 处理当前层的所有节点
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      level.push(node.val);

      // 加入下一层的节点
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    result.push(level);  // 当前层结果加入结果集
  }

  return result;
}


/*
=======================================
5️⃣ 中序遍历（迭代写法 / 用栈模拟递归过程）
=======================================
核心思路：用栈先遍历到最左节点，然后处理节点，最后走右子树
适用场景：模拟递归行为（如不允许用递归）
*/

function inorderTraversalIter(root) {
  const result = [];
  const stack = [];
  let current = root;

  while (current || stack.length > 0) {
    while (current) {
      stack.push(current);     // 一直压入左子树节点
      current = current.left;
    }

    current = stack.pop();     // 弹出最左节点
    result.push(current.val);  // 访问节点
    current = current.right;   // 转向右子树
  }

  return result;
}


/*
====================
📌 总结：DFS vs BFS
====================

✔ DFS：递归或栈，适合路径类问题（如路径总和、路径收集、构造树）
✔ BFS：队列，适合层级处理（如层序遍历、最短路径）

模板记忆：
- DFS：递归函数 + 前中后处理
- BFS：初始化队列，按层推进，通常带 levelSize
*/

/*
===========================
🌲 常见树的种类 + JS 实现模板
===========================
*/


// ✅ 1. 普通二叉树（Binary Tree）
// ------------------------------
// - 每个节点最多有 left / right 两个子节点
// - 没有任何顺序或结构要求
// - 用于通用 DFS / BFS / 递归场景

function TreeNode(val, left = null, right = null) {
  this.val = val;
  this.left = left;
  this.right = right;
}

// 创建一棵简单的二叉树
//      1
//     / \
//    2   3
const root = new TreeNode(1, new TreeNode(2), new TreeNode(3));



// ✅ 2. 二叉搜索树（BST）
// ------------------------------
// - 左子树 < 当前节点 < 右子树
// - 中序遍历是升序数组
// - 插入、查找、验证等题目频出

function insertIntoBST(root, val) {
  if (!root) return new TreeNode(val);
  if (val < root.val) root.left = insertIntoBST(root.left, val);
  else root.right = insertIntoBST(root.right, val);
  return root;
}

function isValidBST(root, min = -Infinity, max = Infinity) {
  if (!root) return true;
  if (root.val <= min || root.val >= max) return false;
  return (
    isValidBST(root.left, min, root.val) &&
    isValidBST(root.right, root.val, max)
  );
}



// ✅ 3. 平衡二叉树（Balanced BST）
// ------------------------------
// - 左右子树高度差 ≤ 1
// - 多用于判断“结构是否良好”

function isBalanced(root) {
  function dfs(node) {
    if (!node) return 0;
    const left = dfs(node.left);
    const right = dfs(node.right);
    if (left === -1 || right === -1 || Math.abs(left - right) > 1) return -1;
    return Math.max(left, right) + 1;
  }
  return dfs(root) !== -1;
}



// ✅ 4. 完全二叉树（Complete Binary Tree）
// ------------------------------
// - 除最后一层外全部满，最后一层靠左
// - 常用于构建堆结构，可用数组实现

// 数组模拟完全二叉树结构（小顶堆）
class MinHeap {
  constructor() {
    this.heap = [];
  }

  insert(val) {
    this.heap.push(val);
    this._heapifyUp();
  }

  _heapifyUp() {
    let i = this.heap.length - 1;
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this.heap[i] < this.heap[parent]) {
        [this.heap[i], this.heap[parent]] = [this.heap[parent], this.heap[i]];
        i = parent;
      } else break;
    }
  }
}



// ✅ 5. 满二叉树（Full Binary Tree）
// ------------------------------
// - 每个节点要么有两个子节点，要么为叶子节点
// - 节点数 = 2^h - 1
// - 多用于结构判断、完全构造题中出现

// 示例判断是否为满二叉树
function isFullBinaryTree(root) {
  if (!root) return true;
  if (!root.left && !root.right) return true;
  if (root.left && root.right)
    return isFullBinaryTree(root.left) && isFullBinaryTree(root.right);
  return false;
}



// ✅ 6. 完美二叉树（Perfect Binary Tree）
// ------------------------------
// - 所有层都满，每层节点数 = 2^level
// - 每个非叶节点都有两个子节点
// - 题目：LeetCode 116 填充每个节点的 next 指针

// 完美二叉树构造：高度 h 的节点数为 2^h - 1
// 示例构造略，可在构建过程中检测节点数是否满足公式



// ✅ 7. Trie（字典树 / 前缀树）
// ------------------------------
// - 多叉树结构（非二叉）
// - 每条边代表一个字符，用于字符串集合的高效查找

class TrieNode {
  constructor() {
    this.children = {};
    this.isEnd = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node.children[ch]) node.children[ch] = new TrieNode();
      node = node.children[ch];
    }
    node.isEnd = true;
  }

  search(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node.children[ch]) return false;
      node = node.children[ch];
    }
    return node.isEnd;
  }

  startsWith(prefix) {
    let node = this.root;
    for (const ch of prefix) {
      if (!node.children[ch]) return false;
      node = node.children[ch];
    }
    return true;
  }
}



// ✅ 8. N 叉树（N-ary Tree）
// ------------------------------
// - 每个节点可以有多个子节点（>2）
// - 常出现在递归 DFS 或递归构建场景

function NAryTreeNode(val, children = []) {
  this.val = val;
  this.children = children;
}

// DFS 遍历 N 叉树
function dfsNAry(node) {
  if (!node) return;
  console.log(node.val);
  for (const child of node.children) {
    dfsNAry(child);
  }
}



// ✅ 9. Segment Tree（线段树）
// ------------------------------
// - 区间树结构，每个节点代表一个区间信息
// - 支持快速更新 + 区间查询
// - 高级题目，如动态区间最值 / 和

// 简略示意（完整构建需递归建树 + 更新函数）
class SegmentTreeNode {
  constructor(start, end, sum = 0) {
    this.start = start;
    this.end = end;
    this.sum = sum;
    this.left = null;
    this.right = null;
  }
}



// ✅ 10. Fenwick Tree（树状数组）
// ------------------------------
// - 用数组模拟的树结构
// - 高效计算前缀和，可动态更新
// - 应用于统计类题如逆序对

class FenwickTree {
  constructor(n) {
    this.tree = new Array(n + 1).fill(0);
  }

  update(i, delta) {
    while (i < this.tree.length) {
      this.tree[i] += delta;
      i += i & -i;
    }
  }

  query(i) {
    let sum = 0;
    while (i > 0) {
      sum += this.tree[i];
      i -= i & -i;
    }
    return sum;
  }
}
