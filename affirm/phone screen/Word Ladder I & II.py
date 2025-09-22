# 127. Word Ladder

from collections import defaultdict, deque

def ladderLength(beginWord, endWord, wordList):
    words = set(wordList)
    if endWord not in words:
        return 0
    L = len(beginWord)

    # 通配桶：h*t -> ["hot","hit"]
    buckets = defaultdict(list)
    for w in words | {beginWord}:
        for i in range(L):
            buckets[w[:i] + '*' + w[i+1:]].append(w)

    q = deque([(beginWord, 1)])
    visited = {beginWord}

    while q:
        w, dist = q.popleft()
        if w == endWord:
            return dist
        for i in range(L):
            key = w[:i] + '*' + w[i+1:]
            for nxt in buckets[key]:
                if nxt not in visited:
                    visited.add(nxt)
                    q.append((nxt, dist + 1))
            buckets[key].clear()  # 避免重复遍历
    return 0

# 复杂度：预处理 O(N·L)；BFS 近似 O(N·L)。N 为单词数，L 为单词长度。空间 O(N·L)。


# 126. Word Ladder II

# 按层 BFS 建「父指针」集合（只记录最短层的前驱），再从 endWord 回溯得到所有最短路径。

from collections import defaultdict, deque

def findLadders(beginWord, endWord, wordList):
    words = set(wordList)
    if endWord not in words:
        return []
    words.add(beginWord)

    # 通配模式索引：如 h*t -> ["hot","hit"]
    buckets = defaultdict(list)
    L = len(beginWord)
    for w in words:
        for i in range(L):
            buckets[w[:i] + '*' + w[i+1:]].append(w)

    parents = defaultdict(set)
    level = {beginWord}
    visited = {beginWord}
    found = False

    while level and not found:
        nxt = set()
        for w in level:
            for i in range(L):
                for v in buckets[w[:i] + '*' + w[i+1:]]:
                    if v in visited:
                        continue
                    if v == endWord:
                        found = True
                    parents[v].add(w)
                    nxt.add(v)
        visited |= nxt
        level = nxt

    if not found:
        return []

    res, path = [], [endWord]
    def backtrack(w):
        if w == beginWord:
            res.append(path[::-1])
            return
        for p in parents[w]:
            path.append(p)
            backtrack(p)
            path.pop()

    backtrack(endWord)
    return res


# 复杂度：预处理 O(N·L)，BFS 总体近似 O(N·L)（N 为字典大小，L 为单词长度），回溯输出与答案规模成正比。