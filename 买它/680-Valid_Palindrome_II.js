// 680. Valid Palindrome II
// Easy
// Topics
// Companies
// Given a string s, return true if the s can be palindrome after deleting at most one character from it.

 

// Example 1:

// Input: s = "aba"
// Output: true
// Example 2:

// Input: s = "abca"
// Output: true
// Explanation: You could delete the character 'c'.
// Example 3:

// Input: s = "abc"
// Output: false
 

// Constraints:

// 1 <= s.length <= 105
// s consists of lowercase English letters.

var validPalindrome = function(s) {
    var isPalindrome = (s, l, r) => {
        while(l<r){
            if(s[l] !== s[r]) return false;
            l++;
            r--;
        }
        return true;
    }

    let l = 0;
    let r = s.length - 1;

    while(l<r){
        if(s[l] !== s[r]){
            return isPalindrome(s, l+1, r) || isPalindrome(s, l, r-1)
        }
        l++;
        r--;
    }

    return true;
    
};
