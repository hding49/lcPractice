// Merge Two Sorted Linked Lists
// You are given the heads of two sorted linked lists list1 and list2.

// Merge the two lists into one sorted linked list and return the head of the new sorted linked list.

// The new list should be made up of nodes from list1 and list2.

// Example 1:



// Input: list1 = [1,2,4], list2 = [1,3,5]

// Output: [1,1,2,3,4,5]
// Example 2:

// Input: list1 = [], list2 = [1,2]

// Output: [1,2]
// Example 3:

// Input: list1 = [], list2 = []

// Output: []
// Constraints:

// 0 <= The length of the each list <= 100.
// -100 <= Node.val <= 100

var mergeTwoLists = function(l1, l2) {
    let dummy = new ListNode(0)
    let curr = dummy
    while(l1 !=null && l2 != null){
        if(l1.val < l2.val){
            curr.next = l1
            curr = curr.next
            l1 = l1.next
        }else{
            curr.next = l2
            curr = curr.next
            l2 = l2.next
        }
    }
    if(l1 == null){
        curr.next = l2
    }

    if(l2 == null){
        curr.next = l1
    }

    return dummy.next
};