// 1110. Delete Nodes And Return Forest
// Medium
// Topics
// Companies
// Given the root of a binary tree, each node in the tree has a distinct value.

// After deleting all nodes with a value in to_delete, we are left with a forest (a disjoint union of trees).

// Return the roots of the trees in the remaining forest. You may return the result in any order.

 

// Example 1:


// Input: root = [1,2,3,4,5,6,7], to_delete = [3,5]
// Output: [[1,2,null,4],[6],[7]]
// Example 2:

// Input: root = [1,2,4,null,3], to_delete = [3]
// Output: [[1,2,4]]
 

// Constraints:

// The number of nodes in the given tree is at most 1000.
// Each node has a distinct value between 1 and 1000.
// to_delete.length <= 1000
// to_delete contains distinct values between 1 and 1000.

// to_delete 是一个数组，表示要删除的节点值列表。我们用 Set 主要是为了：

// 快速判断某个节点值是否需要删除，即用 toDeleteSet.has(node.val) 判断，时间复杂度是 O(1)。

// 代码里会多次判断某个节点值是否在删除列表中，用 Set 效率远高于数组的 includes（后者是 O(n)）。


var delNodes = function(root, to_delete) {
    const toDeleteSet = new Set(to_delete);
    const res = [];

    function helper(node, isRoot) {
        if (!node) return null;

        const deleted = toDeleteSet.has(node.val);
        if (isRoot && !deleted) {
            res.push(node);
        }

        ///是用来更新当前节点的子树结构的 —— 确保被删除的子节点从树中断开，没被删除的子树结构被保留下来。
        node.left = helper(node.left, deleted);
        node.right = helper(node.right, deleted);

        return deleted ? null : node;
    }

    helper(root, true);
    return res;
};
