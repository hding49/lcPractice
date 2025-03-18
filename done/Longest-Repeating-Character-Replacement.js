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
    // Initialize an empty Map to store character frequencies.
    let map = new Map();
    let largestCount = 0, start = 0, maxlen = 0;

    for (let end = 0; end < s.length; end++) {
        const c = s[end];

        // Increment the frequency of the current character.
        map.set(c, (map.get(c) || 0) + 1);

        // Get the largest count of a single character in the current window.
        largestCount = Math.max(largestCount, map.get(c));

        // If the current window size minus the count of the most frequent character is greater than k,
        // shrink the window.
        if (end - start + 1 - largestCount > k) {
            map.set(s[start], map.get(s[start]) - 1);
            start += 1;
        }

        // Update the maximum length of the valid window.
        maxlen = Math.max(maxlen, end - start + 1);
    }

    return maxlen;
};
