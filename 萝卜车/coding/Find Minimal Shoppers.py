# // (This question is a variation of the LeetCode question 1701. Average Waiting Time. If you haven't completed that question yet, it is recommended to solve it first.)

# // A shopper's logistics company is managing customer orders and needs to maintain efficient service by controlling the average wait time for order fulfillment.

# // You are given an unsorted array orders, where each orders[i] = [duration, arrivalTime]:

# // duration is the time required to complete the 
# // i
# // th
# // i 
# // th
# //   customer's order.
# // arrivalTime is the time at which the 
# // i
# // th
# // i 
# // th
# //   customer places their order.
# // There are multiple shoppers, and each shopper can only process one order at a time. When a new order arrives at arrivalTime, it is assigned to any available shopper who can begin the order immediately. If all shoppers are busy, the order waits until the next shopper becomes available. All orders must be fulfilled in the order they arrive.

# // Besides, a customer's waiting time is defined as the time between their arrivalTime and when their order is completed, and the average waiting time is defined as the sum of all customers' waiting times divided by the total number of orders.

# // Given a floating-point number k, return the minimum number of shoppers required so that the average waiting time for all customers does not exceed k. If it is impossible to achieve this criterion, return -1.

# // Constraints:

# // 1 ≤ orders.length ≤ 
# // 10
# // 4
# // 10 
# // 4
 
# // orders[i].length = 2
# // 1 ≤ duration, arrivalTime ≤ 
# // 10
# // 4
# // 10 
# // 4
 
# // 0 ≤ k ≤ 
# // 10
# // 4
# // 10 
# // 4
 
# // Example 1:

# // Input: orders = [[4, 1], [5, 2], [2, 3]], k = 5.0
# // Output: 2
# // Explanation:

# // With 1 shopper:

# // Order 1: arrives at 1, processing begins at 1, finishes at 5. Wait time = 5 - 1 = 4
# // Order 2: arrives at 2, but the shopper is occupied until 5, so processing starts at 5, finishes at 10. Wait time = 10 - 2 = 8
# // Order 3: arrives at 3, but the shopper is busy until 10, so processing starts at 10, finishes at 12. Wait time = 12 - 3 = 9
# // Average wait time = (4 + 8 + 9) / 3 = 7.0, which exceeds 5.0.
# // With 2 shoppers:

# // Order 1: arrives at 1, assigned to shopper 1, so processing starts at 1, ends at 5. Wait time = 5 - 1 = 4
# // Order 2: arrives at 2, and shopper 2 is available, so processing starts at 2, ends at 7. Wait time = 7 - 2 = 5
# // Order 3: arrives at 3, both shoppers are busy (shopper 1 until 5, shopper 2 until 7). The next available shopper is ready at 5, so processing starts at 5, ends at 7. Wait time = 7 - 3 = 4
# // Average wait time = (4 + 5 + 4) / 3 ≈ 4.33, which is less than 5.0.
# // Therefore, the minimum number of shoppers required is 2.

# // Example 2:

# // Input: orders = [[4, 1], [4, 2], [4, 3], [4, 4]], k = 4.3
# // Output: 3

# // Example 3:

# // Input: orders = [[10, 1], [10, 2], [10, 3], [1, 4]], k = 2.0
# // Output: -1

# follow up: 有这么多的客人 要尽量短的时间内 做完菜 至少需要多少厨师 用binary search follow up 用priority queue + binary search

# 第二问是如果在第一题基础上问如果有个目标时间，几个工人可以让你的平均等待时间达标。最快解法就是用到bs和heap，
# 建议假装思考，别看到题就写，解法很短，楼主半小时就写完了，奖励了自己半小时尬聊。

# 补问的问题与之前差不多，问某步骤或者某参数的意义是什么，某个步骤效率是什么，
# 总体效率是什么，是否能更快，存储效率是多少，为什么你选择用二分


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

from typing import List, Tuple
import heapq

