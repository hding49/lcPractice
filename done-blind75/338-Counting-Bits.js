// Counting Bits
// Given an integer n, count the number of 1's in the binary representation of every number in the range [0, n].

// Return an array output where output[i] is the number of 1's in the binary representation of i.

// Example 1:

// Input: n = 4

// Output: [0,1,1,2,1]
// Explanation:
// 0 --> 0
// 1 --> 1
// 2 --> 10
// 3 --> 11
// 4 --> 100

// Constraints:

// 0 <= n <= 1000


function countBits(n) {
    let dp = new Array(n + 1).fill(0);
    for (let i = 1; i <= n; i++) {
        dp[i] = dp[i >> 1] + (i & 1);
    }
    return dp;
}