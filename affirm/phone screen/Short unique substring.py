# Q1（非最优解，保证存在）：最短唯一 substring（暴力思路）

# 思路：对某个串 s，从长度 1 开始枚举它的所有子串，拿去和所有其他串用 in 判断；第一个“对所有其他串都不包含”的就是答案。
# 复杂度：设总串数 n，每串最大长 L_max，单个 s 的复杂度最坏约 O(L_s^2 * (n-1) * L_max)（in 搜索近似线性）。全体最坏 ~O(n * L_max^3)，可面过但不最优。

def shortest_unique_substring_bruteforce(strings):
    ans = []
    m = len(strings)
    for i, s in enumerate(strings):
        found = None
        for L in range(1, len(s)+1):
            for a in range(0, len(s)-L+1):
                sub = s[a:a+L]
                ok = True
                for j, t in enumerate(strings):
                    if i == j: continue
                    if sub in t:  # 线性包含判断（非最优）
                        ok = False
                        break
                if ok:
                    found = sub
                    break
            if found is not None:
                break
        ans.append(found)  # 题目保证存在
    return ans


# Q1（最优解，保证存在）：最短唯一 substring（分层按长度 + 文档频次）

# 核心：对每个长度 ℓ，收集所有串的所有长度为 ℓ 的子串，统计文档频次（出现于多少条不同字符串）。对每个字符串，若有某个子串文档频次为 1，则在该层返回（因分层即最短）。

# 为了“最小改动地支撑 Q2”，我用字符串 key 就用原串切片（直接当字典 key），不用滚动哈希；对于典型面试数据足够，并让 Q2 只改几行即可。

# 复杂度：设总字符数 N，答案最短长度为 K，每层扫描 O(N)，整体 O(N·K)；空间 O(N)。

from collections import defaultdict

def q1_shortest_unique_substrings_with_set(strings):
    n = len(strings)
    if n == 0: 
        return []
    maxL = max(len(s) for s in strings)
    answers = [None] * n
    left = n  # 还剩多少个字符串没找到答案

    for L in range(1, maxL + 1):
        freq = defaultdict(set)  # key: 子串, value: 出现过的字符串编号 set

        # 1) 统计所有子串 -> 记录在哪些字符串里出现
        for i, s in enumerate(strings):
            if L > len(s): 
                continue
            for a in range(len(s) - L + 1):
                sub = s[a:a+L]
                freq[sub].add(i)  # 不需要 seen，set 会自动去重

        # 2) 查找 unique 子串
        for i, s in enumerate(strings):
            if answers[i] is not None or L > len(s):
                continue
            for a in range(len(s) - L + 1):
                sub = s[a:a+L]
                if len(freq[sub]) == 1:  # 只在自己出现
                    answers[i] = sub
                    left -= 1
                    break

        if left == 0:  # 都找到了
            break

    return answers

# Q2（最小改动）：可能没有 unique，则取“出现最少 → 最短 → 字典序” 的 substring

# 相对 Q1 的改动点已用注释标出（仅少量行）。

# 思路：在每层 L，一方面先尝试找 docFreq==1 的；否则为每个串维护一个 best = (docFreq, length, lex_sub) 的全局最优候选。整轮结束后返回 best。

# 复杂度：与 Q1 同阶，O(N·K')。

from collections import defaultdict

def q2_least_appearing_substrings_with_set(strings):
    n = len(strings)
    if n == 0:
        return []
    maxL = max(len(s) for s in strings)
    answers = [None] * n
    left = n  # 还没找到答案的串数（同 Q1）

    # CHANGED: 新增兜底 best（docFreq, length, lex_sub）
    # "bests keeps a fallback candidate — the substring that appears in the fewest strings, 
    # and among those, the shortest and lexicographically smallest — so even if no unique 
    # substring exists, we can still return something."
    bests = [(10**9, 10**9, "") for _ in range(n)]

    for L in range(1, maxL + 1):
        # —— 第一遍：统计长度为 L 的所有子串出现在哪些字符串里（与 Q1 一样）——
        freq = defaultdict(set)  # key: 子串, value: 出现过该子串的字符串编号 set
        for i, s in enumerate(strings):
            if L > len(s):
                continue
            for a in range(len(s) - L + 1):
                sub = s[a:a+L]
                freq[sub].add(i)

        # —— 第二遍：对还没确定答案的串，先尝试 unique；否则更新“出现最少→最短→字典序” —— 
        for i, s in enumerate(strings):
            if answers[i] is not None or L > len(s):
                continue

            found = None
            for a in range(len(s) - L + 1):
                sub = s[a:a+L]
                if len(freq[sub]) == 1:                 # 与 Q1 一样：这一层直接命中 unique
                    found = sub
                    break

                # CHANGED: 没有 unique 时，更新兜底 best（按 docFreq → 长度 → 字典序）
                cand = (len(freq[sub]), L, sub)
                if cand < bests[i]:
                    bests[i] = cand

            if found is not None:
                answers[i] = found
                left -= 1

        if left == 0:  # 与 Q1 一样：都找到了就提前退出
            break

    # CHANGED: 对仍未命中的，回填“出现最少→最短→字典序最小”的子串
    for i in range(n):
        if answers[i] is None:
            answers[i] = bests[i][2]

    return answers


