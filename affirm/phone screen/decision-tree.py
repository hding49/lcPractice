# 题目小结

# 实现一个可增量生长的二叉决策树：

# 内部节点保存一个“信号名 + 常量”的条件（signal < constant 走左子树，否则走右子树）。

# 叶子节点保存返回值（如 'Y'/'N'）。

# 需要提供：add_split(leaf, signal_name, constant)、set_leaf_value(leaf, value)、evaluate(signals)。

# Follow-up：支持把树序列化到 JSON（或字典）并能反序列化恢复


class Node:
    def __init__(self, value=None, signal=None, const=None, left=None, right=None):
        self.value, self.signal, self.const = value, signal, const
        self.left, self.right = left, right
    def is_leaf(self): return self.signal is None


class DecisionTree:
    def __init__(self, default_value=None):
        self.root = Node(value=default_value)

    def add_split(self, leaf, signal, const):
        if not leaf.is_leaf(): raise ValueError("target must be a leaf")
        leaf.signal, leaf.const = signal, const
        leaf.left, leaf.right = Node(), Node()
        leaf.value = None
        return leaf.left, leaf.right

    def set_leaf_value(self, leaf, value):
        if not leaf.is_leaf(): raise ValueError("target must be a leaf")
        leaf.value = value

    def evaluate(self, signals):
        n = self.root
        while not n.is_leaf():
            v = signals.get(n.signal)
            if v is None: raise KeyError(f"missing signal: {n.signal}")
            n = n.left if v < n.const else n.right
        return n.value

    # Follow Up —— 序列化 / 反序列化（紧凑字段名）——
    def serialize(self):
        def dump(n):
            return {"v": n.value} if n.is_leaf() else {
                "s": n.signal, "c": n.const, "l": dump(n.left), "r": dump(n.right)
            }
        return dump(self.root)

    @staticmethod
    def deserialize(data):
        def load(d):
            if "v" in d: return Node(value=d["v"])
            return Node(signal=d["s"], const=d["c"], left=load(d["l"]), right=load(d["r"]))
        t = DecisionTree()
        t.root = load(data)
        return t

# 复杂度（批量评估时）

# 设树的节点数为 n，高度为 h（最坏可到 n，平衡时约 log n），批量输入条数为 m。

# 增量建树

# 每次 add_split 与 set_leaf_value 都是 O(1)；建完整棵树整体 O(n)。

# 额外空间 O(n)。

# 单次 evaluate

# 只沿根到叶的路径，时间 O(h)，空间 O(1)（迭代版）。

# 批量 m 次 evaluate

# 时间 O(m·h)，空间 O(1) 附加空间（不计输入）。

# 若树大且深，实际吞吐主要取决于 h；可通过尽量平衡划分或在训练阶段约束树深来降低 h。

# 序列化 / 反序列化

# 访问每个节点一次：时间 O(n)，输出/占用空间 O(n)。