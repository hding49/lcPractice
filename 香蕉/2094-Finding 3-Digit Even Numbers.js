// 2094. Finding 3-Digit Even Numbers
// Easy
// Topics
// Companies
// Hint
// You are given an integer array digits, where each element is a digit. The array may contain duplicates.

// You need to find all the unique integers that follow the given requirements:

// The integer consists of the concatenation of three elements from digits in any arbitrary order.
// The integer does not have leading zeros.
// The integer is even.
// For example, if the given digits were [1, 2, 3], integers 132 and 312 follow the requirements.

// Return a sorted array of the unique integers.

 

// Example 1:

// Input: digits = [2,1,3,0]
// Output: [102,120,130,132,210,230,302,310,312,320]
// Explanation: All the possible integers that follow the requirements are in the output array. 
// Notice that there are no odd integers or integers with leading zeros.
// Example 2:

// Input: digits = [2,2,8,8,2]
// Output: [222,228,282,288,822,828,882]
// Explanation: The same digit can be used as many times as it appears in digits. 
// In this example, the digit 8 is used twice each time in 288, 828, and 882. 
// Example 3:

// Input: digits = [3,7,5]
// Output: []
// Explanation: No even integers can be formed using the given digits.
 

// Constraints:

// 3 <= digits.length <= 100
// 0 <= digits[i] <= 9


var findEvenNumbers = function(digits) {
    let freq = new Array(10).fill(0);
    for (let d of digits) freq[d]++;
    
    let ans = [];
    for(let i = 100; i<=998; i+=2){
        let a = Math.floor(i / 100)
        let b = Math.floor(i / 10) % 10;
        let c = i % 10;

        let valid = true;
        let local = new Array(10).fill(0);

        local[a]++;
        local[b]++;
        local[c]++;

        for(let j = 0; j < 10; j++){
            if(local[j] > freq[j]){
                valid = false;
                break;
            }
        }

        if(valid) ans.push(i)
    }

    return ans;
};