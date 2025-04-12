// 347. Top K Frequent Elements
// Solved
// Medium
// Topics
// Companies
// Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.

 

// Example 1:

// Input: nums = [1,1,1,2,2,3], k = 2
// Output: [1,2]
// Example 2:

// Input: nums = [1], k = 1
// Output: [1]
 

// Constraints:

// 1 <= nums.length <= 105
// -104 <= nums[i] <= 104
// k is in the range [1, the number of unique elements in the array].
// It is guaranteed that the answer is unique.
 

// Follow up: Your algorithm's time complexity must be better than O(n log n), where n is the array's size.


function topKFrequent(nums, k) {
    let frequencyMap = new Map()
        
    for (const num of nums){
      frequencyMap.set(num, ((frequencyMap.get(num) || 0) + 1))
    }

    let sortedMap = [...frequencyMap.entries()].sort((a,b)=> b[1] - a[1])

    return sortedMap.slice(0,k).map(e=>e[0])
}

// Example usage:
console.log(topKFrequent([1, 2, 2, 3, 3, 3], 2)); // Output: [2, 3]
console.log(topKFrequent([7, 7], 1)); // Output: [7]
