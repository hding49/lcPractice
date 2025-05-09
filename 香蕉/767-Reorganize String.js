// 767. Reorganize String
// Medium
// Topics
// Companies
// Hint
// Given a string s, rearrange the characters of s so that any two adjacent characters are not the same.

// Return any possible rearrangement of s or return "" if not possible.

 

// Example 1:

// Input: s = "aab"
// Output: "aba"
// Example 2:

// Input: s = "aaab"
// Output: ""
 

// Constraints:

// 1 <= s.length <= 500
// s consists of lowercase English letters.

var reorganizeString1 = function(S) {
    let hash = {};
    for (let c of S) hash[c] = hash[c] + 1 || 1;

    let sort = Object.keys(hash).sort((a,b)=>hash[b] - hash[a]);
    let res = [];
    let index = 0;

    for (let i = 0;i<sort.length;i++) {
        let occur = hash[sort[i]];
        if (occur > parseInt((S.length + 1)/2)) return "";
        for (let j = 0;j < occur;j++) {
            if (index >= S.length) index = 1;
            res[index] = sort[i];
            index += 2;
        }
    } 
    return res.join('');
};