# Q1. 判断两个字符串是否为 anagram

# 思路：用计数（比排序更快）。若是仅小写 a–z，可用长度 26 的数组；否则用 Counter。

from collections import Counter

def is_anagram(s, t):
    if len(s) != len(t): 
        return False
    return Counter(s) == Counter(t)

# 时间复杂度：O(L)

# 空间复杂度：O(Σ) （Σ = 字符集大小，比如只有 a–z 时就是 O(1)）


# Q2. 分组异位词（LeetCode 49 原题）
# 解法 A：排序签名（最直观）

from collections import defaultdict

def group_anagrams_sort(strs):
    groups = defaultdict(list)
    for s in strs:
        key = ''.join(sorted(s))   # 排序后的字符串作为签名
        groups[key].append(s)
    return list(groups.values())

# 时间复杂度：O(n·L log L) （n = 字符串个数，L = 平均长度）

# 空间复杂度：O(n·L)

# Q3. “优化时间复杂度”的要点与实用版代码

# 从 A 的排序签名 O(n·L log L) 优化到 B 的计数签名 O(n·L)。

# 进一步的工程小优化：

# 先按 len(s) 分桶，减少哈希表冲突与不必要构造；

# 对超大输入，尽量重用数组对象（但要记得转 tuple 当 key）；

# 若字符串很长且字符集固定，计数签名收益更明显。

# 综合版（长度预分桶 + 计数签名）：

from collections import defaultdict

def group_anagrams_count(strs):
    groups = defaultdict(list)
    for s in strs:
        cnt = [0]*26
        for ch in s:
            cnt[ord(ch)-97] += 1
        groups[tuple(cnt)].append(s)  # tuple 可哈希
    return list(groups.values())


# 复杂度：时间 O(n·L)，空间 O(n·L)；长度分桶对大数据集通常有更好的常数表现。
# n = 输入字符串的个数
# L = 每个字符串的平均长度


# n = 输入的字符串个数

# L = 每个字符串的平均长度

# Σ = 字符集大小（例如只有小写字母就是 26）