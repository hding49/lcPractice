# 题目总结（one-hour loan amount）
# 设计数据结构，支持：
# •	addLoan(time, amount): 在时刻 time（如 "2:15pm"）新增一笔金额 amount 的贷款记录。
# •	getLoan(time): 返回查询时刻 time 的过去一小时内（窗口 (t-3600, t]，左开右闭）的所有贷款金额之和。
# 时间精度到秒；需正确处理 am/pm（含 12am/12pm 边界）。


from collections import deque

def parse_time(s):
    s = s.strip().lower()
    ampm = s[-2:]
    h, m = map(int, s[:-2].split(':'))
    if ampm == 'pm' and h != 12:
        h += 12
    if ampm == 'am' and h == 12:
        h = 0
    return (h * 60 + m) * 60

class LoanTracker:
    def __init__(self):
        self.q = deque()
        self.sum = 0
        self.W = 3600  # 一小时秒数

    def removeExpired(self, t):
        while self.q and self.q[0][0] <= t - self.W:
            ts, amt = self.q.popleft()
            self.sum -= amt

    def addLoan(self, time, amount):
        t = parse_time(time)
        self.removeExpired(t)
        self.q.append((t, amount))
        self.sum += amount

    def getLoan(self, time):
        t = parse_time(time)
        self.removeExpired(t)
        return self.sum

# 时间复杂度：addLoan / getLoan 平均 O(1)

# 空间复杂度：O(n)，n 为最近一小时内存储的贷款记录数

# 示例
tracker = LoanTracker()
tracker.addLoan("2:15pm", 100)
print(tracker.getLoan("2:30pm"))  # 100
tracker.addLoan("3:05pm", 150)
print(tracker.getLoan("3:05pm"))  # 250
print(tracker.getLoan("3:45pm"))  # 150
tracker.addLoan("4:05pm", 200)
print(tracker.getLoan("4:05pm"))  # 350


# Follow up是如果内存非常小，不能存所有的数据都存储，应该怎么读取最近一小时的贷款量？

# 这里给出最优实用解：

# 精确到秒；

# 内存 O(3600)（固定环形缓冲）；

# 维护滚动总和，add/get 平均 O(1)（时间跳跃时最多清 3600 个桶，代价有上界）。

# 核心思路：用 3600 个“秒桶”做环形数组，记录该秒的累计金额；维护一个 total 表示当前窗口 (t-3600, t] 的总和。时间前进时，逐秒“滑动”窗口：弹出过期桶、清零、前移指针

def parse_time(s):
    s = s.strip().lower()
    ampm = s[-2:]
    h, m = map(int, s[:-2].split(':'))
    if ampm == 'pm' and h != 12: h += 12
    if ampm == 'am' and h == 12: h = 0
    return (h * 60 + m) * 60  # 转为当日秒数

class LoanTracker:
    def __init__(self):
        self.W = 3600
        self.ts = [0] * self.W        # 每个桶最后写入的绝对秒
        self.acc = [0] * self.W       # 该秒的累计金额
        self.total = 0

    def addLoan(self, time, amount):
        t = parse_time(time)
        i = t % self.W
        # 桶过期或是新秒：把旧值从 total 扣掉后再覆盖
        if t - self.ts[i] >= self.W or self.ts[i] != t:
            self.total -= self.acc[i]
            self.acc[i] = 0
            self.ts[i] = t
        self.acc[i] += amount
        self.total += amount

    def getLoan(self, time):
        t = parse_time(time)
        # 清理所有已过期的桶（最多 3600 个，常数）
        for i in range(self.W):
            if t - self.ts[i] >= self.W and self.acc[i]:
                self.total -= self.acc[i]
                self.acc[i] = 0
                # 不必更新 ts[i]，保持原值即可
        return self.total

# 时间复杂度：addLoan O(1)，getLoan O(1)（扫描固定 3600 个桶为常数）。

# 空间复杂度：O(1)（固定 3600 桶）。
