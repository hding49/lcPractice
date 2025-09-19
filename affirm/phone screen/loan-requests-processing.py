
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

def ingest_loan(parent_to_children, loan, loans_store):
    """
    Part 1:
    输入:
      parent_to_children: 母公司 -> 子公司 映射
      loan: (loan_id, user_id, merchant, amount)
      loans_store: 外部传入的存储字典，键是 (user_id, ultimate_parent, amount)，值是 deque
    输出:
      ultimate_parent: 该 loan 对应公司的顶层母公司
    """

    # 子 -> 母 映射
    child_to_parent = {}
    for p, children in parent_to_children.items():
        for c in children:
            child_to_parent[c] = p

    # 找顶层母公司
    def find_root(company):
        seen = set()
        cur = company
        while cur in child_to_parent and cur not in seen:
            seen.add(cur)
            cur = child_to_parent[cur]
        return cur

    loan_id, user_id, merchant, amount = loan
    ultimate_parent = find_root(merchant)

    # 存入 loans_store
    key = (user_id, ultimate_parent, amount)
    loans_store[key].append(loan_id)

    return ultimate_parent

parent_to_children = {
    "company_a": ["company_b", "company_c"],
    "company_d": ["company_a"]
}

loans_store = defaultdict(deque)

loan1 = ("L1", "U1", "company_b", 100)
print(ingest_loan(parent_to_children, loan1, loans_store))
# 输出: company_d

print(loans_store)
# 输出: {('U1', 'company_d', 100): deque(['L1'])}


from collections import deque

def match_transactions(parent_to_children, txs, loans_store):
    # 建 child -> parent
    child_to_parent = {}
    for p, children in (parent_to_children or {}).items():
        for c in children:
            child_to_parent[c] = p

    # 找顶层母公司
    def find_root(company):
        seen = set()
        cur = company
        while cur in child_to_parent and cur not in seen:
            seen.add(cur)
            cur = child_to_parent[cur]
        return cur

    results = []
    for tx_id, user_id, merchant, amount in txs:
        key = (user_id, find_root(merchant), amount)
        dq = loans_store.get(key)
        if isinstance(dq, deque) and dq:
            results.append((tx_id, dq.popleft()))
        else:
            results.append((tx_id, None))
    return results



# txs = [("T1","U1","company_c",100), ("T2","U1","company_b",100), ("T3","U2","company_b",200)]
# match_transactions(parent_to_children, txs, loans_store)
# -> [('T1','L1'), ('T2','L2'), ('T3','L3')]  # 若 Part 1 已存入对应 loans
