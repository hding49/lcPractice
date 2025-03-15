// Encode and Decode Strings
// Design an algorithm to encode a list of strings to a single string. The encoded string is then decoded back to the original list of strings.

// Please implement encode and decode

// Example 1:

// Input: ["neet","code","love","you"]

// Output:["neet","code","love","you"]
// Example 2:

// Input: ["we","say",":","yes"]

// Output: ["we","say",":","yes"]
// Constraints:

// 0 <= strs.length < 100
// 0 <= strs[i].length < 200
// strs[i] contains only UTF-8 characters.


// Encode function
function encode(strs) {
    return strs.map(str => str.length + '#' + str).join('');
}

// Decode function
function decode(s) {
    const result = [];
    let i = 0;

    while (i < s.length) {
        let j = i;
        while (s[j] !== '#') {
            j++;
        }
        const length = parseInt(s.slice(i, j));
        result.push(s.slice(j + 1, j + 1 + length));
        i = j + 1 + length;
    }

    return result;
}

// Example usage:
const encoded = encode(["neet", "code", "love", "you"]);
console.log(encoded); // Output: "4#neet4#code4#love3#you"

const decoded = decode(encoded);
console.log(decoded); // Output: ["neet", "code", "love", "you"]

const encoded2 = encode(["we", "say", ":", "yes"]);
console.log(encoded2); // Output: "2#we3#say1#:3#yes"

const decoded2 = decode(encoded2);
console.log(decoded2); // Output: ["we", "say", ":", "yes"]