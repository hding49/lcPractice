# 主题目：Compress 和 Decompress

# 题意：

# 给定一个字符串，比如 "aaabbbbbbcccccddd"。

# 需要实现两个函数：

# compress：把连续相同字符压缩成“字符 + 次数”，但是当次数是 1 时省略数字（例如 "abc" 压缩后还是 "abc"，不是 "a1b1c1"）。

# decompress：根据压缩结果还原出原始字符串（支持没有数字时次数默认为 1）。

# 示例：

# 输入："aaabbbbbbcccccddd" → 输出："a3b6c5d3"

# 输入："abc" → 输出："abc"


def compress(s):
    if not s: return ""
    out, prev, cnt = [], s[0], 1
    for ch in s[1:]:
        if ch == prev:
            cnt += 1
        else:
            out.append(prev)
            if cnt > 1: out.append(str(cnt))
            prev, cnt = ch, 1
    out.append(prev)
    if cnt > 1: out.append(str(cnt))
    return "".join(out)


def decompress(s):
    out, i, n = [], 0, len(s)
    while i < n:
        ch = s[i]; i += 1
        # 读取紧随其后的数字（没有则视为 1）
        j = i
        while j < n and s[j].isdigit(): j += 1
        cnt = int(s[i:j]) if j > i else 1
        out.append(ch * cnt)
        i = j
    return "".join(out)


# 测试
print(compress("aaabbbbbbcccccddd"))  # a3b6c5d3
print(compress("abc"))                # abc
print(decompress("a3b6c5d3"))         # aaabbbbbbcccccddd
print(decompress("abc"))              # abc


# Follow-up：支持多位数字次数

# 题意：

# 压缩字符串的数字可能是多位，比如 "a12b13"。

# 需要更新 decompress 方法来支持多位数字。


def decompress_multi(s):
    out, i, n = [], 0, len(s)
    while i < n:
        ch = s[i]; i += 1
        j = i
        while j < n and s[j].isdigit(): j += 1
        cnt = int(s[i:j]) if j > i else 1
        out.append(ch * cnt)
        i = j
    return "".join(out)

# 示例
# decompress_multi("a12b13") -> "a"*12 + "b"*13

# 测试多位数字
print(decompress_multi("a12b13"))  # aaaaaaaaaaaa + bbbbbbbbbbbbb






# 1) 很长字符串：分片压缩 + 边界合并

# 思路要点：

# 分片各自做 RLE，但首段和尾段不能立刻落盘，因为可能与相邻片段的边界字符相同，需要合并。

# 每片返回：head_run=(char,count), mid_text（中间稳定区，已压好且不依赖外部）和 tail_run=(char,count)。

# 合并时：用一个 pending_run 维护“当前未 flush 的尾段”，与下一片的 head_run 比较，若字符相同则计数相加，否则 flush。

def compress_stream(s, chunk_size=1_000_000):
    if not s: return ""
    out, prev, cnt = [], None, 0
    for i in range(0, len(s), chunk_size):
        chunk = s[i:i+chunk_size]
        for ch in chunk:
            if ch == prev:
                cnt += 1
            else:
                if prev is not None:
                    out.append(prev)
                    if cnt > 1: out.append(str(cnt))
                prev, cnt = ch, 1
    # flush last run
    out.append(prev)
    if cnt > 1: out.append(str(cnt))
    return "".join(out)


def decompress_stream(s, chunk_size=1_000_000):
    out, cur, num = [], None, ""
    for i in range(0, len(s), chunk_size):
        chunk = s[i:i+chunk_size]
        for ch in chunk:
            if cur is None:
                cur, num = ch, ""
            elif ch.isdigit():
                num += ch              # 可能跨块的多位数字，顺着累加即可
            else:
                out.append(cur * (int(num) if num else 1))
                cur, num = ch, ""
    # flush last
    if cur is not None:
        out.append(cur * (int(num) if num else 1))
    return "".join(out)

# 都是 O(n) 时间，O(1) 额外内存（不算输出）

# 上例解释：前片尾是 a(4)，后片头是 a(1)，合并为 a(5)；后片余下 "bc" 是单个字符段，按规则不写 1。

# 复杂度：整体仍为 O(n) 时间；额外内存 O(1)（除输出外）。

# 若允许流式处理，其实单次线性扫描就能搞定（更省内存）；分片方案是内存或分布式场景下的可落地做法。


# 2) 原字符串里本来就有数字：如何避免歧义

# 问题：RLE 的“次数”用数字表示；如果原串就含数字，像 "a3bbb"，压缩后 a3b3，"3" 既可能是数据字符也可能被误读为次数。

# 推荐的无歧义做法（转义方案）：

# 规则：遇到 数字 或 反斜杠 \ 的“数据字符”，在前面加一个反斜杠 \ 进行转义；次数仍写在段后，且次数=1 时省略。

# 解码：读取一个“数据字符”（若遇 \ 则下一个字面字符为数据），随后读连续多位数字作为次数；若没有数字则次数=1。

# 优点：不引入新分隔符；对任意字符集安全；依旧可读。

def compress_safe(s):
    out, prev, cnt = [], s[0], 1
    for ch in s[1:]:
        if ch == prev:
            cnt += 1
        else:
            if prev.isdigit() or prev == "\\":
                out.append("\\")  # 转义
            out.append(prev)
            if cnt > 1: out.append(str(cnt))
            prev, cnt = ch, 1
    if prev.isdigit() or prev == "\\":
        out.append("\\")
    out.append(prev)
    if cnt > 1: out.append(str(cnt))
    return "".join(out)


def decompress_safe(s):
    out, i, n = [], 0, len(s)
    while i < n:
        if s[i] == "\\":   # 遇到转义
            ch = s[i+1]; i += 2
        else:
            ch = s[i]; i += 1
        j = i
        while j < n and s[j].isdigit(): j += 1
        cnt = int(s[i:j]) if j > i else 1
        out.append(ch * cnt)
        i = j
    return "".join(out)

# orig = r"a33bbb\xyz1111"
# enc = compress_safe(orig)
# dec = decompress_safe(enc)
# assert dec == orig