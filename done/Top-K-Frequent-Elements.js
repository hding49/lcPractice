// Top K Frequent Elements
// Given an integer array nums and an integer k, return the k most frequent elements within the array.

// The test cases are generated such that the answer is always unique.

// You may return the output in any order.

// Example 1:

// Input: nums = [1,2,2,3,3,3], k = 2

// Output: [2,3]
// Example 2:

// Input: nums = [7,7], k = 1

// Output: [7]
// Constraints:

// 1 <= nums.length <= 10^4.
// -1000 <= nums[i] <= 1000
// 1 <= k <= number of distinct elements in nums.


function topKFrequent(nums, k) {
    const frequencyMap = new Map();

    // Count the frequency of each element in the array
    for (const num of nums) {
        frequencyMap.set(num, (frequencyMap.get(num) || 0) + 1);
    }

    // Create an array of the elements sorted by frequency in descending order
    const sortedElements = [...frequencyMap.entries()].sort((a, b) => b[1] - a[1]);

    // Extract the top k elements
    return sortedElements.slice(0, k).map(entry => entry[0]);
}

// Example usage:
console.log(topKFrequent([1, 2, 2, 3, 3, 3], 2)); // Output: [2, 3]
console.log(topKFrequent([7, 7], 1)); // Output: [7]