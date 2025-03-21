// Construct Binary Tree from Preorder and Inorder Traversal
// You are given two integer arrays preorder and inorder.

// preorder is the preorder traversal of a binary tree
// inorder is the inorder traversal of the same tree
// Both arrays are of the same size and consist of unique values.
// Rebuild the binary tree from the preorder and inorder traversals and return its root.

// Example 1:



// Input: preorder = [1,2,3,4], inorder = [2,1,3,4]

// Output: [1,2,3,null,null,null,4]
// Example 2:

// Input: preorder = [1], inorder = [1]

// Output: [1]
// Constraints:

// 1 <= inorder.length <= 1000.
// inorder.length == preorder.length
// -1000 <= preorder[i], inorder[i] <= 1000

function buildTree(preorder, inorder) {
    let pre_idx = 0;
    let indices = new Map();
    
    inorder.forEach((val, i) => indices.set(val, i));
    
    function dfs(l, r) {
        if (l > r) return null;
        let root_val = preorder[pre_idx++];
        let root = new TreeNode(root_val);
        let mid = indices.get(root_val);
        root.left = dfs(l, mid - 1);
        root.right = dfs(mid + 1, r);
        return root;
    }
    
    return dfs(0, inorder.length - 1);
}