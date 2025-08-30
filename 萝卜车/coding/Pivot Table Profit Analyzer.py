
# 第一问

# 中文：给你一张表，要求计算整张表的 sell_price 总和。
# English: Given a table, calculate the total sum of the sell_price column.

# 第二问

# 中文：指定一个列名，比如 state 或 product，要求按照这个列分组，统计每组的 sell_price 总和，生成一个 pivot table。
# English: Given a column name, like state or product, group by that column and compute the total sell_price for each group, essentially building a pivot table.

# 第三问

# 中文：再给一个起始日期 startDate，只考虑 date >= startDate 的订单。计算每条订单的利润（sell_price - cost），然后按指定列分组，找出利润最大的分组。如果有并列，返回字典序最小的。
# English: Given a start date, only consider rows where date >= startDate. For each row compute profit (sell_price - cost), 
# group by the given column, and return the group with the highest total profit. If there’s a tie, return the lexicographically smallest one.


# 版本一（Q1）：返回总销售额 sum(sell_price)

# 输入：二维数组 data: List[List[str]]（第一行是 header）

# 输出：整型总销售额


from typing import List

# V1: 仅计算整表 sell_price 总和
def solution1(data: List[List[str]]) -> int:
    """
    data: 第一行 header，后面每行是订单记录，所有值都是字符串
    要求：列位置不固定，不能 hardcode 列索引
    返回：整表 sell_price 的总和（int）
    时间复杂度 O(N)，空间复杂度 O(1)
    """
    assert data and len(data) >= 1
    header = data[0]
    rows = data[1:]

    # 动态定位列索引
    try:
        idx_sell = header.index("sell_price")
    except ValueError:
        return 0  # 没有 sell_price 列，视为 0

    total = 0
    for r in rows:
        # 所有值是字符串，示例为整数，这里用 int
        total += int(r[idx_sell])
    return total


# 版本二（Q2）：按指定列做 pivot，汇总 sum(sell_price)

# 在 V1 基础上，修改函数签名，新增参数 pivotColumn: str

# 输出：Dict[str, int]，key 是该列的取值，value 是该组的销售额总和
# （实际面试可能让你输出成二维表/字符串，这里返回 dict，易测）

from typing import List, Dict
from collections import defaultdict

# V2: 按 pivotColumn 分组统计 sell_price 总和
def solution2(data: List[List[str]], pivotColumn: str) -> Dict[str, int]:
    """
    返回：{pivot_value: sum_sell_price}
    若不存在 pivotColumn 或 sell_price 列，返回空 dict
    时间复杂度 O(N)，空间复杂度 O(K) （K 为分组数）
    """
    assert data and len(data) >= 1
    header = data[0]
    rows = data[1:]

    # 定位列索引
    try:
        idx_sell = header.index("sell_price")
        idx_pivot = header.index(pivotColumn)
    except ValueError:
        return {}

    acc = defaultdict(int)
    for r in rows:
        key = r[idx_pivot]
        acc[key] += int(r[idx_sell])
    return dict(acc)


# 版本三（Q3）：过滤日期、计算利润、找最大项（tie 用字典序）

# 在 V2 基础上，再次修改函数签名，新增参数 startDate: str

# 只统计 date >= startDate 的记录

# 利润 profit = sell_price - cost

# 返回：最赚钱的 pivotColumn 值；若无匹配返回空串 ""
# （tie：利润并列取字典序最小的 key）

from typing import List
from collections import defaultdict

