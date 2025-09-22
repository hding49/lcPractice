


# 题目意思（总结）

# 要实现一个不可变（immutable）、持久化（persistent）的栈 PStack。

# 核心要求：

# 不可变：每次 push 或 pop 都会返回一个新的栈实例，而不会修改旧的栈。

# 意味着你可以同时保留历史版本。

# 持久化：不同版本之间尽量共享结构，而不是每次都复制整个栈。

# 复杂度：push、pop、peek、size 都必须是 O(1)。

# Follow up：再实现一个 reverse()，把栈倒置，但允许是 O(n)。

# 换句话说：这是典型的函数式数据结构题，考察对“结构共享”+“不可变”的理解。

class PStack:
    def __init__(self, val=None, nxt=None, size=0):
        self._val = val
        self._next = nxt
        self._size = size

    def is_empty(self):
        return self._size == 0

    def size(self):
        return self._size

    def peek(self):
        if self.is_empty():
            raise IndexError("peek from empty stack")
        return self._val

    def push(self, x):
        return PStack(x, self, self._size + 1)

    def pop(self):
        if self.is_empty():
            raise IndexError("pop from empty stack")
        return self._next or PStack()
        
    def reverse(self):
        cur, res = self, PStack()
        while not cur.is_empty():
            res, cur = res.push(cur.peek()), cur.pop()
        return res

# This code uses a singly linked list (also called a cons list) as the shared data structure.

# Principle

# Each PStack object is essentially a node:

# _val stores the current element.

# _next points to the previous version of the stack.

# _size stores the current length of the stack.

# When you call push(x), a new node is created.

# Its _val is x.

# Its _next points to the old stack.

# This means the old stack remains unchanged, and the new stack reuses all the old nodes underneath.

# When you call pop(), it simply returns _next, which is the previous version of the stack.

# Why this works

# Data sharing: Old nodes are never copied or mutated. Multiple versions of the stack share the same linked structure.

# Efficiency: Both push and pop only create or return a single node, so they run in O(1) time.

# Persistence: Since old versions are never modified, they all remain valid and can coexist with the new versions.