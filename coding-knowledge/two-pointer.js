/*
Two Pointers（双指针）总结

双指针通常用在有序数组、字符串或链表等结构中，帮助我们用线性时间解决问题。  
双指针可以分为两种常见模式：

1. 左右指针（two pointers from both ends）  
2. 快慢指针（fast and slow pointers）

*/

// 1. 左右指针 — 判断有序数组是否存在两数之和为 target
// 典型题目：Two Sum II - Input array is sorted
function twoSumSorted(nums, target) {
  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    const sum = nums[left] + nums[right];

    if (sum === target) {
      return [left, right];
    } else if (sum < target) {
      left++;  // 需要更大值，左指针右移
    } else {
      right--; // 需要更小值，右指针左移
    }
  }

  return [-1, -1]; // 没有满足条件的结果
}

// 说明：左右指针适用于有序数组，从两端向中间移动缩小搜索空间，时间复杂度 O(n)


// 2. 快慢指针 — 删除数组中重复元素（保留一个）
// 典型题目：Remove Duplicates from Sorted Array
function removeDuplicates(nums) {
  if (nums.length === 0) return 0;

  let slow = 0;  // 慢指针，维护新数组的最后一个索引
  for (let fast = 1; fast < nums.length; fast++) {
    if (nums[fast] !== nums[slow]) {
      slow++;
      nums[slow] = nums[fast]; // 将不同元素覆盖到 slow + 1 位置
    }
  }

  return slow + 1; // 返回新数组长度
}

// 说明：快慢指针适合处理“数组/链表原地修改”的问题，时间复杂度 O(n)


// 3. 快慢指针 — 判断链表是否有环
// 典型题目：Linked List Cycle
function hasCycle(head) {
  if (!head || !head.next) return false;

  let slow = head;
  let fast = head.next;

  while (fast && fast.next) {
    if (slow === fast) {
      return true; // 快慢指针相遇，说明有环
    }
    slow = slow.next;
    fast = fast.next.next;
  }

  return false; // 快指针走到链表尾部，无环
}

// 说明：快慢指针用于链表检测环，快指针每次走两步，慢指针每次走一步

// 4. 滑动窗口（Sliding Window） — 求字符串中无重复字符的最长子串
// 结合双指针技巧，左右指针动态维护窗口边界
function lengthOfLongestSubstring(s) {
  let left = 0, right = 0;
  let maxLen = 0;
  const map = new Map();

  while (right < s.length) {
    const c = s[right];
    map.set(c, (map.get(c) || 0) + 1);

    // 如果窗口内有重复字符，移动左指针收缩窗口
    while (map.get(c) > 1) {
      const leftChar = s[left];
      map.set(leftChar, map.get(leftChar) - 1);
      left++;
    }

    maxLen = Math.max(maxLen, right - left + 1);
    right++;
  }

  return maxLen;
}

// 说明：滑动窗口结合双指针，解决连续区间相关问题，时间复杂度 O(n)

