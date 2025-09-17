# 题目总结

# 给一组“购物会话”记录；每条记录里是该会话中访问过的商店列表。

# 需要统计店铺两两共现次数（同一会话内同一商店出现多次，只算一次）。

# 对每个店铺，输出与其共同出现最频繁的其它店铺列表：

# 目标店铺整体按字典序排序；

# 每个目标店铺下的关联店铺按共现次数降序，次数相同再按字典序升序；

# 仅输出店名，不输出次数。

# 边界：

# 空记录返回 []；

# 只有单一店铺（即没有任何与它共现的店）时返回 [[]]；

# 记录可能为空数组（表示没买东西），应跳过；

# 店名大小写敏感。


from collections import defaultdict
from itertools import combinations

def shopping_patterns(records):
    """
    records: List[List[str]]
    return: List[List[str]]  按题意的嵌套列表
    """
    # 1) 收集所有店铺（用于确定目标店铺集合与字典序）
    all_stores = set()
    for rec in records:
        for s in rec:
            all_stores.add(s)

    if not all_stores:
        return []

    # 2) 统计两两共现次数（双向累计）
    # counts[a][b] = 店铺 a 与 b 的共现次数
    counts = defaultdict(lambda: defaultdict(int))

    for rec in records:
        # 一次会话内去重（同一店多次只算一次）
        unique = list(set(rec))
        # 跳过空/单元素会话：空对共现无贡献；单元素也无对
        if len(unique) < 2:
            continue
        for x, y in combinations(unique, 2):
            counts[x][y] += 1
            counts[y][x] += 1

    # 3) 目标店铺按字典序；对每个店铺生成排序后的关联店名单
    result = []
    for store in sorted(all_stores):
        neighbors = counts[store]  # dict of neighbor -> freq（可能不存在）
        if not neighbors:
            result.append([])
            continue
        # 排序：先按频次降序，再按店名字典序升序
        sorted_neighbors = sorted(
            neighbors.items(),
            key=lambda kv: (-kv[1], kv[0])
        )
        result.append([name for name, _ in sorted_neighbors])

    return result
