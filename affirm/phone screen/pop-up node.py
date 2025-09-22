# 题意小结

# 给一棵 DOM 树，每个节点有 id、hidden 和 children。当打开一个 id == "POPUP" 的节点时，需要一次遍历把显示/隐藏状态调整为：

# 从 root 到 POPUP 的路径上，所有节点 hidden = False（路径都显示）。

# 该路径上每一层里，“在路径上的那个孩子显示，其余兄弟隐藏”。

# POPUP 自己显示，它的 所有兄弟 隐藏。

# 其他与这条路径无关的节点保持原状（不额外改动）。


class DomNode:
    def __init__(self, id, hidden=False, children=None):
        self.id = id
        self.hidden = hidden
        self.children = children or []

def open_popup(root):
    if not root:
        return root

    def dfs(node):
        if not node:
            return False

        if node.id == "POPUP":
            node.hidden = False
            return True

        has_popup = False
        child_has = {}
        for ch in node.children:
            child_has[ch] = dfs(ch)
            has_popup = has_popup or child_has[ch]

        if has_popup:
            # 此层：路径上的那个孩子显示，其余兄弟隐藏
            for ch in node.children:
                ch.hidden = not child_has[ch]
            # 路径节点本身显示
            node.hidden = False

        return has_popup

    found = dfs(root)
    if found:
        root.hidden = False
    return root

# 复杂度

# 时间复杂度：O(N)（每个节点至多访问一次）
# 空间复杂度：O(H)（递归栈高度，H 为树高）