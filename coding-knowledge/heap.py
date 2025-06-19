"""
============================
🌟 堆（Heap）知识点总结
============================

1. 定义：
- 堆是一种完全二叉树，满足堆性质。
- 完全二叉树：除了最后一层外，其他层节点全部满，最后一层节点靠左排列。
- 堆性质：
  - 大顶堆（Max Heap）：每个节点 >= 其子节点
  - 小顶堆（Min Heap）：每个节点 <= 其子节点

2. 用途：
- 优先队列实现
- 查找最大/最小元素
- Top K 问题
- 堆排序（Heap Sort）

3. 实现：
- 通常用数组实现
- 父节点和子节点索引关系（0-based）：
  - parent = (i - 1) // 2
  - left_child = 2 * i + 1
  - right_child = 2 * i + 2

"""

# Python 内置模块 heapq 是一个小顶堆实现
import heapq


# =====================================
# 1. 使用 heapq 作为小顶堆的示例
# =====================================

nums = [5, 3, 8, 1, 2]

# 将列表原地转为堆结构（小顶堆）
heapq.heapify(nums)
print("Heapified list:", nums)  # 输出堆结构数组（不保证排序，但满足堆性质）

# 插入新元素
heapq.heappush(nums, 0)
print("After push 0:", nums)

# 弹出最小元素
min_val = heapq.heappop(nums)
print("Pop min:", min_val)
print("Heap after pop:", nums)

# 弹出并返回最小元素，然后插入新元素（更高效）
min_val = heapq.heapreplace(nums, 4)
print("Heap replace min with 4:", min_val, nums)

# 获取堆中最大的3个元素（内部实现使用最大堆思路）
top3 = heapq.nlargest(3, nums)
print("Top 3 largest:", top3)

# 获取堆中最小的3个元素
bottom3 = heapq.nsmallest(3, nums)
print("Top 3 smallest:", bottom3)


# =====================================
# 2. 手动实现小顶堆的核心操作
# =====================================

class MinHeap:
    def __init__(self):
        self.heap = []

    def parent(self, i):
        return (i - 1) // 2

    def left_child(self, i):
        return 2 * i + 1

    def right_child(self, i):
        return 2 * i + 2

    def push(self, val):
        self.heap.append(val)
        self._heapify_up(len(self.heap) - 1)

    def pop(self):
        if not self.heap:
            return None
        # 交换堆顶和最后一个元素，然后弹出最后一个
        self._swap(0, len(self.heap) - 1)
        min_val = self.heap.pop()
        self._heapify_down(0)
        return min_val

    def _heapify_up(self, index):
        # 从底向上调整堆，保持堆性质
        while index > 0:
            p = self.parent(index)
            if self.heap[p] > self.heap[index]:
                self._swap(p, index)
                index = p
            else:
                break

    def _heapify_down(self, index):
        # 从顶向下调整堆，保持堆性质
        size = len(self.heap)
        while True:
            left = self.left_child(index)
            right = self.right_child(index)
            smallest = index

            if left < size and self.heap[left] < self.heap[smallest]:
                smallest = left
            if right < size and self.heap[right] < self.heap[smallest]:
                smallest = right

            if smallest != index:
                self._swap(index, smallest)
                index = smallest
            else:
                break

    def _swap(self, i, j):
        self.heap[i], self.heap[j] = self.heap[j], self.heap[i]


# 测试手写小顶堆
minheap = MinHeap()
for num in [5, 3, 8, 1, 2]:
    minheap.push(num)
print("Manual minheap:", minheap.heap)

print("Pop from manual minheap:", minheap.pop())
print("After pop:", minheap.heap)


# 堆本质是完全二叉树的数组表示，核心是维护父子关系的大小顺序（大顶堆或小顶堆）。

# Python 标准库的 heapq 默认是小顶堆，支持堆化、插入、弹出最小元素等。

# 面试中会让你实现堆的插入（_heapify_up）和删除（_heapify_down）操作。

# 堆应用场景包括优先队列、动态维护 Top K、堆排序等。