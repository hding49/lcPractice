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


import heapq

class Solution:
    def getMinShoppers(self, orders, k: float) -> int:
        if not orders:
            return 0

        # quick check: average duration is lower bound of average waiting time
        total_duration = sum(dur for dur, _ in orders)
        if total_duration / len(orders) > k:
            return -1

        # sort by arrival time
        orders.sort(key=lambda x: x[1])

        lo, hi = 1, len(orders)
        while lo < hi:
            mid = (lo + hi) // 2
            avg = self._getAverageWaitTime(orders, mid)
            if avg <= k:
                hi = mid
            else:
                lo = mid + 1
        return lo

    def _getAverageWaitTime(self, orders, shoppers: int) -> float:
        pq = []  # min-heap of finish times
        total_wait = 0

        for duration, arrive in orders:
            # free shoppers that already finished before arrival
            while pq and pq[0] <= arrive:
                heapq.heappop(pq)

            if len(pq) == shoppers:
                # all busy, must wait
                start = heapq.heappop(pq)
            else:
                # shopper available
                start = arrive

            start = max(start, arrive)
            finish = start + duration
            heapq.heappush(pq, finish)

            total_wait += finish - arrive

        return total_wait / len(orders)


s = Solution()

print(s.getMinShoppers([[4,1],[5,2],[2,3]], 5.0))   # 2
print(s.getMinShoppers([[4,1],[4,2],[4,3],[4,4]], 4.3))  # 3
print(s.getMinShoppers([[10,1],[10,2],[10,3],[1,4]], 2.0))  # -1