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
        # 每个用户聚合两天历史：出现天数掩码、所有类型、金额min/max
        # day_mask: 第0天=1, 第1天=2, 两天都出现=3
        self.hist = {}  # userId -> {"mask": int, "types": set, "min": float, "max": float}
        self._ingest(day1_logs, 0)
        self._ingest(day2_logs, 1)

    def _ingest(self, logs, day_idx):
        bit = 1 if day_idx == 0 else 2
        for date, uid, otype, amt in logs:
            amt = float(amt)
            if uid not in self.hist:
                self.hist[uid] = {"mask": 0, "types": set(), "min": amt, "max": amt}
            h = self.hist[uid]
            h["mask"] |= bit
            h["types"].add(otype)
            if amt < h["min"]:
                h["min"] = amt
            if amt > h["max"]:
                h["max"] = amt

    def crossDayDiverseUsers(self):
        res = []
        for uid, h in self.hist.items():
            if h["mask"] == 3 and len(h["types"]) >= 2:
                res.append(uid)
        res.sort()
        return res

    def trustScore(self, uid, otype, amount):
        amount = float(amount)
        # 类型分
        type_score = 0
        # 金额分
        amount_score = 0

        if uid in self.hist:
            h = self.hist[uid]
            if otype in h["types"]:
                type_score = 50
            lo, hi = h["min"], h["max"]
            # 金额分
            if lo <= amount <= hi:
                amount_score = 50
            else:
                # 距离最近边界的超出比例（基于边界值）
                bound = hi if amount > hi else lo
                # 题目保证金额 > 0，因此 bound > 0
                over = abs(amount - bound) / bound  # 比如 0.257 -> 25.7%
                steps = floor((over * 100) / 10)    # 每满10%扣10分
                amount_score = max(0, 50 - 10 * steps)
        # 无历史：两部分皆为 0

        return type_score + amount_score


# 另外问了扩展问题，如果不是 log file，是stream of logs 怎么办。

from collections import defaultdict

class StreamPurchaseAnalyzer:
    # [NEW for streaming] 整体类：支持“流式两天滑动窗口”的增量维护
    def __init__(self):
        # [NEW for streaming] 分日桶：只保留最近两天
        self.bucket = {}        # date_str -> { uid: {"types": set, "min": float, "max": float} }
        self.today = None       # [NEW for streaming]
        self.yesterday = None   # [NEW for streaming]
        # [NEW for streaming] 合并视图：回答查询（两天 union）
        self.merged = {}        # uid -> {"types": set, "min": float, "max": float, "mask": int}  # bit: yesterday=1, today=2

    def _roll_to(self, date_str):
        # [NEW for streaming] 跨天滚动窗口：维护 today / yesterday 两个桶
        if self.today is None:
            self.today = date_str
            self.yesterday = None
            self.bucket[self.today] = {}
            return
        if date_str == self.today:
            return
        if self.yesterday and self.yesterday in self.bucket:
            del self.bucket[self.yesterday]  # 只保留最近两天
        self.yesterday = self.today
        self.today = date_str
        self.bucket[self.today] = {}

    def _upd_bucket_user(self, bkt, uid, otype, amt):
        # [NEW for streaming] 在当日桶内增量更新该用户的 types / min / max
        u = bkt.get(uid)
        if not u:
            bkt[uid] = {"types": {otype}, "min": amt, "max": amt}
        else:
            u["types"].add(otype)
            if amt < u["min"]: u["min"] = amt
            if amt > u["max"]: u["max"] = amt

    def ingest(self, date_str, uid, otype, amount):
        # [NEW for streaming] 流式入口：每到一条日志就更新窗口与合并视图
        amount = float(amount)
        self._roll_to(date_str)                          # [NEW for streaming]
        self._upd_bucket_user(self.bucket[self.today],   # [NEW for streaming]
                              uid, otype, amount)
        # [NEW for streaming] 仅合并该 uid 的两日视图（O(1)）
        a = self.bucket.get(self.today, {}).get(uid)
        b = self.bucket.get(self.yesterday, {}).get(uid)
        types = set()
        lo, hi = None, None
        mask = 0
        if b:
            types |= b["types"]; lo = b["min"]; hi = b["max"]; mask |= 1
        if a:
            types |= a["types"]
            lo = a["min"] if lo is None else min(lo, a["min"])
            hi = a["max"] if hi is None else max(hi, a["max"])
            mask |= 2
        self.merged[uid] = {"types": types, "min": lo, "max": hi, "mask": mask}

    def crossDayDiverseUsers(self):
        # （沿用批处理版逻辑；但数据来自 merged）——接口保持不变，方便替换
        res = []
        for uid, h in self.merged.items():
            if h["mask"] == 3 and len(h["types"]) >= 2:
                res.append(uid)
        res.sort()
        return res

    def trustScore(self, uid, otype, amount):
        # （沿用批处理版逻辑；但数据来自 merged）——接口保持不变，方便替换
        amount = float(amount)
        type_score = 0
        amount_score = 0
        h = self.merged.get(uid)
        if h:
            if otype in h["types"]:
                type_score = 50
            lo, hi = h["min"], h["max"]
            if lo is not None and hi is not None:
                if lo <= amount <= hi:
                    amount_score = 50
                else:
                    bound = hi if amount > hi else lo
                    over = abs(amount - bound) / bound
                    steps = int((over * 100) // 10)  # 每满10%扣10分
                    amount_score = max(0, 50 - 10 * steps)
        return type_score + amount_score