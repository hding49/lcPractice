// Given a string pattern representing a search pattern (which may include the wildcard character '*'), and a string str representing the input sequence.

// The wildcard '*' in pattern can match zero or more arbitrary characters in str. All other characters in pattern must appear in str in the same order. Return the first starting index (0-based) in str where the pattern matches. If there is no such match, return -1.

// Constraints:

// pattern and str consist only of uppercase English letters and the wildcard character '*'.
// 0 ≤ pattern.length, str.length ≤
// 10
// 5
// 10
// 5

// Example 1:

// Input: pattern = "**A", str = "CDFGAGB"
// Output: 0
// Explanation: The two wildcards can match the first four letters ("CDFG"), and the pattern's "A" matches at index 4. Thus, the pattern matches starting from index 0.

// Example 2:

// Input: pattern = "A*", str = "CDFGAGB"
// Output: 4

// Example 3:

// Input: pattern = "B**Y", str = "PROGRAMMING"
// Output: -1
