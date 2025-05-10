// 540. Single Element in a Sorted Array
// Medium
// Topics
// Companies
// You are given a sorted array consisting of only integers where every element appears exactly twice, except for one element which appears exactly once.

// Return the single element that appears only once.

// Your solution must run in O(log n) time and O(1) space.

 

// Example 1:

// Input: nums = [1,1,2,3,3,4,4,8,8]
// Output: 2
// Example 2:

// Input: nums = [3,3,7,7,10,11,11]
// Output: 10
 

// Constraints:

// 1 <= nums.length <= 105
// 0 <= nums[i] <= 105



const singleNonDuplicate = (nums) => {

    let left = 0;
    let right = nums.length - 1;

    while (left < right) {
        let mid = Math.floor((left + right) / 2);
        if (nums[mid] == nums[mid + 1]) mid--;
        //如果从 left 到 mid 这一段有 奇数个元素（说明单个元素在这一半），就把 right 移到 mid
        if ((mid - left + 1) % 2 != 0) right = mid;
        else left = mid + 1;
    }
    return nums[left];
};