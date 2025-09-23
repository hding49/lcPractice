# 题目理解（简要）

# 有两天的购买日志，每条是 [date, userId, orderType, amount]（amount 可由字符串解析成数字）。

# Part 1：找出“两天都出现过且两天合计至少 2 个不同 orderType”的用户，按字典序返回。

# Part 2：对新购买 (userId, orderType, amount) 打信任分（0..100）= 类型分(0/50) + 金额分(0..50)

# 类型分：该用户两天历史里见过此 orderType则 +50，否则 +0。

# 金额分：看该用户两天历史的 min/max。

# 若新金额落在区间[min,max] 内 → +50

# 否则计算“超出最近边界的百分比”，每满 10% 扣 10 分，不低于 0。

# 若该用户在两天里没有历史 → 金额分 0。

# 复杂度目标：一次遍历构建用户历史，整体 O(N) 时间，O(U) 空间（U 为不同用户数）。

from math import floor

class PurchaseAnalyzer:
    def __init__(self, day1_logs, day2_logs):
        # 只存原始日志，不做任何聚合逻辑
        self.day1 = day1_logs
        self.day2 = day2_logs

    def crossDayDiverseUsers(self):
        # 仅为 Part 1 现算所需信息：两天用户集合 + 两天合计的类型集合
        day1_users, day2_users, types_map = set(), set(), {}
        for _, uid, o, _ in self.day1:
            day1_users.add(uid)
            types_map.setdefault(uid, set()).add(o)
        for _, uid, o, _ in self.day2:
            day2_users.add(uid)
            types_map.setdefault(uid, set()).add(o)
        return sorted([u for u in (day1_users & day2_users) if len(types_map[u]) >= 2])

# follow up -- 如果两input的log里不是一定只有两天的数据 两个log里会有任意一天的数据 会把需求改成 找在任意两天的user 是一个function 不是class 而且每一个log 数组的元素是string


    # def crossDayDiverseUsers(log1. log2):
    #     log_users, types_map, date_map = set(), {}, {}

    #     def parse (log):
    #         parts = log.split(',')
    #         return parts[2], parts[1], parts[0]

    #     for entry in self.day1:
    #         uuid, t, d = parse(entry)
    #         date_map.setdefault(uid, set()).add(d)
    #         log_users.add(uid)
    #         types_map.setdefault(uid, set()).add(t)

    #     for entry in self.day2:
    #         uuid, t, d = parse(entry)
    #         date_map.setdefault(uid, set()).add(d)
    #         log_users.add(uid)
    #         types_map.setdefault(uid, set()).add(t)

    #     return [u for u in log_users if len(types_map[u]) >= 2 and len(date_map[u]) == 2]


#     时间复杂度

# 遍历 day1 和 day2 日志：O(N1 + N2)，其中 N1,N2 分别是两天日志长度。

# 集合交集 day1_users & day2_users：最坏 O(min(U1, U2))，U1/U2 为两天不同用户数。

# 过滤 + 构建结果：O(U)，U 是用户总数。

# 排序结果：O(K log K)，K 为符合条件的用户数（≤ U）。

# 👉 总体：O(N1 + N2 + U + K log K)。
# 通常可近似记为 O(N log U) （因为 K ≤ U，日志规模远大于用户数）。 N 指的是 日志总条数

# 空间复杂度

# day1_users、day2_users：O(U)。

# types_map：O(U * T)，T 是单个用户的平均类型数。

# 结果数组：O(K)。

# 👉 总体：O(U * T)。

    def trustScore(self, uid, otype, amount):
        # 为避免每次都重扫日志，这里“懒构建”两天历史；逻辑写在本函数体内
        hist = {}
        for logs in (self.day1, self.day2):
            for _, u, o, a in logs:
                a = float(a)
                if u not in hist:
                    hist[u] = {"types": set(), "min": a, "max": a}
                h = hist[u]
                h["types"].add(o)
                if a < h["min"]: h["min"] = a
                if a > h["max"]: h["max"] = a

        amount = float(amount)
        t = a = 0
        h = hist.get(uid)
        if h:
            if otype in h["types"]:
                t = 50
            lo, hi = h["min"], h["max"]
            if lo <= amount <= hi:
                a = 50
            else:
                bound = hi if amount > hi else lo
                over = abs(amount - bound) / bound
                steps = int((over * 100) // 10)  # 每满10%扣10分
                a = max(0, 50 - 10 * steps)
        return t + a


# 时间复杂度

# 第一次调用：需要遍历两天日志，构建历史 → O(N1 + N2)。

# 后续调用：

# 查询用户历史（字典查找 O(1)）。

# 判断类型 + 金额 → 常数操作 O(1)。

# 👉 总体：

# 构建历史：O(N1 + N2)

# 单次打分：O(1)

# 空间复杂度

# 存用户历史：hist → 每个用户一个 entry，保存一个 set(orderTypes) 和两个数。

# 大小为 O(U * T)，U 是用户总数 T 是单个用户的平均类型数。

# 👉 总体：O(U * T)。




# 另外问了扩展问题，如果不是 log file，是stream of logs 怎么办。

from math import floor

class StreamPurchaseAnalyzer:
    def __init__(self):
        self.bucket = {}      # date_str -> list of logs
        self.today = None
        self.yesterday = None

    def _roll_to(self, date_str):
        if self.today is None:
            self.today = date_str
            self.bucket[self.today] = []
            return
        if date_str == self.today:
            return
        if self.yesterday and self.yesterday in self.bucket:
            del self.bucket[self.yesterday]
        self.yesterday = self.today
        self.today = date_str
        self.bucket[self.today] = []

    def ingest(self, date_str, uid, otype, amount):
        self._roll_to(date_str)
        self.bucket[self.today].append([date_str, uid, otype, str(amount)])

    def crossDayDiverseUsers(self):
        if not self.yesterday or self.yesterday not in self.bucket:
            return []
        day1_logs = self.bucket[self.yesterday]
        day2_logs = self.bucket[self.today]

        day1_users, day2_users, types_map = set(), set(), {}
        for _, uid, o, _ in day1_logs:
            day1_users.add(uid)
            types_map.setdefault(uid, set()).add(o)
        for _, uid, o, _ in day2_logs:
            day2_users.add(uid)
            types_map.setdefault(uid, set()).add(o)

        return sorted([u for u in (day1_users & day2_users) if len(types_map[u]) >= 2])

    def trustScore(self, uid, otype, amount):
        # 每次调用都重建历史
        hist = {}
        logs_pairs = []
        if self.yesterday and self.yesterday in self.bucket:
            logs_pairs.append(self.bucket[self.yesterday])
        if self.today and self.today in self.bucket:
            logs_pairs.append(self.bucket[self.today])

        for logs in logs_pairs:
            for _, u, o, a in logs:
                a = float(a)
                if u not in hist:
                    hist[u] = {"types": set(), "min": a, "max": a}
                h = hist[u]
                h["types"].add(o)
                h["min"] = min(h["min"], a)
                h["max"] = max(h["max"], a)

        amount = float(amount)
        t = a = 0
        h = hist.get(uid)
        if h:
            if otype in h["types"]:
                t = 50
            lo, hi = h["min"], h["max"]
            if lo <= amount <= hi:
                a = 50
            else:
                bound = hi if amount > hi else lo
                over = abs(amount - bound) / bound
                steps = int((over * 100) // 10)
                a = max(0, 50 - 10 * steps)
        return t + a