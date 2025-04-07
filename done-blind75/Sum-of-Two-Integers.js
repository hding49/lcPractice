// Sum of Two Integers
// Given two integers a and b, return the sum of the two integers without using the + and - operators.

// Example 1:

// Input: a = 1, b = 1

// Output: 2
// Example 2:

// Input: a = 4, b = 7

// Output: 11
// Constraints:

// -1000 <= a, b <= 1000


var getSum = function(a, b) {
    while (b !== 0) {
        let sum = a ^ b; // sum without carry
        let carry = (a & b) << 1; // carry shifted left
        a = sum;
        b = carry;
    }
    return a;
};