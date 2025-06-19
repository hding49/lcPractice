/*
回溯（Backtracking）总结

回溯是一种基于递归的搜索算法，用于遍历所有可能的解空间，
通过“选择-递归-撤销选择”三步反复试探，寻找满足条件的解。

核心思想：
1. 选择一个可能的选项，加入当前路径
2. 递归深入探索下一步
3. 回溯，撤销当前选择，尝试其他选项

适用场景：
- 组合问题（如组合、子集）
- 排列问题（如全排列）
- 分割问题（如字符串分割）
- 约束满足问题（如数独）

*/

// 模板示例：求所有数字的子集（Subset）
function subsets(nums) {
  const res = [];
  const path = [];

  // start表示下一步搜索的起点索引，避免重复
  function backtrack(start) {
    // 每次递归都把当前路径加入结果（包含空集）
    res.push([...path]);

    for (let i = start; i < nums.length; i++) {
      // 选择 nums[i]
      path.push(nums[i]);

      // 递归下一步，从 i + 1 继续选
      backtrack(i + 1);

      // 撤销选择，回溯
      path.pop();
    }
  }

  backtrack(0);
  return res;
}

/*
解释：
- path 用于存储当前选择的元素组合
- 每次递归将当前 path 复制存入结果
- 通过 start 避免重复选择之前的元素，保证组合不重复
- 递归和回溯的核心是“添加-递归-删除”
*/


// 模板示例2：全排列（Permutation）
function permute(nums) {
  const res = [];
  const path = [];
  const used = new Array(nums.length).fill(false);

  function backtrack() {
    if (path.length === nums.length) {
      res.push([...path]);
      return;
    }

    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;  // 跳过已选择的元素

      // 选择 nums[i]
      used[i] = true;
      path.push(nums[i]);

      backtrack();

      // 撤销选择，回溯
      path.pop();
      used[i] = false;
    }
  }

  backtrack();
  return res;
}

/*
解释：
- used 数组记录元素是否被使用，防止重复选择
- 每次递归尝试所有未被选择的元素
- 完成一条路径时，将其加入结果
*/


// 模板总结：回溯核心步骤
/*
function backtrack(参数...) {
  if (终止条件) {
    // 处理结果
    return;
  }

  for (所有可选项) {
    // 做选择
    ...

    // 递归
    backtrack(...);

    // 撤销选择，回溯
    ...
  }
}
*/

