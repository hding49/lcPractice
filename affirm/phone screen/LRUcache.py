from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity):
        self.cache = OrderedDict()
        self.capacity = capacity

    def get(self, key):
        if key not in self.cache:
            return -1
        # move to end (表示最近使用过)
        value = self.cache.pop(key)
        self.cache[key] = value
        return value

    def put(self, key, value):
        if key in self.cache:
            self.cache.pop(key)
        elif len(self.cache) >= self.capacity:
            # popitem(last=False) 弹出最早插入的 (最久未使用的)
            self.cache.popitem(last=False)
        self.cache[key] = value

# 时间复杂度：get 和 put 都是 O(1) 平均复杂度。

# 空间复杂度：O(capacity)，存储最多 capacity 个键值对。