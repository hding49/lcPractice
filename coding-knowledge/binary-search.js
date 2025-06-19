// 二分查找的时间复杂度核心逻辑是“每轮减半”，所以基础时间复杂度是 O(log n)

// binary search中为什么有的时候用while (left <= right) 有的时候用while (left < right)
 
// 标准二分查找，精确查找目标，闭区间 精确查找目标（e.g. 查找一个数）	标准 binary search 找某个 target
while (left <= right) {
  const mid = left + Math.floor((right - left) / 2);
  // ...
}

// 查找边界，区间左闭右开
while (left < right) {
  const mid = left + Math.floor((right - left) / 2);
  // ...
}

// 1. 标准二分查找 — 查找目标值是否存在
// 适用场景：查找有序数组中是否存在目标元素，返回索引，找不到返回 -1
function binarySearch(nums, target) {
  let left = 0;
  let right = nums.length - 1;

  // 循环条件是 left <= right，闭区间搜索
  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);

    if (nums[mid] === target) {
      return mid;
    } else if (nums[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return -1;
}


// 2. 查找第一个等于目标的元素（处理重复元素）
// 找到目标后，不立即返回，继续往左边找第一个满足条件的元素索引
function binarySearchFirst(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  let result = -1;

  // 闭区间搜索
  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);

    if (nums[mid] === target) {
      result = mid;
      right = mid - 1; // 继续往左找
    } else if (nums[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return result;
}


// 3. 查找第一个大于等于目标的元素（Lower Bound）
// 找满足条件的最小索引
function lowerBound(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  let result = -1;

  // 闭区间搜索
  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);

    if (nums[mid] >= target) {
      result = mid;
      right = mid - 1; // 继续往左收缩
    } else {
      left = mid + 1;
    }
  }

  return result;
}


// 4. 查找最后一个小于等于目标的元素（Upper Bound）
// 找满足条件的最大索引
function upperBound(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  let result = -1;

  // 闭区间搜索
  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);

    if (nums[mid] <= target) {
      result = mid;
      left = mid + 1; // 继续往右找
    } else {
      right = mid - 1;
    }
  }

  return result;
}


// 5. 使用 while (left < right) 的边界查找版本
// 适用于查找第一个大于等于 target 或最后一个小于等于 target 的元素
// 这里右边界为开区间，设为 nums.length

// 查找第一个大于等于目标的元素（Lower Bound）
function lowerBoundOpenInterval(nums, target) {
  let left = 0;
  let right = nums.length; // 右边界开区间

  // 循环条件是 left < right
  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);

    if (nums[mid] >= target) {
      right = mid; // 收缩右边界
    } else {
      left = mid + 1; // 收缩左边界
    }
  }

  // 循环结束时 left == right，指向第一个满足条件的位置
  return left;
}

// 查找最后一个小于等于目标的元素（Upper Bound）
function upperBoundOpenInterval(nums, target) {
  let left = 0;
  let right = nums.length;

  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);

    if (nums[mid] <= target) {
      left = mid + 1; // 往右查找更大的满足条件位置
    } else {
      right = mid; // 收缩右边界
    }
  }

  // left 指向第一个 > target 的位置
  // 所以最后一个 <= target 的索引是 left - 1
  return left - 1;
}
