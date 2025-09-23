
# 题目本体

# 要求：

# get(key) O(1)

# put(key, val) O(1)

# delete(key) O(n)（允许线性）

# get_random_val() O(1)，按key 等概率返回其 value

# 做法：

# kv: dict，key -> val

# keys: 动态数组，保存所有 key（只为随机）

# get_random_val() = 从 keys 中 random.choice(key)，再 kv[key]

# delete(key) 允许 O(n)：用 list.remove(key) 从 keys 删掉即可

import random

class DictRandomByKey:
    def __init__(self):
        self.kv = {}     # key -> val
        self.keys = []   # all keys, for O(1) random pick

    def get(self, key):
        return self.kv.get(key)

    def put(self, key, val):
        if key not in self.kv:
            self.keys.append(key)
        self.kv[key] = val

    def delete(self, key):
        if key in self.kv:
            del self.kv[key]
            # O(n) deletion from the keys array is allowed in the base problem
            self.keys.remove(key)
            return True
        return False

    def get_random_val(self):
        if not self.keys:
            return None
        k = random.choice(self.keys)  # O(1)
        return self.kv[k]

# Follow-up 1

# 变化：get_random_val() 需要对每个“唯一值”等概率（与 key 数量无关）。允许把put做成 O(n)。

# 思路：

# 仍保留 kv。

# 维护 cnt: val -> 出现次数。

# 维护 uniq_vals: 当前所有出现过的 唯一值数组。

# 为保证 get_random_val() O(1)，我们在 put/delete 时把 uniq_vals 整理好。这里按要求可以让 put 退化到 O(n)：
# 每次写入后重建 uniq_vals（或在计数变化时全量扫描一遍 cnt，都行）。

import random
from collections import Counter

class DictRandomByUniqueVal_PutON:
    def __init__(self):
        self.kv = {}             # key -> val
        self.cnt = Counter()     # val -> count
        self.uniq_vals = []      # list of unique values

    def _rebuild_uniqs(self):
        self.uniq_vals = [v for v, c in self.cnt.items() if c > 0]

    def get(self, key):
        return self.kv.get(key)

    def put(self, key, val):
        # O(n)：我们把重建 uniq_vals 的工作摊在 put 上
        if key in self.kv:
            old = self.kv[key]
            if old != val:
                self.cnt[old] -= 1
        self.kv[key] = val
        self.cnt[val] += 1
        self._rebuild_uniqs()  # 允许 O(n)

    def delete(self, key):
        if key in self.kv:
            v = self.kv.pop(key)
            self.cnt[v] -= 1
            self._rebuild_uniqs()  # 这里同样 O(n) 也可以
            return True
        return False

    def get_random_val(self):
        if not self.uniq_vals:
            return None
        return random.choice(self.uniq_vals)  # 每个唯一值等概率


# Follow-up 2（LeetCode 381 风格：所有操作都要 O(1)）

# 目标：在 Follow-up 1 的语义上再加强：

# get O(1)

# put O(1)

# delete O(1)

# get_random_val O(1)，仍对每个唯一值等概率

# 关键：像 381 一样用“数组 + 位置表 + 计数表”的组合，保证O(1)地把某个值加入/移出“唯一值数组”。

# kv: key -> val

# cnt: val -> 出现次数

# vals: 动态数组，当前出现的所有唯一值

# idx: val -> 在 vals 中的下标（用于 O(1) 删除：与末尾交换再 pop）

# 当某 value 的计数从 0→1：把它 append 到 vals，登记 idx[val]。
# 当某 value 的计数从 1→0：与末尾交换并 pop，更新对应 idx。

import random
from collections import defaultdict

class DictRandomByUniqueVal_O1All:
    """
    All operations O(1). get_random_val returns each UNIQUE value with equal probability.
    """
    def __init__(self):
        self.kv = {}                 # key -> val
        self.cnt = defaultdict(int)  # val -> number of keys mapping to val
        self.vals = []               # dynamic array of unique values
        self.idx = {}                # val -> index in self.vals

    def _inc_val(self, v):
        if self.cnt[v] == 0:
            self.idx[v] = len(self.vals)
            self.vals.append(v)
        self.cnt[v] += 1

    def _dec_val(self, v):
        self.cnt[v] -= 1
        if self.cnt[v] == 0:
            # remove v from vals in O(1)
            i = self.idx.pop(v)
            last = self.vals[-1]
            if i != len(self.vals) - 1:
                self.vals[i] = last
                self.idx[last] = i
            self.vals.pop()

    def get(self, key):
        return self.kv.get(key)

    def put(self, key, val):
        # overwrite allowed
        if key in self.kv:
            old = self.kv[key]
            if old == val:
                return
            self._dec_val(old)
        self.kv[key] = val
        self._inc_val(val)

    def delete(self, key):
        if key not in self.kv:
            return False
        v = self.kv.pop(key)
        self._dec_val(v)
        return True

    def get_random_val(self):
        if not self.vals:
            return None
        return random.choice(self.vals)  # each unique value has equal prob
