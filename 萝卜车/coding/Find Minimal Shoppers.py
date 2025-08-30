# Find Minimal Shoppers 题目总结

# 这道题是 LeetCode 1701. Average Waiting Time 的进阶版。

# 背景

# 一家物流公司有多个 shoppers（相当于服务员/工人），需要处理客户订单。每个订单包含：

# duration：完成该订单所需的时间

# arrivalTime：订单到达的时间

# 规则

# 每个 shopper 一次只能处理一个订单。

# 订单必须按到达时间顺序处理。

# 如果某个订单到达时有 shopper 空闲，则立即开始处理；否则需要等待最早空闲的 shopper。

# 等待时间 = 订单完成时间 - 到达时间。

# 平均等待时间 = 所有订单的等待时间之和 ÷ 总订单数。

# 要求

# 给定一个阈值 k，求 最少需要多少个 shoppers，才能保证所有订单的平均等待时间不超过 k。

# 如果无法满足条件，返回 -1。

# 示例

# orders = [[4,1],[5,2],[2,3]], k=5 → 需要 2 个 shoppers

# orders = [[4,1],[4,2],[4,3],[4,4]], k=4.3 → 需要 3 个 shoppers

# orders = [[10,1],[10,2],[10,3],[1,4]], k=2 → 无解，返回 -1

# 面试考点

# 第一问：单个 shopper 的平均等待时间（类似 1701，重点是排序 + 模拟）。

# 第二问：最少 shoppers 数量

# 解法：二分搜索 + 小根堆（priority queue）

# 时间复杂度需要分析，并解释为什么要用二分和堆。

# 面试官可能还会追问复杂度、是否能优化、如果是 production code 如何实现。


# 第一问

# 场景：只有 1 个 shopper/厨师。

# 输入：orders[i] = [duration, arrivalTime]（可能未排序）。

# 要求：计算所有订单的 平均等待时间。

# 第二问

# 场景：有 多个 shoppers 可以并行工作。

# 输入：同样的 orders，以及一个阈值 k。

# 要求：找到 最少需要多少个 shoppers，才能让 平均等待时间 ≤ k；
# 如果无论多少人都达不到，返回 -1。


# 第一次提交（第一问：单个 shopper 的平均等待时间）

from typing import List

def solve1(orders: List[List[int]], k: float = None) -> float:
    """
    第一问版本：
    - 只有一个 shopper
    - 输入 orders 可能未按 arrival 排序
    - 返回所有订单的平均等待时间
    参数 k 在第一问忽略（为了后续同签名扩展）
    """
    # 1) 按到达时间排序
    orders.sort(key=lambda x: x[0])  # x = [arrival, duration]

    cur = 0          # 当前时间（厨师/worker 下一次可开始的时刻）
    total_wait = 0   # 等待时间之和 = sum(finish - arrival)

    for arrival, duration in orders:
        start = max(cur, arrival)
        finish = start + duration
        total_wait += (finish - arrival)
        cur = finish

    return total_wait / len(orders)


# 修改同一个函数（第二问：最少 shoppers 使平均等待 ≤ k）

# 在面试 follow-up 时，直接把上面的 solve 改成下面这个版本（签名不变）。
# 约定：

# 若 k is None → 仍计算单个 shopper的平均等待时间（保持第一问功能）。

# 若 k 给定 → 计算最少 shoppers；无解返回 -1。
    
from typing import List
import heapq

