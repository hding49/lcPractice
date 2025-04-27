// 270. Closest Binary Search Tree Value
// Easy
// Topics
// Companies
// Given the root of a binary search tree and a target value, return the value in the BST that is closest to the target. If there are multiple answers, print the smallest.

 

// Example 1:


// Input: root = [4,2,5,1,3], target = 3.714286
// Output: 4
// Example 2:

// Input: root = [1], target = 4.428571
// Output: 1
 

// Constraints:

// The number of nodes in the tree is in the range [1, 104].
// 0 <= Node.val <= 109
// -109 <= target <= 109


function closestValue(root, target) {
    let res = root.val;

    while (root) {
        if (Math.abs(root.val - target) < Math.abs(res - target)) {
            res = root.val;
        } else if (Math.abs(root.val - target) === Math.abs(res - target)) {
            res = Math.min(res, root.val);
        }

        // 根据 target 和当前节点值的大小，决定往左还是右子树走
        root = target < root.val ? root.left : root.right;
    }

    return res;
}
