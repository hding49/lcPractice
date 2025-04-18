// 199. Binary Tree Right Side View
// Medium
// Topics
// Companies
// Given the root of a binary tree, imagine yourself standing on the right side of it, return the values of the nodes you can see ordered from top to bottom.

 

// Example 1:

// Input: root = [1,2,3,null,5,null,4]

// Output: [1,3,4]

// Explanation:



// Example 2:

// Input: root = [1,2,3,4,null,null,null,5]

// Output: [1,3,4,5]

// Explanation:



// Example 3:

// Input: root = [1,null,3]

// Output: [1,3]

// Example 4:

// Input: root = []

// Output: []

 

// Constraints:

// The number of nodes in the tree is in the range [0, 100].
// -100 <= Node.val <= 100

// Your solution here

var rightSideView = function(root) {
    if (!root) return [];

    const ans = [];
    const queue = [root];

    while (queue.length > 0) {
        const n = queue.length;
        for (let i = 0; i < n; i++) {
            const node = queue.shift();
            if (i === n - 1) ans.push(node.val);
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
    }

    return ans;
};