// Longest Substring Without Repeating Characters
// Given a string s, find the length of the longest substring without duplicate characters.

// A substring is a contiguous sequence of characters within a string.

// Example 1:

// Input: s = "zxyzxyz"

// Output: 3
// Explanation: The string "xyz" is the longest without duplicate characters.

// Example 2:

// Input: s = "xxxx"

// Output: 1
// Constraints:

// 0 <= s.length <= 1000
// s may consist of printable ASCII characters.


function maxLength (s) {
    let charSet = new Set()
    let left = 0;
    let maxLength = 0;

    for (let right = 0; right < s.length; right ++){
        while (charSet.has(s[right])){
            charSet.delete(s[left])
            left ++
        }

        charSet.add(s[right])
        maxLength = Math.max(maxLength, right - left + 1)
    }
    return maxLength;
}

console.log(maxLength("zxyzxyz")) // 3