# 题目要求（总结）

# 背景：有多方账户（客户、Affirm、商家、三方机构等）之间发生资金流转。
# Part 1：给定「起始余额字典」与「待入账交易列表」（每笔交易是 [from, to, amount]），计算交易全部执行后的账户期末余额。
# Part 2：给定一个「不平（有正有负）的期末余额字典」，用最少笔的转账，把所有账户的余额结清到 0，返回结清用到的转账列表以及结清后的余额字典。


# Part 1：期末余额（End of day balance）

# 要点：

# 遍历每笔 [u, v, amt]：u 扣、v 加。

# 允许字典中未出现的主体自动视为 0（更健壮）。

# 返回新字典，不修改输入（更安全）。


from collections import defaultdict

def get_end_of_day_balance(transactions, start_balances):
    bal = defaultdict(int, start_balances)  # 未出现主体默认为 0
    for u, v, amt in transactions:
        bal[u] -= amt
        bal[v] += amt
    return dict(bal)


# 复杂度：时间 O(T)，空间 O(P)（P 为出现过的主体数）。


# Part 2：用最少交易数结清到 0

# 经典“最小现金流”问题（Min Cash Flow）：
# 思路是把正余额当作债权人、负余额当作债务人，不断让最大债务人向最大债权人转钱，每次至少消掉一方，从而保证交易笔数最少（≤ 正/负非零账户数 - 1）。

# 实现细节：

# 过滤掉本来就是 0 的账户；

# 用最大堆分别维护债权人（正）和债务人（负的绝对值）；

# 每次弹出各自最大值，转 min(债务, 债权)，把剩余再压回堆；

# 最终生成的转账列表即为结清方案；余额全为 0。


import heapq

def settle_balances(balances):
    # 构建最大堆：Python 是最小堆，用负号实现最大堆
    cred = []  # ( -amount, account )  for amount>0
    debt = []  # ( -amount, account )  for amount>0 (表示欠款的绝对值)

    for acc, val in balances.items():
        if val > 0:
            heapq.heappush(cred, (-val, acc))
        elif val < 0:
            heapq.heappush(debt, (-(-val), acc))  # 等价于 push( val, acc ) 但用正绝对值再取负
            # 也可写：heapq.heappush(debt, (val, acc)) 然后取用时再转绝对值
            # 为统一，这里把两堆都存成 (-正值, acc)

    tx = []
    while cred and debt:
        c_amt, c_acc = heapq.heappop(cred)
        d_amt, d_acc = heapq.heappop(debt)
        c_amt = -c_amt  # 还原为正数
        d_amt = -d_amt

        pay = min(c_amt, d_amt)
        # d_acc -> c_acc 转 pay
        tx.append([d_acc, c_acc, pay])

        c_left = c_amt - pay
        d_left = d_amt - pay
        if c_left > 0:
            heapq.heappush(cred, (-c_left, c_acc))
        if d_left > 0:
            heapq.heappush(debt, (-d_left, d_acc))

    # 结清后的余额（若总和本就为 0，会全部清零；否则会有残余）
    settled = {k: 0 for k in balances}
    return tx, settled

# 复杂度：设正负非零账户数为 K，

# 时间 O(K log K)（每次堆操作 log K，一共 ≤ K−1 次转账）；

# 空间 O(K)。