
// Code
// Testcase
// Test Result
// Test Result
// 75. Sort Colors
// Medium
// Topics
// Companies
// Hint
// Given an array nums with n objects colored red, white, or blue, sort them in-place so that objects of the same color are adjacent, with the colors in the order red, white, and blue.

// We will use the integers 0, 1, and 2 to represent the color red, white, and blue, respectively.

// You must solve this problem without using the library's sort function.

 

// Example 1:

// Input: nums = [2,0,2,1,1,0]
// Output: [0,0,1,1,2,2]
// Example 2:

// Input: nums = [2,0,1]
// Output: [0,1,2]
 

// Constraints:

// n == nums.length
// 1 <= n <= 300
// nums[i] is either 0, 1, or 2.
 

// Follow up: Could you come up with a one-pass algorithm using only constant extra space?

var sortColors = function(nums) {
    let red = 0;
    let white = 0;
    let blue = nums.length - 1;
    
    while (white <= blue) {
        if (nums[white] === 0) {
            [nums[white], nums[red]] = [nums[red], nums[white]];
            red++;
            white++;
        } else if (nums[white] === 1) {
            white++;
        } else {
            [nums[white], nums[blue]] = [nums[blue], nums[white]];
            blue--;
        }
    }
};
