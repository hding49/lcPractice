// 314. Binary Tree Vertical Order Traversal
// Medium
// Topics
// Companies
// Hint
// Given the root of a binary tree, return the vertical order traversal of its nodes' values. (i.e., from top to bottom, column by column).

// If two nodes are in the same row and column, the order should be from left to right.

 

// Example 1:


// Input: root = [3,9,20,null,null,15,7]
// Output: [[9],[3,15],[20],[7]]
// Example 2:


// Input: root = [3,9,8,4,0,1,7]
// Output: [[4],[9],[3,0,1],[8],[7]]
// Example 3:


// Input: root = [1,2,3,4,10,9,11,null,5,null,null,null,null,null,null,null,6]
// Output: [[4],[2,5],[1,10,9,6],[3],[11]]
 

// Constraints:

// The number of nodes in the tree is in the range [0, 100].
// -100 <= Node.val <= 100

// Your solution here
// JavaScript

var verticalOrder = function(root) {
    if (!root) return [];
    
    const columns = new Map();
    const queue = [[root, 0]];
    columns.set(0, [root.val]);
    
    while (queue.length) {
        const [node, col] = queue.shift();
        
        if (node.left) {
            queue.push([node.left, col - 1]);
            if (!columns.has(col - 1)) {
                columns.set(col - 1, []);
            }
            columns.get(col - 1).push(node.left.val);
        }
        
        if (node.right) {
            queue.push([node.right, col + 1]);
            if (!columns.has(col + 1)) {
                columns.set(col + 1, []);
            }
            columns.get(col + 1).push(node.right.val);
        }
    }
    
    return [...columns.entries()]
        .sort(([a], [b]) => a - b)
        .map(([_, vals]) => vals);
};