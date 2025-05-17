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


var delNodes = function(root, to_delete) {
    let res = {};
    let to_delete_set = new Set(to_delete);
    res[root.val] = root;

    function recursion(parent, cur_node, isleft) {
        if (cur_node === null) return;

        recursion(cur_node, cur_node.left, true);
        recursion(cur_node, cur_node.right, false);

        if (to_delete_set.has(cur_node.val)) {
            delete res[cur_node.val];

            if (parent !== null) {
                if (isleft) {
                    parent.left = null;
                } else {
                    parent.right = null;
                }
            }

            if (cur_node.left !== null) {
                res[cur_node.left.val] = cur_node.left;
            }
            if (cur_node.right !== null) {
                res[cur_node.right.val] = cur_node.right;
            }
        }
    }

    recursion(null, root, false);

    return Object.values(res);
};