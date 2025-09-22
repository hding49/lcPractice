# 题目总结（LeetCode 362 同型变体）

# 支持两函数：

# process_loan(amount, ts)：在时间戳 ts（秒）时处理一笔金额为 amount 的贷款。

# get_loan_volume(ts)：返回**过去 1 小时（3600 秒）**内处理过的贷款总金额。

# 要求：用**固定大小数组（fixed-size array）**实现滑动时间窗；时间、空间复杂度都为 O(1)（常数级：数组长度固定为 3600）。


class LoanCounter:
    def __init__(self, window=3600):
        self.W = window
        self.times = [0] * window      # 每个桶最后一次写入的时间戳
        self.amounts = [0] * window    # 每个桶对应秒内累计金额
        self.total = 0                  # 窗口内总金额

    def process_loan(self, amount, ts):
        i = ts % self.W
        # 桶过期：直接把过期金额从总和中扣掉并清空
        if ts - self.times[i] >= self.W:
            self.total -= self.amounts[i]
            self.amounts[i] = 0
            self.times[i] = ts
        # 桶未过期但不是同一秒：先把旧秒的数据从总和里扣掉，再换成当前秒
        elif self.times[i] != ts:
            self.total -= self.amounts[i]
            self.amounts[i] = 0
            self.times[i] = ts
        # 同一秒或已重置为当前秒：直接累加
        self.amounts[i] += amount
        self.total += amount

    def get_loan_volume(self, ts):
        # 清理陈旧桶（至多 3600 个，常数时间）
        for i in range(self.W):
            if ts - self.times[i] >= self.W:
                if self.amounts[i]:
                    self.total -= self.amounts[i]
                    self.amounts[i] = 0
                # 标记为已同步到当前时刻（0 值不影响结果）
                self.times[i] = ts
        return self.total

# 复杂度说明（并解释变量）

# 时间复杂度：O(1)

# process_loan：常数操作。

# get_loan_volume：最多扫描 3600 个桶（窗口大小常数），视为 O(1)。

# 空间复杂度：O(1)

# 仅使用两个长度为 W=3600 的数组与常数额外变量（固定常数空间）。