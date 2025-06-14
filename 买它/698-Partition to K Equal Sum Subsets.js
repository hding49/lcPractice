// 698. Partition to K Equal Sum Subsets
// Medium
// Topics
// Companies
// Hint
// Given an integer array nums and an integer k, return true if it is possible to divide this array into k non-empty subsets whose sums are all equal.

 

// Example 1:

// Input: nums = [4,3,2,3,5,2,1], k = 4
// Output: true
// Explanation: It is possible to divide it into 4 subsets (5), (1, 4), (2,3), (2,3) with equal sums.
// Example 2:

// Input: nums = [1,2,3,4], k = 3
// Output: false
 

// Constraints:

// 1 <= k <= nums.length <= 16
// 1 <= nums[i] <= 104
// The frequency of each element is in the range [1, 4].


function canPartitionKSubsets(nums, k) {
    const totalSum = nums.reduce((a, b) => a + b, 0);
    if (totalSum % k !== 0) return false;

    const target = totalSum / k;
    nums.sort((a, b) => b - a);  // 优化：先放大数

    const buckets = new Array(k).fill(0);

    function backtrack(index) {
        if (index === nums.length) {
            return buckets.every(bucket => bucket === target);
        }

        for (let i = 0; i < k; i++) {
            if (buckets[i] + nums[index] > target) continue;


            //典型的回溯（backtracking）思想 —— 试、错、退回再试下一个。
            //先尝试把当前值放入桶中，进行递归；如果递归返回 false，就撤销这一步，回到之前的状态，继续尝试别的桶或路径。
            buckets[i] += nums[index];
            if (backtrack(index + 1)) return true;
            buckets[i] -= nums[index];

            // 剪枝：如果当前桶是空的，放失败了就不用试后面的空桶了
            if (buckets[i] === 0) break;
        }

        return false;
    }

    return backtrack(0);
}