def solve2(orders: List[List[int]], k: float = None):
    """
    混合题解（同一个函数应对两问）：
    - 若 k is None：求单个 shopper 的平均等待时间（第一问）
    - 若 k 给定：返回使平均等待时间 <= k 的最少 shoppers 数（第二问），无解返回 -1
    """

    # # 统一先按 arrival 排序（两问都需要）
    # # 注意：题目给的 orders[i] = [duration, arrivalTime]
    # orders.sort(key=lambda x: x[1])

    n = len(orders)

    # # ---------- 第一问：单个 shopper 平均等待 ----------
    # if k is None:
    #     cur = 0
    #     total_wait = 0
    #     for arrival, duration in orders:
    #         start = max(cur, arrival)
    #         finish = start + duration
    #         total_wait += (finish - arrival)
    #         cur = finish
    #     return total_wait / n

    # ---------- 第二问：最少 shoppers 使平均等待 <= k ----------

    # 剪枝：即使有无限个 shoppers，等待时间 = duration（到达即开做）
    # 若 avg_duration > k，则一定无解
    sum_duration = sum(d for _, d in orders)
    if sum_duration > k * n:
        return -1

    # 可行性检查：给定 m 个 shoppers，是否能使平均等待 <= k
    def can(m):
        # 堆中存储每个 shopper 的“下一次空闲时间”，初始全 0（都空闲）
        heap = [0] * m
        heapq.heapify(heap)

        total_wait = 0
        threshold = k * n  # 用乘法避免反复除法与浮点误差

        for arrival, duration in orders:
            free_time = heapq.heappop(heap)   # 最早空闲的时刻
            start = max(arrival, free_time)
            finish = start + duration
            total_wait += (finish - arrival)
            heapq.heappush(heap, finish)

            # 早停：一旦超过阈值，直接失败
            if total_wait > threshold:
                return False

        return total_wait <= threshold

    # 二分搜索最小 m（1..n）
    left, right, ans = 1, n, -1
    while left <= right:
        mid = (left + right) // 2
        # 如果可以（can(mid) 为 True）：说明当前人数可行，但可能还能更少，于是ans = mid 记录当前可行解 right = mid - 1 继续尝试更小的 shoppers 数
        if can(mid):
            ans = mid
            right = mid - 1
        else:
            left = mid + 1

    return ans


# 复杂度小抄（面试时可口述）

# 第一问（单个 shopper，算平均等待时间）
# 算法步骤

# 对订单按 arrivalTime 排序

# 遍历一遍订单，依次更新完成时间、等待时间

# 时间复杂度

# 排序：O(n log n)

# 遍历：O(n)

# 总体：O(n log n)

# 空间复杂度

# 排序可能需要额外空间 O(n)（取决于排序实现）

# 其余只用到几个变量

# 总体：O(1) ~ O(n)（通常记作 O(1) 额外空间）

# Python’s built-in sort() uses Timsort, whose space complexity is O(n) in the worst case and O(log n) on average due to recursion stack usage.
# Time complexity is O(n log n). Space complexity is O(1) extra space (or O(log n) if we account for the sorting implementation).



# 第二问（最少 shoppers，使平均等待 ≤ k）


# For the second question, we first sort the orders in O(n log n). 
# Then we use binary search on the number of shoppers, which takes O(log n) iterations. 
# Each feasibility check runs in O(n log m), where m is the number of shoppers, 
# because we process n orders and maintain a min-heap of size m. 
# In the worst case m can be n, so the total time complexity is O(n log² n). 
# The space complexity is O(m) for the heap, which is at most O(n) in the worst case.

# 算法步骤

# 排序订单 → O(n log n)

# 二分搜索 shoppers 数量：区间 [1, n] → O(log n) 次

# 每次可行性检查 can(m)：

# 遍历所有订单

# 每单一次堆操作（push + pop） → O(log m)

# 总共 O(n log m)

# 时间复杂度

# 单次 can(m) = O(n log m)

# 二分调用 O(log n) 次

# 总体：O(n log n + n log m log n)

# 因为最坏 m ≈ n，所以常写作 O(n log² n)


# 空间复杂度

# 堆最多存储 m 个 shoppers → O(m)

# 其余只用常量空间

# 总体：O(m)（最坏 = O(n)）




# 补问的问题：
# •	问某步骤或者某参数的意义是什么，
# •	某个步骤效率是什么，
# •	总体效率是什么，
# •	是否能更快，
# •	存储效率是多少，
# •	为什么你选择用二分
# •	为什么你选择用heap
# •	问时间&空间复杂度和优化
# •	并且如果是production code，如何改进



# Test for solve1
orders1 = [[1, 2], [2, 5], [4, 3]]
print("solve1:", solve1(orders1))  # 输出5

# Test for solve2
orders2 = [[1, 4], [2, 4], [3, 4], [4, 4]]
k = 4.3
print("solve2:", solve2(orders2, k))  # 输出3