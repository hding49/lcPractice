
# 题目总结（精炼版）

# 设计一个不可变、**持久化（persistent）**的栈 PStack：

# push(x)/pop() 都返回新的 PStack 实例，旧的实例不变、可继续访问。

# 所有版本共享底层结构（structural sharing），从而在 push/pop 时只创建/丢弃一个“结点”。

# 复杂度要求：

# push, pop, peek, size：O(1)

# reverse()（follow up）：O(n) 时间，O(n) 额外空间（产生一个新栈），使用多版本共享不影响旧版本。

# 关键思路

# 把栈表示为不可变单链表（cons-list）：
# 每次 push(x) 创建一个新结点，next 指向旧栈；pop() 直接返回 next；peek() 读头部值；size 作为字段缓存在结点里以保证 O(1)。

from dataclasses import dataclass
from typing import Optional, Iterable, Iterator

@dataclass(frozen=True)
class PStack:
    """Persistent, immutable stack with O(1) push/pop/peek/size."""
    _value: Optional[int] = None
    _next: Optional["PStack"] = None
    _size: int = 0

    # --- Constructors ---
    @staticmethod
    def empty() -> "PStack":
        return PStack()

    @staticmethod
    def from_iterable(it: Iterable[int]) -> "PStack":
        # Build top at the right (i.e., last item becomes top) => push in order
        s = PStack.empty()
        for x in it:
            s = s.push(x)
        return s

    # --- Core ops (all O(1)) ---
    def size(self) -> int:
        return self._size

    def is_empty(self) -> bool:
        return self._size == 0

    def peek(self) -> int:
        if self.is_empty():
            raise IndexError("peek from empty PStack")
        return self._value  # type: ignore

    def push(self, x: int) -> "PStack":
        # New node sharing current stack as next
        return PStack(x, self, self._size + 1)

    def pop(self) -> "PStack":
        if self.is_empty():
            raise IndexError("pop from empty PStack")
        # Return tail; safe because we never mutate nodes
        return self._next if self._next is not None else PStack.empty()

    # --- Follow-up: reverse (O(n)) ---
    def reverse(self) -> "PStack":
        cur = self
        res = PStack.empty()
        while not cur.is_empty():
            res = res.push(cur.peek())
            cur = cur.pop()
        return res

    # --- Utilities ---
    def to_list(self) -> list[int]:
        # Top at index 0 to match stack's visual [top,...,bottom]
        out = []
        cur = self
        while not cur.is_empty():
            out.append(cur.peek())
            cur = cur.pop()
        return out

    def __iter__(self) -> Iterator[int]:
        cur = self
        while not cur.is_empty():
            yield cur.peek()
            cur = cur.pop()



if __name__ == "__main__":
    s1 = PStack.empty()
    s2 = s1.push(10)
    s3 = s2.push(20).push(30)
    assert s1.to_list() == []
    assert s2.to_list() == [10]
    assert s3.to_list() == [30, 20, 10]
    assert s3.size() == 3 and s3.peek() == 30

    s4 = s3.pop()
    assert s4.to_list() == [20, 10]
    assert s3.to_list() == [30, 20, 10]  # 旧版本未被修改（持久化）

    sr = s3.reverse()
    assert sr.to_list() == [10, 20, 30]