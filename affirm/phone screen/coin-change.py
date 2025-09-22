# 第一问（DFS 简单版，返回任意解）

# 第一问

# 给定硬币种类和一个总金额。

# 不要求返回最少硬币数量，只要返回 任意一种组合 就行。

# 举例：coins = [1, 2, 5, 10], amount = 100

# 返回 {1:100} 或 {10:10} 都算合法解。



def coin_change_any(coins, amount):
    res = {}

    def dfs(idx, remain, path):
        if remain == 0:
            res.update(path)
            return True
        if idx == len(coins):
            return False
        coin = coins[idx]
        # 尝试 0..remain//coin 个当前硬币
        for cnt in range(remain // coin + 1):
            new_path = path.copy()
            if cnt > 0:
                new_path[coin] = cnt
            if dfs(idx + 1, remain - coin * cnt, new_path):
                return True
        return False

    dfs(0, amount, {})
    return res

print(coin_change_any([1, 2, 5, 10], 100))  

# 第一问（DFS / 回溯）：时间复杂度最坏 O(k^amount)，空间复杂度 O(amount)。 k 指的是 硬币种类的数量（len(coins)）。

# 可能输出 {10: 10} 或 {1: 100}



# 第二问  第二问（贪心解法，直接算）

# 同样是给定硬币种类和总金额。

# 返回一个 map（字典），列出每个硬币的数量。

# 依然只需要返回 任意一种解。

# 题目保证一定有解（因为至少有 1 元硬币）。

# 最优思路：不需要 DFS / 回溯，直接用 贪心除法：

# 依次用最大面值的硬币去“整除”当前剩余金额；

# 计算出个数；

# 更新余数；

# 直到归零。


def coin_change_map(coins, amount):
    coins.sort(reverse=True)
    res = {}
    for c in coins:
        if amount >= c:
            cnt, amount = divmod(amount, c)
            res[c] = cnt
    return res

print(coin_change_map([1, 2, 5, 10], 100))  
# 输出 {10: 10}

# 第二问（贪心整除）：时间复杂度 O(k)，空间复杂度 O(k) k 指的是 硬币种类的数量（len(coins)）



# fewest number follow up - DP LeetCode 322 原题（fewest number of coins）
# coin_change_min_count：返回最少硬币“数量”（LeetCode 322 原题风格，没解返回 -1）

# coin_change_min_map：返回对应的“硬币使用 map”（没解返回 {}）

# 都用自底向上的 DP，并带路径重建拿到具体组合


def coin_change(coins, amount):
    dp = [amount + 1] * (amount + 1)
    dp[0] = 0

    for i in range(1, amount + 1):
        for c in coins:
            if c <= i:
                dp[i] = min(dp[i], dp[i - c] + 1)

    return dp[amount] if dp[amount] <= amount else -1

# 复杂度 O(amount * len(coins))，空间 O(amount)。