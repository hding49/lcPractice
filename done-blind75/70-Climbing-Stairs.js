// Climbing Stairs
// You are given an integer n representing the number of steps to reach the top of a staircase. You can climb with either 1 or 2 steps at a time.

// Return the number of distinct ways to climb to the top of the staircase.

// Example 1:

// Input: n = 2

// Output: 2
// Explanation:

// 1 + 1 = 2
// 2 = 2
// Example 2:

// Input: n = 3

// Output: 3
// Explanation:

// 1 + 1 + 1 = 3
// 1 + 2 = 3
// 2 + 1 = 3
// Constraints:

// 1 <= n <= 30


var climbStairs = function(n) {
    if (n <= 2) return n;

    let prev1 = 2, prev2 = 1;
    
    for (let i = 3; i <= n; i++) { // i 需要遍历到 n
        let cur = prev1 + prev2;
        prev2 = prev1;
        prev1 = cur;
    }

    return prev1; // 返回 prev1，而不是 cur
};
