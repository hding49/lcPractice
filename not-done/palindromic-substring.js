// Palindromic Substrings
// Given a string s, return the number of substrings within s that are palindromes.

// A palindrome is a string that reads the same forward and backward.

// Example 1:

// Input: s = "abc"

// Output: 3
// Explanation: "a", "b", "c".

// Example 2:

// Input: s = "aaa"

// Output: 6
// Explanation: "a", "a", "a", "aa", "aa", "aaa". Note that different substrings are counted as different palindromes even if the string contents are the same.

// Constraints:

// 1 <= s.length <= 1000
// s consists of lowercase English letters.

function countSubstrings(s) {
    let res = 0;
    const n = s.length;
    const dp = Array.from({ length: n }, () => Array(n).fill(false));

    for (let i = n - 1; i >= 0; i--) {
        for (let j = i; j < n; j++) {
            if (s[i] === s[j] && 
                (j - i <= 2 || dp[i + 1][j - 1])) {
                    
                dp[i][j] = true;
                res++;
            }
        }
    }

    return res;
}