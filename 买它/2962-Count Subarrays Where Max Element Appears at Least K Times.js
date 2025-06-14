// 2962. Count Subarrays Where Max Element Appears at Least K Times
// Solved
// Medium
// Topics
// Companies
// You are given an integer array nums and a positive integer k.

// Return the number of subarrays where the maximum element of nums appears at least k times in that subarray.

// A subarray is a contiguous sequence of elements within an array.

 

// Example 1:

// Input: nums = [1,3,2,3,3], k = 2
// Output: 6
// Explanation: The subarrays that contain the element 3 at least 2 times are: [1,3,2,3], [1,3,2,3,3], [3,2,3], [3,2,3,3], [2,3,3] and [3,3].
// Example 2:

// Input: nums = [1,4,2,1], k = 3
// Output: 0
// Explanation: No subarray contains the element 4 at least 3 times.
 

// Constraints:

// 1 <= nums.length <= 105
// 1 <= nums[i] <= 106
// 1 <= k <= 105


/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var countSubarrays = function(nums, k) {
    let max = Math.max(...nums);
    let left = 0, count = 0, maxCount = 0;

    for(let right = 0;  right < nums.length; right++){
       if(nums[right] === max) maxCount++;

       while(maxCount >= k){
        //那么从 left 开始，到 right 结尾的子数组，所有右端扩展到末尾的子数组都是合法的。
//         因为以当前位置 right 为子数组的右端点，你可以形成：

// [left, right]

// [left, right + 1]

// ...

// [left, nums.length - 1]

// 也就是说，共有 nums.length - right 个合法的子数组。
        count+=nums.length - right;
        //如果左边界的元素是最大值，那么就要把它的计数减去
        if(nums[left] === max) maxCount--;
        left++;
       } 
    }

    return count;
};