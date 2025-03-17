// Minimum Window Substring
// Given two strings s and t, return the shortest substring of s such that every character in t, including duplicates, is present in the substring. If such a substring does not exist, return an empty string "".

// You may assume that the correct output is always unique.

// Example 1:

// Input: s = "OUZODYXAZV", t = "XYZ"

// Output: "YXAZ"
// Explanation: "YXAZ" is the shortest substring that includes "X", "Y", and "Z" from string t.

// Example 2:

// Input: s = "xyz", t = "xyz"

// Output: "xyz"
// Example 3:

// Input: s = "x", t = "xy"

// Output: ""
// Constraints:

// 1 <= s.length <= 1000
// 1 <= t.length <= 1000
// s and t consist of uppercase and lowercase English letters.


var minWindow = function (s, t) {
    if (!s || !t) {
        return "";
    }

    let dictT = new Map();
    for (let c of t) {
        dictT.set(c, (dictT.get(c) || 0) + 1);
    }

    let required = dictT.size;
    let l = 0, r = 0;
    let formed = 0;

    let windowCounts = new Map();
    let ans = [-1, 0, 0];

    while (r < s.length) {
        let c = s.charAt(r);
        windowCounts.set(c, (windowCounts.get(c) || 0) + 1);

        if (dictT.has(c) && windowCounts.get(c) === dictT.get(c)) {
            formed++;
        }

        while (l <= r && formed === required) {
            c = s.charAt(l);

            if (ans[0] === -1 || r - l + 1 < ans[0]) {
                ans[0] = r - l + 1;
                ans[1] = l;
                ans[2] = r;
            }

            windowCounts.set(c, windowCounts.get(c) - 1);
            if (dictT.has(c) && windowCounts.get(c) < dictT.get(c)) {
                formed--;
            }

            l++;
        }

        r++;
    }

    return ans[0] === -1 ? "" : s.substring(ans[1], ans[2] + 1);
};
