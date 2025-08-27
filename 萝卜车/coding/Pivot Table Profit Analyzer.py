# A retail analytics platform stores order records in a data warehouse, with each record represented as a list of strings. The first row contains column headers, while all subsequent rows are order records with each value as a string. Every record includes at least these columns: order_id, cost, sell_price, product, and date (formatted as "YYYY-MM-DD"). Additional columns (e.g., state) may also be present.

# Your task is to simulate the creation of a pivot table that computes the net profit (sell_price minus cost) for each unique value in a specified column (pivotColumn), using only orders on or after a given start date (startDate). The pivotColumn can be "state", "product", or any other column.

# Implement the DataWarehouse class:

# DataWarehouse(List<List<String>> data) Initializes the data warehouse with the provided dataset. The first row is the header and the rest are data rows.

# String getMostProfitable(String pivotColumn, String startDate) Considers only records where date is on or after startDate. Finds the value in the pivot column with the highest total net profit.

# In case of a tie, returns the lexicographically smallest value.
# If no records match, returns "".
# Constraints:

# The table data contains at least one row (the header).
# Each row has the same length as the header.
# All values are non-null strings.
# Dates are in "YYYY-MM-DD" format.
# 1 ≤ data.size() ≤
# 10
# 5
# 10
# 5

# 1 ≤ data[0].size() ≤ 20
# Example:

# Input:
# ["DataWarehouse", "getMostProfitable", "getMostProfitable", "getMostProfitable"]

# [[["order_id", "cost", "sell_price", "product", "date", "state"], ["23", "12", "18", "cheese", "2023-12-04", "CA"], ["24", "5", "12", "melon", "2023-12-04", "OR"], ["25", "25", "31", "cheese", "2023-12-05", "OR"], ["26", "4", "12", "bread", "2023-12-05", "CA"], ["25", "10", "14", "cheese", "2023-12-06", "CA"], ["26", "5", "6", "bread", "2023-12-06", "OR"]], ["state", "2023-12-05"], ["product", "2023-12-05"], ["product", "2025-12-05"], ["color", "2023-12-01"]]

# Output:
# [null, "CA", "cheese", ""]

# Explanation:

# order_id	cost	sell_price	product	date	state
# 23	12	18	cheese	2023-12-04	CA
# 24	5	12	melon	2023-12-04	OR
# 25	25	31	cheese	2023-12-05	OR
# 26	4	12	bread	2023-12-05	CA
# 25	10	14	cheese	2023-12-06	CA
# 26	5	6	bread	2023-12-06	OR
# DataWarehouse warehouse = new DataWarehouse(data);
# warehouse.getMostProfitable("state", "2023-12-05"); // Returns "CA". For all records on or after "2023-12-05", the net profit for "CA" is (12 - 4) + (14 - 10) = 8 + 4 = 12, for "OR" is (31 - 25) + (6 - 5) = 6 + 1 = 7.
# warehouse.getMostProfitable("product", "2023-12-05"); // Returns "cheese". Net profit for "cheese" is 10, "bread" is 9, and "melon" is 0.
# warehouse.getMostProfitable("product", "2025-12-05"); // Returns "", as no dates qualify.
# warehouse.getMostProfitable("color", "2023-12-01"); // Returns "", as no column qualify.





from collections import defaultdict
from typing import List, Dict, Tuple

