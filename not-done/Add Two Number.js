// Add Two Numbers
// You are given two non-empty linked lists, l1 and l2, where each represents a non-negative integer.

// The digits are stored in reverse order, e.g. the number 123 is represented as 3 -> 2 -> 1 -> in the linked list.

// Each of the nodes contains a single digit. You may assume the two numbers do not contain any leading zero, except the number 0 itself.

// Return the sum of the two numbers as a linked list.

// Example 1:



// Input: l1 = [1,2,3], l2 = [4,5,6]

// Output: [5,7,9]

// Explanation: 321 + 654 = 975.
// Example 2:

// Input: l1 = [9], l2 = [9]

// Output: [8,1]
// Constraints:

// 1 <= l1.length, l2.length <= 100.
// 0 <= Node.val <= 9

var addTwoNumbers = function(l1, l2) {
    let dummy = new ListNode(0)
    let curr = dummy
    let carry = 0
    while(l1 != null || l2 != null){
        let x = l1 != null ? l1.val : 0
        let y = l2 != null ? l2.val : 0
        let sum = x + y + carry
        carry = sum >=10 ? 1 : 0
        curr.next = new ListNode(sum % 10)
        curr = curr.next
        
        if(l1 != null) l1 = l1.next
        if(l2 != null) l2 = l2.next
    }
    if(carry > 0){
        curr.next = new ListNode(carry)
    }
    return dummy.next
};