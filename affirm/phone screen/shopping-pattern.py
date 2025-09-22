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

def shopping_patterns_dict(records):
    all_stores = set()                         # 收集出现过的所有店铺，用 set 去重
    for rec in records:                        # 遍历每条会话
        for s in rec:                          # 遍历会话中的每个店
            all_stores.add(s)                  # 加入全集，后面用于确定目标店铺及其字典序

    if not all_stores:                         # 若完全没有店铺（空输入或全是空会话）
        return {}                              # 按字典输出格式返回空 dict

    from collections import defaultdict        # 延迟导入（也可以放到文件顶部）
    from itertools import combinations         # 用于生成会话内的所有无序店铺对

    counts = defaultdict(lambda: defaultdict(int))  # 二层计数字典：counts[a][b] = a与b共现次数（默认0）
    for rec in records:                             # 再次遍历每条会话，做共现统计
        unique = list(set(rec))                     # 会话内去重：同一店在同一会话出现多次只算一次
        if len(unique) < 2:                         # 空会话或只有一个店的会话不产生“店铺对”
            continue
        for x, y in combinations(unique, 2):        # 为该会话生成所有无序不重复的店铺对
            counts[x][y] += 1                       # 双向计数：x与y共现+1
            counts[y][x] += 1                       # 让以后以任意一方为“目标店”都能直接读到邻居频次

    result = {}                                     # 准备输出的 dict：store -> 关联店名的有序列表
    for store in sorted(all_stores):                # 目标店铺按字典序（题目要求2）
        neighbors = counts[store]                   # 邻居频次表：neighbor -> freq
                                                    # 注意：defaultdict 即使之前没记录过也会给个空 dict
        if not neighbors:                           # 没有任何共现对象（如只有一个店多次出现的情况）
            result[store] = []                      # 该目标店对应空列表（题目示例2）
        else:
            sorted_neighbors = sorted(              # 对邻居排序（题目要求3）
                neighbors.items(),                  # 每个元素是 (店名, 次数)
                key=lambda kv: (-kv[1], kv[0])      # 先“次数降序”（负号），再“店名字典序升序”打破平手
            )
            result[store] = [name for name, _ in sorted_neighbors]  # 只保留店名，不带次数

    return result                                   # 返回字典格式的最终结果