def average_wait_time_single_shopper(orders: List[Tuple[int, int]]) -> float:
    """
    第一问：一个 shopper 的平均等待时间。
    输入 orders: [ [duration, arrival], ... ] 可能未按 arrival 排序。
    等待时间定义：完成时间 - 到达时间；平均等待：所有等待时间之和 / n
    """
    # 按到达时间排序
    orders = sorted(orders, key=lambda x: x[1])

    cur = 0              # 当前时间（机位空闲时刻）
    total_wait = 0       # 等待时间累加（完成-到达）

    for duration, arrival in orders:
        # 如果到达时机位空闲，立刻开始；否则等到 cur
        start = max(cur, arrival)
        finish = start + duration
        total_wait += finish - arrival
        cur = finish

    return total_wait / len(orders)


def minimal_shoppers(orders: List[Tuple[int, int]], k: float) -> int:
    """
    第二问：返回最少的 shoppers 数，使得平均等待时间 <= k；无解返回 -1。
    思路：二分搜 m（1..n），可行性检查用最小堆维护每个 shopper 的“下一次空闲时间”。
    关键优化：如果 k < 平均 duration，则必定无解（即使无限 shopper，等待=duration）。
    """
    n = len(orders)
    if n == 0:
        return -1

    # 剪枝：无限并行时，每单都 arrival 开始，等待时间=duration。
    sum_duration = sum(d for d, _ in orders)
    if k * n < sum_duration:  # 用整数比较避免浮点误差
        return -1

    # 到达时间排序
    orders = sorted(orders, key=lambda x: x[1])

    def can(m: int) -> bool:
        """
        给定 m 个 shoppers，是否能做到 平均等待 <= k
        用堆存每个 shopper 的下一次空闲时间；初始化为 0（都空闲）。
        处理每个订单：取最早空闲的 shopper 分配。
        """
        heap = [0] * m
        heapq.heapify(heap)
        total_wait = 0

        for duration, arrival in orders:
            free_time = heapq.heappop(heap)     # 最早空闲时刻
            start = max(arrival, free_time)     # 该单实际开始处理的时刻
            finish = start + duration
            total_wait += finish - arrival      # 等待（完成-到达）
            heapq.heappush(heap, finish)

            # 早停：一旦超过阈值就可以返回 False（避免不必要计算）
            if total_wait > k * n:
                return False

        return total_wait <= k * n

    # 二分搜索最小可行 m
    left, right, ans = 1, n, -1
    while left <= right:
        mid = (left + right) // 2
        if can(mid):
            ans = mid
            right = mid - 1
        else:
            left = mid + 1

    return ans


# -----------------
# 简单测试
# -----------------
if __name__ == "__main__":
    ex1 = [[4, 1], [5, 2], [2, 3]]
    ex2 = [[4, 1], [4, 2], [4, 3], [4, 4]]
    ex3 = [[10, 1], [10, 2], [10, 3], [1, 4]]

    # 第一问（单 shopper 平均等待时间）
    print(round(average_wait_time_single_shopper(ex1), 2))  # 7.00

    # 第二问（最小 shoppers）
    print(minimal_shoppers(ex1, 5.0))   # 2
    print(minimal_shoppers(ex2, 4.3))   # 3
    print(minimal_shoppers(ex3, 2.0))   # -1
    

# 计算单个 shopper 的平均等待时间（对应 1701 的变体，输入为 [duration, arrival] 且未排序）。

# 用 二分 + 小根堆（priority queue） 找到使平均等待时间不超过 k 的最少 shoppers 数量；含一个快速不可行剪枝。

# 复杂度（第二问主流程）

# 排序：O(n log n)

# 可行性检查 can(m)：遍历 n 个订单，每次堆操作 log m → O(n log m)

# 二分 log n 次 → 总体 O(n log n + n log n log n)，常见写法记作 O(n log n log n)
# 空间复杂度：O(m)（堆）+ O(1) 额外