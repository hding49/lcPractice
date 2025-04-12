// Container With Most Water
// You are given an integer array heights where heights[i] represents the height of the 
// i
// t
// h
// i 
// th
//   bar.

// You may choose any two bars to form a container. Return the maximum amount of water a container can store.

// Example 1:



// Input: height = [1,7,2,5,4,7,3,6]

// Output: 36
// Example 2:

// Input: height = [2,2,2]

// Output: 4
// Constraints:

// 2 <= height.length <= 1000
// 0 <= height[i] <= 1000

var maxArea = function (height) {
    let [left, right, max] = [0, height.length - 1, 0];

    while (left < right) {
        const [leftHeight, rightHeight] = [height[left], height[right]];
        max = Math.max(max, Math.min(leftHeight, rightHeight) * (right - left));

        if (leftHeight <= rightHeight) left++;
        if (rightHeight < leftHeight) right--;
    }

    return max;
};