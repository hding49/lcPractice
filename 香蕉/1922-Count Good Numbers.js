// 1922. Count Good Numbers
// Medium
// Topics
// Companies
// Hint
// A digit string is good if the digits (0-indexed) at even indices are even and the digits at odd indices are prime (2, 3, 5, or 7).

// For example, "2582" is good because the digits (2 and 8) at even positions are even and the digits (5 and 2) at odd positions are prime. However, "3245" is not good because 3 is at an even index but is not even.
// Given an integer n, return the total number of good digit strings of length n. Since the answer may be large, return it modulo 109 + 7.

// A digit string is a string consisting of digits 0 through 9 that may contain leading zeros.

 

// Example 1:

// Input: n = 1
// Output: 5
// Explanation: The good numbers of length 1 are "0", "2", "4", "6", "8".
// Example 2:

// Input: n = 4
// Output: 400
// Example 3:

// Input: n = 50
// Output: 564908303
 

// Constraints:

// 1 <= n <= 1015



var countGoodNumbers = function(n) {
    let MOD = 1e9 + 7;


    var power = (base, power) =>{
       let result = 1n
       base = BigInt(base);
       power = BigInt(power);
       const mod = BigInt(MOD);

       while(power > 0){
         if(power % 2n === 1n){
          result = (result * base) % mod
         }
         base = (base * base) % mod
         power = power / 2n
       }

       return result
    }

    let even = Math.ceil(n / 2)
    let odd = Math.floor(n / 2)

    let evenSum = power(5, even)
    let oddSum = power(4, odd)

    return Number((evenSum * oddSum) % BigInt(MOD))
};