// Merge Intervals
// Given an array of intervals where intervals[i] = [start_i, end_i], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.

// You may return the answer in any order.

// Note: Intervals are non-overlapping if they have no common point. For example, [1, 2] and [3, 4] are non-overlapping, but [1, 2] and [2, 3] are overlapping.

// Example 1:

// Input: intervals = [[1,3],[1,5],[6,7]]

// Output: [[1,5],[6,7]]
// Example 2:

// Input: intervals = [[1,2],[2,3]]

// Output: [[1,3]]
// Constraints:

// 1 <= intervals.length <= 1000
// intervals[i].length == 2
// 0 <= start <= end <= 1000

var merge = function (intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  const merged = [];
  let prev = intervals[0];

  for (let i = 1; i < intervals.length; i++) {
    let interval = intervals[i];
    if (interval[0] <= prev[1]) {
      prev[1] = Math.max(prev[1], interval[1]);
    } else {
      merged.push(prev);
      prev = interval;
    }
  }

  merged.push(prev);
  return merged;
};

// Non-overlapping Intervals
// Given an array of intervals intervals where intervals[i] = [start_i, end_i], return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.

// Note: Intervals are non-overlapping even if they have a common point. For example, [1, 3] and [2, 4] are overlapping, but [1, 2] and [2, 3] are non-overlapping.

// Example 1:

// Input: intervals = [[1,2],[2,4],[1,4]]

// Output: 1
// Explanation: After [1,4] is removed, the rest of the intervals are non-overlapping.

// Example 2:

// Input: intervals = [[1,2],[2,4]]

// Output: 0
// Constraints:

// 1 <= intervals.length <= 1000
// intervals[i].length == 2
// -50000 <= starti < endi <= 50000

var eraseOverlapIntervals = function (intervals) {
  let res = 0;
  intervals.sort((a, b) => a[1] - b[1]);
  let prev_end = intervals[0][1];

  for (let i = 1; i < intervals.length; i++) {
    if (prev_end > intervals[i][0]) {
      res++;
    } else {
      prev_end = intervals[i][1];
    }
  }

  return res;
};
