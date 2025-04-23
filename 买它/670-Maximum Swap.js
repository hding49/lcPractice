// 670. Maximum Swap
// Medium
// Topics
// Companies
// You are given an integer num. You can swap two digits at most once to get the maximum valued number.

// Return the maximum valued number you can get.

 

// Example 1:

// Input: num = 2736
// Output: 7236
// Explanation: Swap the number 2 and the number 7.
// Example 2:

// Input: num = 9973
// Output: 9973
// Explanation: No swap.
 

// Constraints:

// 0 <= num <= 108


/**
 * @param {number} num
 * @return {number}
 */
var maximumSwap = function(num) {
    // Convert the number to a string array
    let numArr = num.toString().split('');
    
    // Track the last occurrence of each digit
    let last = new Array(10).fill(-1);
    for (let i = 0; i < numArr.length; i++) {
        last[parseInt(numArr[i])] = i;
    }

    // Traverse the digits from left to right
    for (let i = 0; i < numArr.length; i++) {
        // Check if a larger digit can be swapped later
        for (let d = 9; d > numArr[i]; d--) {
            if (last[d] > i) {
                // Swap the digits and return the new number
                [numArr[i], numArr[last[d]]] = [numArr[last[d]], numArr[i]];
                return parseInt(numArr.join(''));
            }
        }
    }
    
    // Return the original number if no swap was performed
    return num;
};