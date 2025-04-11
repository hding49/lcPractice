// Balanced Binary Tree
// Given a binary tree, return true if it is height-balanced and false otherwise.

// A height-balanced binary tree is defined as a binary tree in which the left and right subtrees of every node differ in height by no more than 1.

// Example 1:



// Input: root = [1,2,3,null,null,4]

// Output: true
// Example 2:



// Input: root = [1,2,3,null,null,4,null,5]

// Output: false
// Example 3:

// Input: root = []

// Output: true
// Constraints:

// The number of nodes in the tree is in the range [0, 1000].
// -1000 <= Node.val <= 1000

var isBalanced = function(root){
    
    var dfs = (node) =>{
        if(!node) return 0
        let left = 1 + dfs(node.left)
        let right = 1 + dfs(node.right)
        if(Math.abs(left - right) > 1) return Infinity
        return Math.max(left, right)
    }

    return dfs(root) == Infinity ? false: true
}