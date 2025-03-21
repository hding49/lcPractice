// 3Sum
// Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] where nums[i] + nums[j] + nums[k] == 0, and the indices i, j and k are all distinct.

// The output should not contain any duplicate triplets. You may return the output and the triplets in any order.

// Example 1:

// Input: nums = [-1,0,1,2,-1,-4]

// Output: [[-1,-1,2],[-1,0,1]]
// Explanation:
// nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0.
// nums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0.
// nums[0] + nums[3] + nums[4] = (-1) + 2 + (-1) = 0.
// The distinct triplets are [-1,0,1] and [-1,-1,2].

// Example 2:

// Input: nums = [0,1,1]

// Output: []
// Explanation: The only possible triplet does not sum up to 0.

// Example 3:

// Input: nums = [0,0,0]

// Output: [[0,0,0]]
// Explanation: The only possible triplet sums up to 0.

// Constraints:

// 3 <= nums.length <= 1000
// -10^5 <= nums[i] <= 10^5

// Two pointers approach
function threeSum(nums) {
    nums.sort((a, b) => a - b);
    const result = [];
    
    for(let i = 0; i < nums.length; i++) {
        let low = i+1, high = nums.length-1, sum = 0;
        
        while(low < high) {
            sum = nums[i] + nums[low] + nums[high];
            
            if(sum === 0) {
                result.push([nums[i], nums[low], nums[high]]);
                while(nums[low+1] === nums[low]) low++;
                while(nums[high-1] === nums[high]) high--;
                low++;
                high--;
            } else if(sum < 0) low++;
            else high--;
        }
        while(nums[i+1] === nums[i]) i++;
    }
    return result; 
}

// Hash map approach
function threeSumHashMap(nums) {
    nums.sort((a, b) => a - b);
    const count = new Map();
    for (let num of nums) {
        count.set(num, (count.get(num) || 0) + 1);
    }

    const res = [];
    for (let i = 0; i < nums.length; i++) {
        if (i > 0 && nums[i] === nums[i - 1]) continue;
        count.set(nums[i], count.get(nums[i]) - 1);

        for (let j = i + 1; j < nums.length; j++) {
            if (j > i + 1 && nums[j] === nums[j - 1]) continue;
            count.set(nums[j], count.get(nums[j]) - 1);

            const target = -(nums[i] + nums[j]);
            if (count.get(target) > 0) {
                res.push([nums[i], nums[j], target]);
            }

            count.set(nums[j], count.get(nums[j]) + 1);
        }

        count.set(nums[i], count.get(nums[i]) + 1);
    }
    return res;
}

// Example usage:
console.log(threeSum([-1, 0, 1, 2, -1, -4])); // Output: [[-1, -1, 2], [-1, 0, 1]]
console.log(threeSumHashMap([-1, 0, 1, 2, -1, -4])); // Output: [[-1, -1, 2], [-1, 0, 1]]