// 415. Add Strings
// Easy
// Topics
// Companies
// Given two non-negative integers, num1 and num2 represented as string, return the sum of num1 and num2 as a string.

const { time } = require("console");

// You must solve the problem without using any built-in library for handling large integers (such as BigInteger). You must also not convert the inputs to integers directly.

 

// Example 1:

// Input: num1 = "11", num2 = "123"
// Output: "134"
// Example 2:

// Input: num1 = "456", num2 = "77"
// Output: "533"
// Example 3:

// Input: num1 = "0", num2 = "0"
// Output: "0"
 

// Constraints:

// 1 <= num1.length, num2.length <= 104
// num1 and num2 consist of only digits.
// num1 and num2 don't have any leading zeros except for the zero itself.

var addStrings = function(num1, num2) {
    let i = num1.length - 1;
    let j = num2.length - 1;
    let carry = 0;
    let result = [];

    while (i >= 0 || j >= 0 || carry > 0) {
        const digit1 = i >= 0 ? num1.charCodeAt(i) - 48 : 0;
        const digit2 = j >= 0 ? num2.charCodeAt(j) - 48 : 0;
        const sum = digit1 + digit2 + carry;

        result.push(sum % 10);
        carry = Math.floor(sum / 10);

        i--;
        j--;
    }

    return result.reverse().join('');
};

// Test cases
console.log(addStrings("11", "123")); // Output: "134"
console.log(addStrings("456", "77")); // Output: "533"
console.log(addStrings("0", "0")); // Output: "0"
console.log(addStrings("999", "1")); // Output: "1000"
console.log(addStrings("123456789", "987654321")); // Output: "1111111110"


// time complexity = O(max(m, n)), where m and n are the lengths of num1 and num2, respectively. This is because we iterate through both strings once.
// space complexity = O(max(m, n)), where m and n are the lengths of num1 and num2, respectively. This is because we store the result in an array of size max(m, n).

