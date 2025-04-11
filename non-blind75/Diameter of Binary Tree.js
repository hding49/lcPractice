// Diameter of Binary Tree
// The diameter of a binary tree is defined as the length of the longest path between any two nodes within the tree. The path does not necessarily have to pass through the root.

// The length of a path between two nodes in a binary tree is the number of edges between the nodes.

// Given the root of a binary tree root, return the diameter of the tree.

// Example 1:



// Input: root = [1,null,2,3,4,5]

// Output: 3
// Explanation: 3 is the length of the path [1,2,3,5] or [5,3,2,4].

// Example 2:

// Input: root = [1,2,3]

// Output: 2
// Constraints:

// 1 <= number of nodes in the tree <= 100
// -100 <= Node.val <= 100

var diameterOfBinaryTree = function(root) {
    let diameter = 0
    let dfs = (root) =>{
        if(!root) return -1
        let left = dfs(root.left)
        let right = dfs(root.right)
        diameter = Math.max(diameter, 2+left+right)
        return 1 + Math.max(left, right)
    }
    dfs(root)
    return diameter
};