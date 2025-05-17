// 234. Palindrome Linked List
// Easy
// Topics
// Companies
// Given the head of a singly linked list, return true if it is a palindrome or false otherwise.

 

// Example 1:


// Input: head = [1,2,2,1]
// Output: true
// Example 2:


// Input: head = [1,2]
// Output: false
 

// Constraints:

// The number of nodes in the list is in the range [1, 105].
// 0 <= Node.val <= 9
 

// Follow up: Could you do it in O(n) time and O(1) space?


var isPalindrome = function(head) {
    if (!head || !head.next) return true;

    // Step 1: Find the middle using slow and fast pointers
    let slow = head, fast = head;
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
    }

    // Step 2: Reverse the second half
    let prev = null;
    while (slow) {
        let nextTemp = slow.next;
        slow.next = prev;
        prev = slow;
        slow = nextTemp;
    }

    // Step 3: Compare both halves
    let left = head, right = prev;
    while (right) {
        if (left.val !== right.val) return false;
        left = left.next;
        right = right.next;
    }

    return true;
};
