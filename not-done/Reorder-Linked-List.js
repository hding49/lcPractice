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
    let stack = []
    let node = head
    if(!node) return
    while(node){
        stack.push(node)
        node = node.next
    }
    let len = stack.length
    node= head
    for(let i = 0; i < len; i ++){
        if(i % 2 == 0){
            node.next = stack.shift()
        }
        else{
            node.next = stack.pop()
        }
         node = node.next
    }
    node.next = null
};