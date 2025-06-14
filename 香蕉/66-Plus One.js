// 66. Plus One
// Easy
// Topics
// Companies
// You are given a large integer represented as an integer array digits, where each digits[i] is the ith digit of the integer. The digits are ordered from most significant to least significant in left-to-right order. The large integer does not contain any leading 0's.

// Increment the large integer by one and return the resulting array of digits.

 

// Example 1:

// Input: digits = [1,2,3]
// Output: [1,2,4]
// Explanation: The array represents the integer 123.
// Incrementing by one gives 123 + 1 = 124.
// Thus, the result should be [1,2,4].
// Example 2:

// Input: digits = [4,3,2,1]
// Output: [4,3,2,2]
// Explanation: The array represents the integer 4321.
// Incrementing by one gives 4321 + 1 = 4322.
// Thus, the result should be [4,3,2,2].
// Example 3:

// Input: digits = [9]
// Output: [1,0]
// Explanation: The array represents the integer 9.
// Incrementing by one gives 9 + 1 = 10.
// Thus, the result should be [1,0].
 

// Constraints:

// 1 <= digits.length <= 100
// 0 <= digits[i] <= 9
// digits does not contain any leading 0's


function plusOne(digits) {
    for (let i = digits.length - 1; i >= 0; i--) {
        if (digits[i] < 9) {
            digits[i]++;
            //只要当前位的数字小于 9（比如 0～8），我们就可以直接加 1，因为不会引发进位。

            //加完之后就可以直接返回整个数组，因为更高位不需要改动。
            return digits; // 不需要进位，直接返回
        }
        digits[i] = 0; // 当前是 9，进位，设置为 0
    }

    // 所有数字都是 9，比如 999 → 1000
    //也就是说执行到这一行的话 digits.unshift(1); 就代表digits是999
    digits.unshift(1);
    return digits;
}
