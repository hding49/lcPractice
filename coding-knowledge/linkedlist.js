/*
链表（Linked List）基础总结

链表是一种数据结构，由节点（Node）组成，每个节点包含数据和指向下一个节点的指针（next）。
链表结构灵活，插入和删除操作高效，常见的类型有单链表、双向链表、循环链表。

下面是单链表的基础定义和几个常用操作示例。
*/

// 定义链表节点结构
class ListNode {
  constructor(val = 0, next = null) {
    this.val = val;   // 节点值
    this.next = next; // 指向下一个节点的指针
  }
}

// 1. 创建链表 — 从数组生成链表
function createLinkedList(arr) {
  if (arr.length === 0) return null;

  let head = new ListNode(arr[0]);
  let current = head;

  for (let i = 1; i < arr.length; i++) {
    current.next = new ListNode(arr[i]);
    current = current.next;
  }

  return head;
}

// 2. 遍历链表 — 打印链表所有节点的值
function printLinkedList(head) {
  let current = head;
  const values = [];

  while (current !== null) {
    values.push(current.val);
    current = current.next;
  }

  console.log(values.join(' -> '));
}

// 3. 链表反转 — 迭代法
function reverseLinkedList(head) {
  let prev = null;   // 前驱节点，初始为空
  let current = head;

  while (current !== null) {
    const nextTemp = current.next; // 先保存下一个节点
    current.next = prev;           // 当前节点指向前驱，实现反转
    prev = current;                // 前驱向前移动
    current = nextTemp;            // 当前节点向前移动
  }

  // prev 最终是新链表头
  return prev;
}

// 4. 链表反转 — 递归法
function reverseLinkedListRecursive(head) {
  if (head === null || head.next === null) return head;

  const newHead = reverseLinkedListRecursive(head.next);

  head.next.next = head;  // 下一个节点指向当前节点，实现反转
  head.next = null;       // 当前节点断开指向，避免循环

  return newHead;
}

/*
总结：
- 链表节点通过 next 指针连接
- 创建链表：顺序连接节点
- 遍历链表：从头节点开始，沿 next 访问
- 反转链表：迭代时逐步改变 next 指针方向，递归时利用调用栈
- 注意边界条件（空链表、单节点链表）
*/

// 示例演示
const arr = [1, 2, 3, 4, 5];
let head = createLinkedList(arr);
printLinkedList(head);         // 输出: 1 -> 2 -> 3 -> 4 -> 5

head = reverseLinkedList(head);
printLinkedList(head);         // 输出: 5 -> 4 -> 3 -> 2 -> 1

head = reverseLinkedListRecursive(head);
printLinkedList(head);         // 输出: 1 -> 2 -> 3 -> 4 -> 5
