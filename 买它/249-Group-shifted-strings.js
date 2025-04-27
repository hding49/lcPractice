// 249. Group Shifted Strings
// Medium
// Topics
// Companies
// Perform the following shift operations on a string:

// Right shift: Replace every letter with the successive letter of the English alphabet, where 'z' is replaced by 'a'. For example, "abc" can be right-shifted to "bcd" or "xyz" can be right-shifted to "yza".
// Left shift: Replace every letter with the preceding letter of the English alphabet, where 'a' is replaced by 'z'. For example, "bcd" can be left-shifted to "abc" or "yza" can be left-shifted to "xyz".
// We can keep shifting the string in both directions to form an endless shifting sequence.

// For example, shift "abc" to form the sequence: ... <-> "abc" <-> "bcd" <-> ... <-> "xyz" <-> "yza" <-> .... <-> "zab" <-> "abc" <-> ...
// You are given an array of strings strings, group together all strings[i] that belong to the same shifting sequence. You may return the answer in any order.

 

// Example 1:

// Input: strings = ["abc","bcd","acef","xyz","az","ba","a","z"]

// Output: [["acef"],["a","z"],["abc","bcd","xyz"],["az","ba"]]

// Example 2:

// Input: strings = ["a"]

// Output: [["a"]]

 

// Constraints:

// 1 <= strings.length <= 200
// 1 <= strings[i].length <= 50
// strings[i] consists of lowercase English letters.


/**
 * @param {string[]} strs
 * @return {string[][]}
 */
const groupStrings = (strs) => {
    const map = new Map();

    for (const str of strs) {
        // 构建当前字符串的“相对间距”key
        let key = '';

        for (let i = 1; i < str.length; i++) {
            // 计算相对差值，注意用 +26 后再 % 26 防止负值
            const diff = (str.charCodeAt(i) - str.charCodeAt(i - 1) + 26) % 26;
            key += diff + ','; // 用逗号连接避免 ["11"] 和 ["1","1"] 混淆
        }

        // 如果是单个字符，key 就是空字符串 ''
        if (!map.has(key)) map.set(key, []);
        map.get(key).push(str);
    }

    return Array.from(map.values());
};