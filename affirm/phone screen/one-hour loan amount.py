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

    def _evict(self, t):
        while self.q and self.q[0][0] <= t - self.W:
            ts, amt = self.q.popleft()
            self.sum -= amt

    def addLoan(self, time, amount):
        t = parse_time(time)
        self._evict(t)
        self.q.append((t, amount))
        self.sum += amount

    def getLoan(self, time):
        t = parse_time(time)
        self._evict(t)
        return self.sum

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


from collections import deque  # 仅示例里不用，保留无妨

def parse_time(s):
    s = s.strip().lower()
    ampm = s[-2:]
    h, m = map(int, s[:-2].split(':'))
    if ampm == 'pm' and h != 12: h += 12
    if ampm == 'am' and h == 12: h = 0
    return (h * 60 + m) * 60  # 秒

class LoanTracker:
    def __init__(self):
        self.W = 3600
        self.bucket = [0] * self.W     # 每秒累计金额
        self.stamp  = [-1] * self.W    # 该桶对应的“绝对秒”
        self.total = 0
        self.last_t = -1               # 最近一次对齐的秒

    def _advance(self, t):
        # 第一次直接标记
        if self.last_t == -1:
            self.last_t = t
            return
        # 时间向前推进 dt 秒；逐秒弹出过期桶（最多 3600 次）
        dt = min(max(0, t - self.last_t), self.W)
        for _ in range(dt):
            self.last_t += 1
            i = self.last_t % self.W
            # 若该桶属于窗口外（stamp <= last_t - W），从总和里减去并清空
            if self.stamp[i] <= self.last_t - self.W:
                self.total -= self.bucket[i]
                self.bucket[i] = 0
                self.stamp[i] = -1

    def addLoan(self, time_str, amount):
        t = parse_time(time_str)
        self._advance(t)
        i = t % self.W
        # 若此桶不是当前秒的数据，先把旧值从 total 中扣掉（它已被 _advance 清理为 0 或仍在窗内为 0）
        if self.stamp[i] != t:
            # 若 stamp[i] 仍在窗内，bucket[i] 理论应为 0；稳妥起见再减一次 0 无影响
            self.total -= self.bucket[i]
            self.bucket[i] = 0
            self.stamp[i] = t
        self.bucket[i] += amount
        self.total += amount

    def getLoan(self, time_str):
        t = parse_time(time_str)
        self._advance(t)
        return self.total

# 示例
tracker = LoanTracker()
tracker.addLoan("2:15pm", 100)
print(tracker.getLoan("2:30pm"))  # 100
tracker.addLoan("3:05pm", 150)
print(tracker.getLoan("3:05pm"))  # 250
print(tracker.getLoan("3:45pm"))  # 150
tracker.addLoan("4:05pm", 200)
print(tracker.getLoan("4:05pm"))  # 350