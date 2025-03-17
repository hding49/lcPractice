// Remove Node From End of Linked List
// You are given the beginning of a linked list head, and an integer n.

// Remove the nth node from the end of the list and return the beginning of the list.

// Example 1:

// Input: head = [1,2,3,4], n = 2

// Output: [1,2,4]
// Example 2:

// Input: head = [5], n = 1

// Output: []
// Example 3:

// Input: head = [1,2], n = 2

// Output: [2]
// Constraints:

// The number of nodes in the list is sz.
// 1 <= sz <= 30
// 0 <= Node.val <= 100
// 1 <= n <= sz

var removeNthFromEnd = function(head, n) {
    dummy = new ListNode(0);
    dummy.next = head;
    first = dummy;
    second = dummy;
    
    for (i = 1; i <= n + 1; i++) {
        first = first.next;
    } 
    
    while (first != null) {
        first = first.next;
        second = second.next;
    }
    second.next = second.next.next;
    return dummy.next;
};