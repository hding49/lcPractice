
# 题目摘要（Summary）

# Part 1（建模与归并母公司）

# 给一张「母→子」公司关系表，例如：
# {"company_a": ["company_b", "company_c"], "company_d": ["company_a"]}

# 任意公司可能是另一家公司的子公司，形成多级链。

# 对每条贷款请求（[loan_id, user_id, merchant, amount]），先把 merchant 映射到其最顶层母公司（ultimate parent），然后将这条 loan 以该顶层母公司为归类键存起来（方便后续匹配）。

# Part 2（交易匹配到贷款）

# 给一批交易请求（一般可视为 [tx_id, user_id, merchant, amount]）。

# 对每笔交易，同样把 merchant 映射到顶层母公司，然后在已存的 loan 里，按规则寻找可匹配的 loan。

# 常见匹配规则（面试中可自行说明/与面试官确认）：

# user_id 相同；

# 顶层母公司相同；

# amount 相同（或允许一定容差，按题目约定）。

# 如有多条满足，通常取先入先出（FIFO）的一条，避免重复匹配。

from collections import defaultdict, deque
from typing import Dict, List, Tuple, Optional

def build_loans_index(
    parent_to_children: Dict[str, List[str]],
    loans: List[Tuple[str, str, str, int]],
):
    """
    Part 1:
    输入：
      - parent_to_children: 母公司 -> 子公司 列表映射
      - loans: 列表[(loan_id, user_id, merchant, amount)]
    输出：
      - context: dict，供 Part 2 使用，包含：
          context["child_to_parent"]: 子 -> 母 的映射（假设每个子最多一个母）
          context["loans"]: key=(user_id, ultimate_parent, amount) -> deque[loan_id]
    说明：
      - 这里把每笔 loan 归并到 顶层母公司 + user + amount 的桶中（FIFO）。
    """
    # 1) 构造 child -> parent
    child_to_parent: Dict[str, str] = {}
    for p, children in (parent_to_children or {}).items():
        for c in children:
            child_to_parent[c] = p  # 若题目存在多父公司需调整为 set

    # 2) 根查找（带简单缓存）
    root_cache: Dict[str, str] = {}
    def find_root(company: str) -> str:
        if company in root_cache:
            return root_cache[company]
        seen = set()
        cur = company
        path = []
        while True:
            path.append(cur)
            if cur in seen:  # 检测到环则保守返回起点
                root = company
                break
            seen.add(cur)
            parent = child_to_parent.get(cur)
            if not parent:
                root = cur
                break
            cur = parent
        for x in path:
            root_cache[x] = root
        return root

    # 3) 归档 loans
    loans_index: Dict[Tuple[str, str, int], deque] = defaultdict(deque)
    for loan_id, user_id, merchant, amount in loans:
        key = (user_id, find_root(merchant), amount)
        loans_index[key].append(loan_id)

    return {
        "child_to_parent": child_to_parent,
        "loans": loans_index,
    }


def match_transactions(
    context,
    txs: List[Tuple[str, str, str, int]],
) -> List[Tuple[str, Optional[str]]]:
    """
    Part 2:
    输入：
      - context: 来自 build_loans_index 的返回值
      - txs: 列表[(tx_id, user_id, merchant, amount)]
    输出：
      - 列表[(tx_id, matched_loan_id or None)]
    匹配规则（可按题意调整）：
      - user_id 相同
      - 顶层母公司相同
      - amount 相同
      - 命中后按 FIFO 弹出对应 loan_id（避免重复匹配）
    """
    child_to_parent: Dict[str, str] = context.get("child_to_parent", {})
    loans_index = context.get("loans")

    # 局部 root 缓存
    root_cache: Dict[str, str] = {}
    def find_root(company: str) -> str:
        if company in root_cache:
            return root_cache[company]
        seen = set()
        cur = company
        path = []
        while True:
            path.append(cur)
            if cur in seen:
                root = company
                break
            seen.add(cur)
            parent = child_to_parent.get(cur)
            if not parent:
                root = cur
                break
            cur = parent
        for x in path:
            root_cache[x] = root
        return root

    results: List[Tuple[str, Optional[str]]] = []
    for tx_id, user_id, merchant, amount in txs:
        key = (user_id, find_root(merchant), amount)
        dq = loans_index.get(key)
        if dq and dq:
            results.append((tx_id, dq.popleft()))
        else:
            results.append((tx_id, None))
    return results



hier = {"A": ["B", "C"], "D": ["A"]}
loans = [("L1","U1","B",100), ("L2","U1","C",100), ("L3","U2","A",200)]
ctx = build_loans_index(hier, loans)

txs = [("T1","U1","C",100), ("T2","U1","B",100), ("T3","U2","B",200)]
print(match_transactions(ctx, txs))
# -> [('T1','L1'), ('T2','L2'), ('T3','L3')]
