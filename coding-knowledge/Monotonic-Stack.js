/*
单调栈（Monotonic Stack）总结

单调栈是一种特殊的栈，栈内元素保持单调递增或递减。
它常用于解决“下一个更大元素”、“下一个更小元素”等问题，
以及求区间最大/最小值相关问题。

核心思路：
1. 遍历数组元素，当前元素对比栈顶元素决定是否弹出栈顶。
2. 维护栈的单调性（递增或递减）。
3. 弹出时记录结果，因为当前元素是栈顶元素的“下一个更大/更小”元素。
*/

// 示例1：寻找数组中每个元素的下一个更大元素（Next Greater Element）
function nextGreaterElements(nums) {
  const n = nums.length;
  const result = Array(n).fill(-1);  // 结果数组，默认-1表示无更大元素
  const stack = [];  // 单调递减栈，栈内存放索引，nums[栈顶] 是栈内最大元素

  for (let i = 0; i < n; i++) {
    // 如果当前元素比栈顶元素大，说明找到了栈顶元素的下一个更大元素
    while (stack.length && nums[i] > nums[stack[stack.length - 1]]) {
      const idx = stack.pop();    // 弹出栈顶索引
      result[idx] = nums[i];      // 更新弹出元素的下一个更大元素
    }
    stack.push(i); // 当前元素入栈
  }
  // 栈中剩余元素没有更大元素，结果保持为-1
  return result;
}

/*
说明：
- 使用索引入栈，方便定位结果。
- 栈内元素保持递减顺序，保证栈顶元素对应的数值最大。
- 当遇到更大元素时，依次弹出所有比当前元素小的栈顶元素并更新结果。
*/

// 示例2：寻找数组中每个元素的下一个更小元素（Next Smaller Element）
function nextSmallerElements(nums) {
  const n = nums.length;
  const result = Array(n).fill(-1); // 默认-1表示无更小元素
  const stack = []; // 单调递增栈，栈内元素对应值递增

  for (let i = 0; i < n; i++) {
    // 当前元素比栈顶元素小，弹出栈顶，更新结果
    while (stack.length && nums[i] < nums[stack[stack.length - 1]]) {
      const idx = stack.pop();
      result[idx] = nums[i];
    }
    stack.push(i);
  }
  return result;
}

/*
应用场景总结：
- 单调递减栈：解决“下一个更大元素”、“最大矩形面积”等问题。
- 单调递增栈：解决“下一个更小元素”等问题。
- 栈内存索引，方便更新结果。
- 时间复杂度为 O(n)，每个元素最多进出栈一次。
*/

// 如果你想要，我可以帮你写一个“柱状图最大矩形面积”的单调栈完整代码示例
