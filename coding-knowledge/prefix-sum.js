/*
前缀和（Prefix Sum）总结

前缀和数组是一个辅助数组，用来快速计算区间和。
它的第 i 个元素表示原数组从开头到第 i 个元素的累加和。

核心思想：
- prefixSum[i] = nums[0] + nums[1] + ... + nums[i - 1]
- 区间和 [left, right] = prefixSum[right + 1] - prefixSum[left]

用途：
- 快速计算任意区间和，时间复杂度 O(1)
- 解决数组求和、区间统计等问题
*/

// 1. 计算前缀和数组
function buildPrefixSum(nums) {
  const prefixSum = new Array(nums.length + 1).fill(0);
  for (let i = 0; i < nums.length; i++) {
    prefixSum[i + 1] = prefixSum[i] + nums[i];
  }
  return prefixSum;
}

// 示例：计算区间和 [left, right]
function rangeSum(prefixSum, left, right) {
  // 利用前缀和数组计算区间和
  return prefixSum[right + 1] - prefixSum[left];
}

// 例子演示：
const nums = [1, 2, 3, 4, 5];
const prefixSum = buildPrefixSum(nums);
// 求 nums[1..3] = nums[1] + nums[2] + nums[3] = 2 + 3 + 4 = 9
console.log(rangeSum(prefixSum, 1, 3)); // 输出 9

/*
总结：
- prefixSum 长度为 nums.length + 1，prefixSum[0] = 0，方便计算区间和
- 查询任意区间和时间复杂度 O(1)
- 适合多次区间和查询场景，预处理一步搞定
- 变种包括二维前缀和、差分数组等
*/
