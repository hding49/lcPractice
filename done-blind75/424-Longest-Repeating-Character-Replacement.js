// Longest Repeating Character Replacement
// You are given a string s consisting of only uppercase english characters and an integer k. You can choose up to k characters of the string and replace them with any other uppercase English character.

// After performing at most k replacements, return the length of the longest substring which contains only one distinct character.

// Example 1:

// Input: s = "XYYX", k = 2

// Output: 4
// Explanation: Either replace the 'X's with 'Y's, or replace the 'Y's with 'X's.

// Example 2:

// Input: s = "AAABABB", k = 1

// Output: 5
// Constraints:

// 1 <= s.length <= 1000
// 0 <= k <= s.length


// Time Complexity :  O(n)
// Space Complexity : O(1)
var characterReplacement = function(s, k) {
    // 初始化一个 Map 用于存储每个字符的频率。
    let map = new Map();
    let largestCount = 0, start = 0, maxlen = 0;

    // 遍历字符串的每个字符，使用滑动窗口算法。
    for (let end = 0; end < s.length; end++) {
        const c = s[end];

        // 增加当前字符的频率。
        map.set(c, (map.get(c) || 0) + 1);

        // 更新当前窗口中出现次数最多的字符的频率。
        largestCount = Math.max(largestCount, map.get(c));

        // 如果当前窗口的大小减去最频繁字符的个数大于 k，说明替换的字符太多了。
        // 需要缩小窗口，减少替换的字符数。
        if (end - start + 1 - largestCount > k) {
            // 缩小窗口：将窗口的起始位置 `start` 向右移动一位。
            map.set(s[start], map.get(s[start]) - 1);
            start ++;
        }

        // 更新最大子串的长度。
        maxlen = Math.max(maxlen, end - start + 1);
    }

    return maxlen;
};

