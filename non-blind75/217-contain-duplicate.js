// Contains Duplicate
// Given an integer array nums, return true if any value appears more than once in the array, otherwise return false.

// Example 1:

// Input: nums = [1, 2, 3, 3]

// Output: true

// Example 2:

// Input: nums = [1, 2, 3, 4]

// Output: false

var containsDuplicate = function(nums) {
    return new Set(nums).size !== nums.length;
};

var containsDuplicate = function(nums) {
    let list = new Set()
    for(let i = 0; i < nums.length; i++){
        if(list.has(nums[i])) return true
        else list.add(nums[i])
    }
    return false
};