// Longest Palindromic Substring
// Given a string s, return the longest substring of s that is a palindrome.

// A palindrome is a string that reads the same forward and backward.

// If there are multiple palindromic substrings that have the same length, return any one of them.

// Example 1:

// Input: s = "ababd"

// Output: "bab"
// Explanation: Both "aba" and "bab" are valid answers.

// Example 2:

// Input: s = "abbc"

// Output: "bb"
// Constraints:

// 1 <= s.length <= 1000
// s contains only digits and English letters.

function longestPalindrome(s) {
    let resIdx = 0, resLen = 0;
    const n = s.length;

    const dp = Array.from({ length: n }, () => Array(n).fill(false));

    for (let i = n - 1; i >= 0; i--) {
        for (let j = i; j < n; j++) {
            if (s[i] === s[j] && 
                (j - i <= 2 || dp[i + 1][j - 1])) {
                    
                dp[i][j] = true;
                if (resLen < (j - i + 1)) {
                    resIdx = i;
                    resLen = j - i + 1;
                }
            }
        }
    }

    return s.slice(resIdx, resIdx + resLen);
}