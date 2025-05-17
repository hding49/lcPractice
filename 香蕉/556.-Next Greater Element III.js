// 556. Next Greater Element III
// Medium
// Topics
// Companies
// Given a positive integer n, find the smallest integer which has exactly the same digits existing in the integer n and is greater in value than n. If no such positive integer exists, return -1.

// Note that the returned integer should fit in 32-bit integer, if there is a valid answer but it does not fit in 32-bit integer, return -1.

 

// Example 1:

// Input: n = 12
// Output: 21
// Example 2:

// Input: n = 21
// Output: -1
 

// Constraints:

// 1 <= n <= 231 - 1

//先找到第一个升序对的较小值 i，然后找右边比它大的最小值 j交换，最后反转 i 后面的部分

/**
 * @param {number} n
 * @return {number}
 */
var nextGreaterElement = function(n) {
    let str = n.toString().split('')
    
    let i = str.length - 2;
    while(i >= 0 && str[i] >= str[i+1]){
        i--;
    }

    if(i === -1) return -1;

    let j = str.length - 1;
    while(str[j] <= str[i]){
        j--;
    }

    [str[i], str[j]] = [str[j], str[i]];

    let right = str.slice(i+1);
    right.reverse();
    str = str.slice(0, i+1).concat(right);

    let res = parseInt(str.join(''))

    return res <= 0x7FFFFFFF ? res : -1;
};

