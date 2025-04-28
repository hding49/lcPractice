// 1448. Count Good Nodes in Binary Tree
// Medium
// Topics
// Companies
// Hint
// Given a binary tree root, a node X in the tree is named good if in the path from root to X there are no nodes with a value greater than X.

// Return the number of good nodes in the binary tree.

 

// Example 1:



// Input: root = [3,1,4,3,null,1,5]
// Output: 4
// Explanation: Nodes in blue are good.
// Root Node (3) is always a good node.
// Node 4 -> (3,4) is the maximum value in the path starting from the root.
// Node 5 -> (3,4,5) is the maximum value in the path
// Node 3 -> (3,1,3) is the maximum value in the path.
// Example 2:



// Input: root = [3,3,null,4,2]
// Output: 3
// Explanation: Node 2 -> (3, 3, 2) is not good, because "3" is higher than it.
// Example 3:

// Input: root = [1]
// Output: 1
// Explanation: Root is considered as good.
 

// Constraints:

// The number of nodes in the binary tree is in the range [1, 10^5].
// Each node's value is between [-10^4, 10^4].


var goodNodes = function (root) {
    if (!root) return 0;

    let numGoodNodes = 0;
    const stack = [];
    stack.push([root, -Infinity]);  // 一开始假设路径上最大值是最小的（-Infinity）
    
    while (stack.length) {
        let [node, max] = stack.pop();   // 弹出当前节点和路径上的最大值
        const { left, right, val } = node;

        if (max <= val) {    // 如果当前节点比路径上的最大值还大，它就是好节点
            numGoodNodes += 1;
            max = val;       // 更新路径最大值
        }

        if (left) stack.push([left, max]);    // 继续压入左子树
        if (right) stack.push([right, max]);  // 继续压入右子树
    }

    return numGoodNodes;  // 返回好节点的数量
};
// 复杂度分析
// 时间复杂度：O(n)，其中 n 是树的节点数。我们遍历每个节点一次。
// 空间复杂度：O(h)，其中 h 是树的高度。我们使用栈来存储节点，最坏情况下栈的大小为树的高度。
// 由于树的高度 h ≤ n，因此空间复杂度为 O(n)。