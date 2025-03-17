// Longest Consecutive Sequence
// Given an array of integers nums, return the length of the longest consecutive sequence of elements that can be formed.

// A consecutive sequence is a sequence of elements in which each element is exactly 1 greater than the previous element. The elements do not have to be consecutive in the original array.

// You must write an algorithm that runs in O(n) time.

// Example 1:

// Input: nums = [2,20,4,10,3,4,5]

// Output: 4
// Explanation: The longest consecutive sequence is [2, 3, 4, 5].

// Example 2:

// Input: nums = [0,3,2,5,4,6,1,1]

// Output: 7
// Constraints:

// 0 <= nums.length <= 1000
// -10^9 <= nums[i] <= 10^9

var longestConsecutive = function(nums) {
    if(nums.length === 0) return 0
    let list = nums.sort((a,b) => a-b)
    let max = 0, count = 1

    for(let i = 0; i < list.length; i ++){

        if(list[i] === list[i-1] + 1){
            count ++
            max = Math.max(max, count)
        }
        else if(list[i] == list[i-1]) continue  
        else{    
            count = 1
        }
        
    }

    return Math.max(max, count);
};