# V3: 过滤日期 >= startDate，按 pivotColumn 汇总利润，返回利润最大的组（tie 取字典序最小）
def solution3(data: List[List[str]], pivotColumn: str, startDate: str) -> str:
    """
    只考虑 date >= startDate：
    - 利润 = sell_price - cost
    - 按 pivotColumn 分组累加利润
    - 返回: "The most {pivotColumn} is {value}"
      若无匹配或列不存在，返回 ""
    """
    assert data and len(data) >= 1
    header = data[0]
    rows = data[1:]

    # 必要列索引
    try:
        idx_date = header.index("date")
        idx_cost = header.index("cost")
        idx_sell = header.index("sell_price")
        idx_pivot = header.index(pivotColumn)
    except ValueError:
        return ""

    profit_by_key = defaultdict(int)
    for r in rows:
        if r[idx_date] >= startDate:  # YYYY-MM-DD 可用字符串比较
            profit_by_key[r[idx_pivot]] += int(r[idx_sell]) - int(r[idx_cost])

    if not profit_by_key:
        return ""

    # 选利润最大；并列取字典序最小
    best_key, _ = min(profit_by_key.items(), key=lambda kv: (-kv[1], kv[0]))
    return f"The most {pivotColumn} is {best_key}"



# 复杂度与答辩要点（面试口径）

# 三版时间复杂度均为 O(N)，空间为 O(1) 或 O(K)（K 为分组数）。

# 生产优化：

# 预解析 header→index（已做）。

# 大数据可做 分片预聚合 与 并行归并，或直接用 SQL/Presto/Hive。

# 只需 Top-1 时可用堆/单遍保留当前最优，避免全量排序（这里已单遍）。

# 若 startDate 经常变化，可按日期分桶/索引，减少扫描范围。


# 第一问：总销售额

# 时间复杂度：O(N) —— 遍历所有行累加。

# 空间复杂度：O(1) —— 只需要一个累加器。

# English: Time O(N), Space O(1). Just one pass with a single accumulator.

# 第二问：按列分组求和

# 时间复杂度：O(N) —— 遍历所有行，更新哈希表。

# 空间复杂度：O(K) —— K 是分组数，哈希表存每组的和。

# English: Time O(N), Space O(K), where K is the number of unique groups.

# 第三问：过滤日期 + 计算利润 + 找最大

# 时间复杂度：O(N) —— 遍历时计算利润并维护最优。

# 空间复杂度：O(K) —— K 是分组数，哈希表存每组利润。

# English: Time O(N), Space O(K), scanning rows and tracking profit per group.


data = [
    ["order_id", "cost", "sell_price", "product", "date", "state"],
    ["23", "12", "18", "cheese", "2023-12-04", "CA"],
    ["24", "5", "12", "melon", "2023-12-04", "OR"],
    ["25", "25", "31", "cheese", "2023-12-05", "OR"],
    ["26", "4", "12", "bread", "2023-12-05", "CA"],
    ["25", "10", "14", "cheese", "2023-12-06", "CA"],
    ["26", "5", "6", "bread", "2023-12-06", "OR"]
]

# solution1: 总销售额
print("solution1:", solution1(data))  # 18+12+31+12+14+6 = 93

# solution2: 按 state 分组
print("solution2 (state):", solution2(data, "state"))  # {'CA': 18+12+14=44, 'OR': 12+31+6=49}

# solution2: 按 product 分组
print("solution2 (product):", solution2(data, "product"))  # {'cheese': 18+31+14=63, 'melon': 12, 'bread': 12+6=18}

# solution3: 按 state，起始日期 2023-12-05
print("solution3 (state, 2023-12-05):", solution3(data, "state", "2023-12-05"))  # CA: (12-4)+(14-10)=12, OR: (31-25)+(6-5)=7，最大是CA

# solution3: 按 product，起始日期 2023-12-05
print("solution3 (product, 2023-12-05):", solution3(data, "product", "2023-12-05"))  # cheese: (31-25)+(14-10)=10, bread: (12-4)+(6-5)=9，最大是cheese

# solution3: 按 product，起始日期 2025-12-05（无数据）
print("solution3 (product, 2025-12-05):", solution3(data, "product", "2025-12-05"))  # ""

# solution3: 按 color，起始日期 2023-12-01（无此列）
print("solution3 (color, 2023-12-01):", solution3(data, "color", "2023-12-01"))