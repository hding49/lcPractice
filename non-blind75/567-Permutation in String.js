// Permutation in String
// You are given two strings s1 and s2.

// Return true if s2 contains a permutation of s1, or false otherwise. That means if a permutation of s1 exists as a substring of s2, then return true.

// Both strings only contain lowercase letters.

// Example 1:

// Input: s1 = "abc", s2 = "lecabee"

// Output: true
// Explanation: The substring "cab" is a permutation of "abc" and is present in "lecabee".

// Example 2:

// Input: s1 = "abc", s2 = "lecaabee"

// Output: false
// Constraints:

// 1 <= s1.length, s2.length <= 1000


var checkInclusion = function(s1, s2) {
    if (s1.length > s2.length) return false;

    let s1Count = Array(26).fill(0);
    let s2Count = Array(26).fill(0);

    // Initialize counts for s1 and the first window in s2
    for (let i = 0; i < s1.length; i++) {
        s1Count[s1.charCodeAt(i) - 97]++;
        s2Count[s2.charCodeAt(i) - 97]++;
    }

    // Slide the window over s2
    for (let i = 0; i < s2.length - s1.length; i++) {
        if (matches(s1Count, s2Count)) return true;
        s2Count[s2.charCodeAt(i) - 97]--;
        s2Count[s2.charCodeAt(i + s1.length) - 97]++;
    }

    // Check the last window
    return matches(s1Count, s2Count);
};

function matches(s1Count, s2Count) {
    for (let i = 0; i < 26; i++) {
        if (s1Count[i] !== s2Count[i]) return false;
    }
    return true;
}