// Last Stone Weight
// You are given an array of integers stones where stones[i] represents the weight of the ith stone.

// We want to run a simulation on the stones as follows:

// At each step we choose the two heaviest stones, with weight x and y and smash them togethers
// If x == y, both stones are destroyed
// If x < y, the stone of weight x is destroyed, and the stone of weight y has new weight y - x.
// Continue the simulation until there is no more than one stone remaining.

// Return the weight of the last remaining stone or return 0 if none remain.

// Example 1:

// Input: stones = [2,3,6,2,4]

// Output: 1
// Explanation:
// We smash 6 and 4 and are left with a 2, so the array becomes [2,3,2,2].
// We smash 3 and 2 and are left with a 1, so the array becomes [1,2,2].
// We smash 2 and 2, so the array becomes [1].

// Example 2:

// Input: stones = [1,2]

// Output: 1
// Constraints:

// 1 <= stones.length <= 20
// 1 <= stones[i] <= 100

var lastStoneWeight = function(stones) {
    while(stones.length>1){
        stones.sort((a,b)=>b-a); //sort the remaining stones in decending order;
        stones[1]=stones[0]-stones[1]; //smash the first and second stones ie the stones with largest weight ans assign the remaining stone weight to 1st index
        stones.shift();//shift the array to get rid of the 0 index
    }
    return stones[0] //return the 0 index value ie the resultl
};


function lastStoneWeight(stones) {
    const maxPQ = new MaxPriorityQueue();

    for (const stone of stones) {
        maxPQ.enqueue(stone);
    }

    while (maxPQ.size() > 1) {
        const stone1 = maxPQ.dequeue();
        const stone2 = maxPQ.dequeue();

        if (stone1 !== stone2) {
            maxPQ.enqueue(stone1 - stone2);
        }
    }

    return maxPQ.size() === 1 ? maxPQ.dequeue() : 0;
}