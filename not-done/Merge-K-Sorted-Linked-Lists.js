// Merge K Sorted Linked Lists
// You are given an array of k linked lists lists, where each list is sorted in ascending order.

// Return the sorted linked list that is the result of merging all of the individual linked lists.

// Example 1:

// Input: lists = [[1,2,4],[1,3,5],[3,6]]

// Output: [1,1,2,3,3,4,5,6]
// Example 2:

// Input: lists = []

// Output: []
// Example 3:

// Input: lists = [[]]

// Output: []
// Constraints:

// 0 <= lists.length <= 1000
// 0 <= lists[i].length <= 100
// -1000 <= lists[i][j] <= 1000

var mergeTwoList = function(l1, l2){
    let dummy = new ListNode(0)
    let cur = dummy
    while(l1 && l2){
        if(l1.val < l2.val){
            cur.next = l1
            cur = cur.next
            l1 = l1.next
        }
        else{
            cur.next = l2
            cur = cur.next
            l2 = l2.next
        }
    }
    if(l1) cur.next = l1
    if(l2) cur.next = l2
    
    return dummy.next
}

var mergeKLists = function(lists){
   let root = lists[0]
   for(let i = 1; i < lists.length; i ++){
       root = mergeTwoList(root, lists[i])
   }
    return root || null
}



// Following Approach 3 from the solution set

// This uses MinPriorityQueue class from the datastructures-js library that is available in the LeetCode runtime. I would argue that since these datastructures are available in other languages I would not expect to have to write my own implementation in an interview and it should be sufficient to "stub" a class as long as I can explain the underlying data structure

// const mergeKLists = function(lists) {
//   const queue = new MinPriorityQueue({ priority: x => x.val })

//   for (const head of lists) {
//     if (head) {
//       queue.enqueue(head)
//     }
//   }

//   let result = new ListNode()
//   const head = result

//   while (!queue.isEmpty()) {
//     const { val, next } = queue.dequeue().element

//     result.next = new ListNode(val)
//     result = result.next

//     if (next) {
//       queue.enqueue(next)
//     }
//   }

//   return head.next
// }