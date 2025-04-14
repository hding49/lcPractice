// Reorder Linked List
// You are given the head of a singly linked-list.

// The positions of a linked list of length = 7 for example, can intially be represented as:

// [0, 1, 2, 3, 4, 5, 6]

// Reorder the nodes of the linked list to be in the following order:

// [0, 6, 1, 5, 2, 4, 3]

// Notice that in the general case for a list of length = n the nodes are reordered to be in the following order:

// [0, n-1, 1, n-2, 2, n-3, ...]

// You may not modify the values in the list's nodes, but instead you must reorder the nodes themselves.

// Example 1:

// Input: head = [2,4,6,8]

// Output: [2,8,4,6]
// Example 2:

// Input: head = [2,4,6,8,10]

// Output: [2,10,4,8,6]
// Constraints:

// 1 <= Length of the list <= 1000.
// 1 <= Node.val <= 1000


var reorderList = function(head) {
    if (!head || !head.next) return;

    // 1. 使用快慢指针找到链表中点
    let slow = head, fast = head;
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
    }

    // 2. 反转后半部分链表
    let prev = null, curr = slow.next;
    slow.next = null; // 断开前后两部分
    while (curr) {
        let temp = curr.next;
        curr.next = prev;
        prev = curr;
        curr = temp;
    }

    // 3. 交替合并前后两部分
    let first = head, second = prev;
    while (second) {
        let temp1 = first.next, temp2 = second.next;
        first.next = second;
        second.next = temp1;
        first = temp1;
        second = temp2;
    }
};
