# Part 1 – 计算最终余额

# 给定初始账户余额（每个参与方的初始金额）和一系列交易。

# 每笔交易是 [from, to, amount]，表示 from 向 to 转账 amount。

# 需要更新所有参与方的余额，并返回 按名字字母序排序后的余额列表。

# Python 解法（Part 1）

# 思路：

# 用字典存储初始余额。

# 遍历交易，更新 from 和 to 的余额。

# 按参与方名字排序，返回余额列表。


from collections import defaultdict

def end_of_day_balance(transactions, initialBalance):
    # 初始化余额字典
    bal = defaultdict(int)
    for name, amt in initialBalance:
        bal[name] = int(amt)
    
    # 执行交易
    for src, dst, amt in transactions:
        amt = int(amt)
        bal[src] -= amt
        bal[dst] += amt
    
    # 返回按名字排序的余额
    return [bal[name] for name in sorted(bal.keys())]


# 示例测试
transactions = [["Alice","Bob","50"],["Bob","Charlie","30"],
                ["Charlie","Alice","20"],["Alice","David","70"]]
initialBalance = [["Alice","100"],["Bob","50"],["Charlie","75"],["David","25"]]

print(end_of_day_balance(transactions, initialBalance))  # [0, 70, 85, 95]


# 时间复杂度：

# 构建字典 O(N)，N 是初始账户数。

# 处理交易 O(T)，T 是交易数。

# 最后排序 O(N log N)。
# 总体复杂度：O(N log N + T)。

# 空间复杂度：

# 一个余额字典 O(N)。


# Part 2 – 最少交易结清债务（Follow-up）

# 根据交易后的净余额，有的人是负数（欠钱），有人是正数（有钱要收）。

# 要用最少的交易次数让所有人的余额回到 0。

# 保证总和为 0，一定有解。

# 这是一个 最小化交易数的债务结算问题，和 LeetCode 465（Optimal Account Balancing）类似。

# 将每个人的净额抽成一个数组 debts：正数=应收，负数=应付，0 过滤掉。

# 用 DFS 从左到右依次把第一个非 0 的人 i 与后面符号相反的人 j 结算一笔，递归求最少交易数。

# 剪枝：

# 若某次配对后 j 恰好归零，直接 break（最优形态，不必再试其他 j）。

# 用 seen 集合避免在同一层对相同金额重复尝试（去重）。

def min_transactions(balanceToSet):
    # 聚合每个人净额（字符串金额转 int）
    bal = {}
    for name, amt in balanceToSet:
        bal[name] = bal.get(name, 0) + int(amt)

    # 只保留非零净额
    debts = [v for v in bal.values() if v != 0]

    def dfs(i):
        # 跳过已清零的位置
        while i < len(debts) and debts[i] == 0:
            i += 1
        if i == len(debts):
            return 0

        ans = float('inf')
        seen = set()
        for j in range(i + 1, len(debts)):
            # 只和符号相反的人结算；同层相同金额不重复试
            if debts[i] * debts[j] < 0 and debts[j] not in seen:
                seen.add(debts[j])
                original = debts[j]
                debts[j] += debts[i]   # 让 j 吸收 i 的净额（等价于 i 与 j 交易一笔）
                ans = min(ans, 1 + dfs(i + 1))
                debts[j] = original

                # 完美抵消，进一步尝试没有更优意义，直接剪枝
                if original + debts[i] == 0:
                    break
        return 0 if ans == float('inf') else ans

    return dfs(0)


print(min_transactions([["Alice","-100"],["Bob","70"],["Charlie","65"],["David","-35"]]))  # 3
print(min_transactions([["Alice","-100"],["Bob","200"],["Charlie","-50"],["David","150"],["Eve","-150"],["Frank","100"],["George","50"],["Hank","-100"],["Ivy","0"],["Jack","-100"]]))  # 5
print(min_transactions([["Alice","-250"],["Bob","50"],["Charlie","-50"],["David","100"],["Eve","150"]]))  # 3



# 复杂度分析（简单版）

# 时间复杂度：
# 令 M = 参与结算的人数（净额不为 0 的人数）。
# 在最坏情况下，算法需要尝试多种配对方式，复杂度接近 O(M!)（阶乘级）。
# 但由于我们用了 剪枝（比如遇到完全抵消就直接停止，避免重复金额尝试），所以实际运行会比最坏情况快很多。

# 空间复杂度：
# 主要用到一个长度为 M 的数组来保存每个人的净额，递归调用深度最多也是 M，所以是 O(M)。