class DataWarehouse:
    """
    数据结构：
    - data: List[List[str]]，第一行是 header，其余是数据行（所有值都是字符串）
    - 列的位置不固定，必须通过列名定位，而不能写死索引
    约束：
    - 日期为 'YYYY-MM-DD'，因此可以直接用字符串比较（同格式下字典序 == 时间序）
    """

    def __init__(self, data: List[List[str]]):
        """
        初始化：
        - 保存原始数据
        - 解析并缓存 header -> index 的映射，避免每次查找 O(C) 的开销
        - 预取常用列的索引（如果存在）
        """
        assert data and len(data) >= 1, "Table must contain at least header row."

        self.header = data[0]
        self.rows = data[1:]  # 只包含数据行
        self.col_idx: Dict[str, int] = {name: i for i, name in enumerate(self.header)}

        # 预取常用列索引（题目保证存在）
        self.idx_cost = self.col_idx.get("cost")
        self.idx_sell = self.col_idx.get("sell_price")
        self.idx_date = self.col_idx.get("date")

    # ---------- 第一问：总销售额 ----------
    def total_sales(self) -> int:
        """
        计算整张表的 sell_price 总和（所有行）。
        时间复杂度：O(N)
        空间复杂度：O(1)
        """
        if self.idx_sell is None:
            # 没有 sell_price 列，视为 0
            return 0

        total = 0
        for r in self.rows:
            # 所有值是字符串，需转换为数字；示例为整数，这里用 int
            total += int(r[self.idx_sell])
        return total

    # ---------- 第二问：按某列分组聚合销售额 ----------
    def pivot_sum(self, pivot_column: str) -> Dict[str, int]:
        """
        对指定列（如 state/product/region 等）进行分组，
        统计每个分组的 sell_price 累加和。
        若该列不存在，返回空 dict。

        时间复杂度：O(N)
        空间复杂度：O(K)，K 为分组数
        """
        idx_pivot = self.col_idx.get(pivot_column)
        if idx_pivot is None or self.idx_sell is None:
            return {}

        acc = defaultdict(int)
        for r in self.rows:
            key = r[idx_pivot]
            acc[key] += int(r[self.idx_sell])
        return dict(acc)

    # ---------- 第三问：过滤日期 + 计算利润 + 取最优 ----------
    def getMostProfitable(self, pivotColumn: str, startDate: str) -> str:
        """
        只考虑 date >= startDate 的记录：
        - 对每一行计算 profit = sell_price - cost
        - 按 pivotColumn 分组累加 profit
        - 返回“总利润最大”的那个分组值；若并列，返回字典序最小者
        - 若没有匹配记录，或 pivotColumn 不存在，返回空字符串 ""

        时间复杂度：O(N)
        空间复杂度：O(K)
        """
        # 基础列检查：日期 / 成本 / 售价 必须存在
        if self.idx_date is None or self.idx_cost is None or self.idx_sell is None:
            return ""

        # 透视列存在性检查
        idx_pivot = self.col_idx.get(pivotColumn)
        if idx_pivot is None:
            return ""

        # 根据 startDate 过滤 + 计算并累加利润
        profit_by_key = defaultdict(int)
        for r in self.rows:
            # 题目给出 YYYY-MM-DD，直接字符串比较即可
            if r[self.idx_date] >= startDate:
                profit = int(r[self.idx_sell]) - int(r[self.idx_cost])
                key = r[idx_pivot]
                profit_by_key[key] += profit

        if not profit_by_key:
            return ""

        # 选出最大利润；并列则取 key 的字典序最小
        # max 的 key 使用 tuple：(-profit, key) 等价于先按利润降序，再按 key 升序
        # 也可以用 max(profit_by_key.items(), key=lambda kv: (kv[1], -ord)) 的变体
        best_key, _ = min(
            profit_by_key.items(),
            key=lambda kv: (-kv[1], kv[0])  # 利润大的优先（取负数），再按 key 升序
        )
        return best_key


# -----------------------
# 简单用例（对应题干的示例）
if __name__ == "__main__":
    data = [
        ["order_id", "cost", "sell_price", "product", "date", "state"],
        ["23", "12", "18", "cheese", "2023-12-04", "CA"],
        ["24", "5",  "12", "melon",  "2023-12-04", "OR"],
        ["25", "25", "31", "cheese", "2023-12-05", "OR"],
        ["26", "4",  "12", "bread",  "2023-12-05", "CA"],
        ["25", "10", "14", "cheese", "2023-12-06", "CA"],
        ["26", "5",  "6",  "bread",  "2023-12-06", "OR"],
    ]

    wh = DataWarehouse(data)

    # 第一问：总销售额
    print("total_sales =", wh.total_sales())  # 18+12+31+12+14+6 = 93

    # 第二问：按 state 聚合销售额
    print("pivot_sum(state) =", wh.pivot_sum("state"))  # {'CA': 18+12+14=44, 'OR': 12+31+6=49}

    # 第三问：最赚钱的 state（从 2023-12-05 起）
    print(wh.getMostProfitable("state", "2023-12-05"))    # CA
    print(wh.getMostProfitable("product", "2023-12-05"))  # cheese
    print(wh.getMostProfitable("product", "2025-12-05"))  # ""
    print(wh.getMostProfitable("color", "2023-12-01"))    # ""