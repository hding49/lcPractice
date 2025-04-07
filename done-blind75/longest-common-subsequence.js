// Longest Common Subsequence
// Given two strings text1 and text2, return the length of the longest common subsequence between the two strings if one exists, otherwise return 0.

// A subsequence is a sequence that can be derived from the given sequence by deleting some or no elements without changing the relative order of the remaining characters.

// For example, "cat" is a subsequence of "crabt".
// A common subsequence of two strings is a subsequence that exists in both strings.

// Example 1:

// Input: text1 = "cat", text2 = "crabt" 

// Output: 3 
// Explanation: The longest common subsequence is "cat" which has a length of 3.

// Example 2:

// Input: text1 = "abcd", text2 = "abcd"

// Output: 4
// Example 3:

// Input: text1 = "abcd", text2 = "efgh"

// Output: 0
// Constraints:

// 1 <= text1.length, text2.length <= 1000
// text1 and text2 consist of only lowercase English characters.


var longestCommonSubsequence = function(text1, text2) {
    // 获取两个字符串的长度
    const length1 = text1.length;
    const length2 = text2.length;

    // 创建一个二维数组 dp，用于存储最长公共子序列的长度
    const dp = new Array(length1 + 1).fill(0).map(() => new Array(length2 + 1).fill(0));

    // 填充 dp 数组
    for (let i = 1; i <= length1; ++i) {
        for (let j = 1; j <= length2; ++j) {
            // 如果字符相等，则 dp[i][j] = dp[i-1][j-1] + 1
            if (text1.charAt(i - 1) === text2.charAt(j - 1)) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            }
            // 否则，取左边或上边的最大值
            else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    // 返回最终的结果，即最长公共子序列的长度
    return dp[length1][length2];
};
