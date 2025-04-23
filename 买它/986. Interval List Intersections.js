// 986. Interval List Intersections
// Medium
// Topics
// Companies
// You are given two lists of closed intervals, firstList and secondList, where firstList[i] = [starti, endi] and secondList[j] = [startj, endj]. Each list of intervals is pairwise disjoint and in sorted order.

// Return the intersection of these two interval lists.

// A closed interval [a, b] (with a <= b) denotes the set of real numbers x with a <= x <= b.

// The intersection of two closed intervals is a set of real numbers that are either empty or represented as a closed interval. For example, the intersection of [1, 3] and [2, 4] is [2, 3].

 

// Example 1:


// Input: firstList = [[0,2],[5,10],[13,23],[24,25]], secondList = [[1,5],[8,12],[15,24],[25,26]]
// Output: [[1,2],[5,5],[8,10],[15,23],[24,24],[25,25]]
// Example 2:

// Input: firstList = [[1,3],[5,9]], secondList = []
// Output: []
 

// Constraints:

// 0 <= firstList.length, secondList.length <= 1000
// firstList.length + secondList.length >= 1
// 0 <= starti < endi <= 109
// endi < starti+1
// 0 <= startj < endj <= 109 
// endj < startj+1


/**
 * @param {number[][]} firstList
 * @param {number[][]} secondList
 * @return {number[][]}
 */
var intervalIntersection = function (firstList, secondList) {
    let intersections = []; // to store all intersecting intervals

    // index 'i' for iterating over the list 'a'
    // index 'j' for iterating over the list 'b'
    let i = 0,
        j = 0;

    while (i < firstList.length && j < secondList.length) {
        // Check if the firstList[i] intersects secondList[j]

        // 1. start: The potential start point of the intersection
        let start = Math.max(firstList[i][0], secondList[j][0]);
        // 2. end: The potential endpoint of the intersection
        let end = Math.min(firstList[i][1], secondList[j][1]);

        // The actual intersection
        if (start <= end) intersections.push([start, end]);

        // Move forward in the list whose interval ends earlier
        if (firstList[i][1] < secondList[j][1]) i++;
        else j++;
    }
    return intersections;
};