// Subtree of Another Tree
// Given the roots of two binary trees root and subRoot, return true if there is a subtree of root with the same structure and node values of subRoot and false otherwise.

// A subtree of a binary tree tree is a tree that consists of a node in tree and all of this node's descendants. The tree tree could also be considered as a subtree of itself.

// Example 1:



// Input: root = [1,2,3,4,5], subRoot = [2,4,5]

// Output: true
// Example 2:



// Input: root = [1,2,3,4,5,null,null,6], subRoot = [2,4,5]

// Output: false
// Constraints:

// 0 <= The number of nodes in both trees <= 100.
// -100 <= root.val, subRoot.val <= 100


// DFS Version:

const isSubtree = (root, subRoot) => {
  const areEqual = (node1, node2) => {
    if (!node1 || !node2) return !node1 && !node2;
    if (node1.val !== node2.val) return false;
    return areEqual(node1.left, node2.left) && areEqual(node1.right, node2.right);
  }
  const dfs = (node) => {
    if (!node) return false;
    if (areEqual(node, subRoot)) return true;
    return dfs(node.left) || dfs(node.right);
  }
  return dfs(root);
};


// BFS version:

// const isSubtree = (root, subRoot) => {
//   const areEqual = (tree, subTree) => {
//     const queue = [[tree, subTree]];
//     while (queue.length) {
//       const [node1, node2] = queue.pop();
//       if (!node1 && !node2) continue;
//       if (!node1 || !node2 || node1.val !== node2.val) return false;
//       queue.push([node1.right, node2.right], [node1.left, node2.left]);
//     }
//     return true;
//   }
//   const queue = [root];
//   while (queue.length) {
//     const node = queue.pop();
//     if (!node) continue;
//     if (areEqual(node, subRoot)) return true;
//     queue.push(node.right, node.left);
//   }
//   return false;
// };