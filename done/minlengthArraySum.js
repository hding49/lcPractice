// 209. Minimum Size Subarray Sum
// Solved
// Medium
// Topics
// Companies
// Given an array of positive integers nums and a positive integer target, return the minimal length of a 
// subarray
//  whose sum is greater than or equal to target. If there is no such subarray, return 0 instead.

 

// Example 1:

// Input: target = 7, nums = [2,3,1,2,4,3]
// Output: 2
// Explanation: The subarray [4,3] has the minimal length under the problem constraint.
// Example 2:

// Input: target = 4, nums = [1,4,4]
// Output: 1
// Example 3:

// Input: target = 11, nums = [1,1,1,1,1,1,1,1]
// Output: 0
 

// Constraints:

// 1 <= target <= 109
// 1 <= nums.length <= 105
// 1 <= nums[i] <= 104
 

// Follow up: If you have figured out the O(n) solution, try coding another solution of which the time complexity is O(n log(n)).


var minSubArrayLen = function(target, nums) {
    let left = 0;
    let minLength = Infinity;
    let sum = 0;

    for (let right = 0; right < nums.length; right ++){
        sum += nums[right]
        while (sum >= target){
           minLength = Math.min(minLength, right - left + 1)
           sum-= nums[left]
           left++
        }
    }
    return minLength === Infinity ? 0: minLength;
};

// another solution of which the time complexity is O(n log(n))
// function minSubArrayLen(target, nums) {
//     const n = nums.length;
//     const prefixSum = new Array(n + 1).fill(0);

//     for (let i = 1; i <= n; i++) {
//         prefixSum[i] = prefixSum[i - 1] + nums[i - 1];
//     }

//     let minLength = Infinity;

//     for (let i = 1; i <= n; i++) {
//         const toFind = prefixSum[i - 1] + target;
//         let left = i, right = n;

//         while (left <= right) {
//             const mid = Math.floor((left + right) / 2);
//             if (prefixSum[mid] >= toFind) {
//                 minLength = Math.min(minLength, mid - (i - 1));
//                 right = mid - 1;
//             } else {
//                 left = mid + 1;
//             }
//         }
//     }

//     return minLength === Infinity ? 0 : minLength;
// }

// // Example usage:
// console.log(minSubArrayLen(7, [2, 3, 1, 2, 4, 3])); // Output: 2
// console.log(minSubArrayLen(4, [1, 4, 4])); // Output: 1
// console.log(minSubArrayLen(11, [1, 1, 1, 1, 1, 1, 1, 1])); // Output: 0