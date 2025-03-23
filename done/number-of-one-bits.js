// Number of One Bits
// Solved 
// You are given an unsigned integer n. Return the number of 1 bits in its binary representation.

// You may assume n is a non-negative integer which fits within 32-bits.

// Example 1:

// Input: n = 00000000000000000000000000010111

// Output: 4
// Example 2:

// Input: n = 01111111111111111111111111111101

// Output: 30

function hammingWeight(n) {
    return n.toString(2).split('0').join('').length;
}