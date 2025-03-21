// Serialize and Deserialize Binary Tree
// Implement an algorithm to serialize and deserialize a binary tree.

// Serialization is the process of converting an in-memory structure into a sequence of bits so that it can be stored or sent across a network to be reconstructed later in another computer environment.

// You just need to ensure that a binary tree can be serialized to a string and this string can be deserialized to the original tree structure. There is no additional restriction on how your serialization/deserialization algorithm should work.

// Note: The input/output format in the examples is the same as how NeetCode serializes a binary tree. You do not necessarily need to follow this format.

// Example 1:



// Input: root = [1,2,3,null,null,4,5]

// Output: [1,2,3,null,null,4,5]
// Example 2:

// Input: root = []

// Output: []
// Constraints:

// 0 <= The number of nodes in the tree <= 1000.
// -1000 <= Node.val <= 1000

    /**
     * Encodes a tree to a single string.
     *
     * @param {TreeNode} root
     * @return {string}
     */
    function serialize(root) {
        const res = [];

        var dfsSerialize = (node, res) => {
            if (node === null) {
                res.push('N');
                return;
            }
            res.push(node.val.toString());
            this.dfsSerialize(node.left, res);
            this.dfsSerialize(node.right, res);
        }

        this.dfsSerialize(root, res);
        return res.join(',');
    }

    /**
     * Decodes your encoded data to tree.
     *
     * @param {string} data
     * @return {TreeNode}
     */
    function deserialize(data) {
        const vals = data.split(',');
        const i = { val: 0 };

        var dfsDeserialize = (vals, i) => {
            if (vals[i.val] === 'N') {
                i.val++;
                return null;
            }
            const node = new TreeNode(parseInt(vals[i.val]));
            i.val++;
            node.left = this.dfsDeserialize(vals, i);
            node.right = this.dfsDeserialize(vals, i);
            return node;
        }
        
        return this.dfsDeserialize(vals, i);
    }

