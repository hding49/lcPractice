# 题目小结

# 实现一个可增量生长的二叉决策树：

# 内部节点保存一个“信号名 + 常量”的条件（signal < constant 走左子树，否则走右子树）。

# 叶子节点保存返回值（如 'Y'/'N'）。

# 需要提供：add_split(leaf, signal_name, constant)、set_leaf_value(leaf, value)、evaluate(signals)。

# Follow-up：支持把树序列化到 JSON（或字典）并能反序列化恢复


class Node:
    # 叶子：value 不为 None；内部节点：保存 signal/const/left/right
    def __init__(self, value=None, signal=None, const=None, left=None, right=None):
        self.value = value
        self.signal = signal
        self.const = const
        self.left = left
        self.right = right

    def is_leaf(self):
        return self.signal is None  # 没有分裂条件 => 叶子


class DecisionTree:
    def __init__(self, default_value=None):
        # 初始是一片叶子（可先设置默认返回值，也可后面再 set_leaf_value）
        self.root = Node(value=default_value)

    # —— 增量建树 API ——
    def add_split(self, leaf, signal_name, constant):
        """在给定叶子处添加分裂；返回(左叶子, 右叶子)句柄，便于后续继续生长。"""
        if not leaf.is_leaf():
            raise ValueError("add_split target must be a leaf")
        # 将当前叶子转为内部节点，并在其下创建两个新叶子
        leaf.signal = signal_name
        leaf.const = constant
        leaf.left = Node()   # 新叶子（尚未设置返回值）
        leaf.right = Node()  # 新叶子（尚未设置返回值）
        leaf.value = None    # 不再是叶子了
        return leaf.left, leaf.right

    def set_leaf_value(self, leaf, value):
        if not leaf.is_leaf():
            raise ValueError("set_leaf_value target must be a leaf")
        leaf.value = value

    def evaluate(self, signals):
        """signals: dict，如 {'X1': 2, 'X2': 1, 'X3': 11}"""
        cur = self.root
        while not cur.is_leaf():
            if cur.signal not in signals:
                raise KeyError(f"missing signal: {cur.signal}")
            v = signals[cur.signal]
            # 题意：v < const 走左，否则（>=）走右
            if v < cur.const:
                cur = cur.left
            else:
                cur = cur.right
        return cur.value

    # —— Follow-up：序列化 / 反序列化 ——
    def serialize(self):
        """转为纯 dict，可直接 json.dump 保存。"""
        def to_dict(node):
            if node.is_leaf():
                return {"leaf": True, "value": node.value}
            return {
                "leaf": False,
                "signal": node.signal,
                "const": node.const,
                "left": to_dict(node.left),
                "right": to_dict(node.right),
            }
        return to_dict(self.root)

    @staticmethod
    def deserialize(data):
        """从 dict 恢复为 DecisionTree（含 Node 结构），返回树对象。"""
        def from_dict(d):
            if d.get("leaf", False):
                return Node(value=d.get("value"))
            n = Node(
                signal=d["signal"],
                const=d["const"],
                left=from_dict(d["left"]),
                right=from_dict(d["right"])
            )
            return n
        tree = DecisionTree()
        tree.root = from_dict(data)
        return tree

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