# Q3（最小改动思路）：最短 unique subsequence

# 和 substring 完全不同，算法会变化大一些（不可避免），但我保持函数签名与返回一致，并尽量沿用“分层（按长度）找最短”的思想，只是把“长度为 L 的所有 subsequences”通过 BFS 按层扩展（每次在目标串中往后挑一个字符），并用**“是否是其他串子序列”**作为判定。

# 关键差异（相对 Q2 的“最小改动”标注在注释里）：

# 不再按固定窗口切 substring；改为在目标串的下标上做 BFS（层=选取的 subsequence 长度）。

# 判定某个候选 subsequence u 是否出现在其他串里，使用预处理 next 表（从位置 p 后读字符 c 的下一个位置）。

# 复杂度：小规模时很快（答案长度很短，分支数受字符集与位置限制）；最坏情况较大，但面试足够。

from collections import deque

def q3_shortest_unique_subsequence(strings):
    n = len(strings)
    if n == 0:
        return []
    # CHANGED from Q2: subseq 需要字符集（减支用）
    alphabet = sorted(set("".join(strings)))

    # CHANGED from Q2: 预处理“子序列匹配”的 next 表，而不是子串 freq
    def build_next_table(s):
        m = len(s)
        # next_pos[i][c]: 从位置 i 之后（严格大于 i）遇到字符 c 的位置；i = -1 视作起点前
        next_pos = [{c: -1 for c in alphabet} for _ in range(m+1)]
        last = {c: -1 for c in alphabet}
        for c in alphabet:
            next_pos[m][c] = -1
        for i in range(m - 1, -1, -1):
            last[s[i]] = i
            for c in alphabet:
                next_pos[i][c] = last[c]
        # 起点（-1）：第一次出现
        start = {c: -1 for c in alphabet}
        seen = {c: False for c in alphabet}
        for i, ch in enumerate(s):
            if not seen[ch]:
                start[ch] = i
                seen[ch] = True
        return next_pos, start

    # CHANGED from Q2: 对全部串构建 next 表
    tables = [build_next_table(s) for s in strings]

    ans = [None] * n

    for idx, s in enumerate(strings):
        next_s, start_s = tables[idx]
        others = [j for j in range(n) if j != idx]

        # CHANGED from Q2: 用 BFS 分层（层 = subseq 长度），状态携带“在各串中的匹配进度”
        # state = (pos_in_s, tuple(pos_in_others)), path_string
        q = deque()
        visited = set()

        # CHANGED from Q2: 初始化——从起点选择一个字符
        for c in alphabet:
            p_s = start_s[c]
            if p_s == -1:
                continue
            pos_oth = []
            for j in others:
                next_t, start_t = tables[j]
                p_t = start_t[c]  # -1 表示该串没有 c
                pos_oth.append(p_t)
            state = (p_s, tuple(pos_oth))
            if state not in visited:
                visited.add(state)
                q.append((state, c))

        def all_fail(pos_tuple):
            # CHANGED from Q2: unique subseq 判定：在所有其他串里都“不再是子序列”
            return all(p == -1 for p in pos_tuple)

        found = None
        while q and not found:
            (p_s, pos_tuple), cur = q.popleft()
            if all_fail(pos_tuple):
                found = cur  # BFS 保证最短
                break

            # CHANGED from Q2: 扩展下一字符（保持 subseq 约束：索引单调前进）
            for c in alphabet:
                next_ps = -1 if p_s == -1 else next_s[p_s][c]
                if next_ps == -1:
                    continue
                new_tuple = []
                for k, j in enumerate(others):
                    p = pos_tuple[k]
                    if p == -1:
                        new_tuple.append(-1)  # 已失配保持失败态
                    else:
                        next_t, _ = tables[j]
                        new_tuple.append(next_t[p][c])
                state = (next_ps, tuple(new_tuple))
                if state not in visited:
                    visited.add(state)
                    q.append((state, cur + c))

        ans[idx] = found if found is not None else ""  # 需要时可改为 None
    return ans


# 小结（对比 & 复杂度）

# Q1 非最优：直接枚举子串并用 in 检查；易写但最坏很慢。

# Q1 最优（子串）：分层按长度统计文档频次，同层即最短；O(N·K)。

# Q2（子串）：在 Q1 的框架上，只加了“追踪最少出现 → 最短 → 字典序”的兜底；改动极少。

# Q3（子序列）：换成 next 表 + BFS 分层；虽然结构不同，但我尽量保持了函数签名和“分层找最短”的叙述一致，并在代码里标注了相对 Q2 的改动。