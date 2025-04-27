// 253. Meeting Rooms II
// Medium
// Topics
// Companies
// Hint
// Given an array of meeting time intervals intervals where intervals[i] = [starti, endi], return the minimum number of conference rooms required.

 

// Example 1:

// Input: intervals = [[0,30],[5,10],[15,20]]
// Output: 2
// Example 2:

// Input: intervals = [[7,10],[2,4]]
// Output: 1
 

// Constraints:

// 1 <= intervals.length <= 104
// 0 <= starti < endi <= 106


function minMeetingRooms(intervals) {
    const start = intervals.map(i => i[0]).sort((a, b) => a - b);
    const end = intervals.map(i => i[1]).sort((a, b) => a - b);
    
    let res = 0, count = 0, s = 0, e = 0;
    while (s < intervals.length) {
        if (start[s] < end[e]) {
            s++;
            count++;
        } else {
            e++;
            count--;
        }
        res = Math.max(res, count);
    }
    return res;
}