// 243. Shortest Word Distance
// Easy
// Topics
// Companies
// Given an array of strings wordsDict and two different strings that already exist in the array word1 and word2, return the shortest distance between these two words in the list.

 

// Example 1:

// Input: wordsDict = ["practice", "makes", "perfect", "coding", "makes"], word1 = "coding", word2 = "practice"
// Output: 3
// Example 2:

// Input: wordsDict = ["practice", "makes", "perfect", "coding", "makes"], word1 = "makes", word2 = "coding"
// Output: 1
 

// Constraints:

// 2 <= wordsDict.length <= 3 * 104
// 1 <= wordsDict[i].length <= 10
// wordsDict[i] consists of lowercase English letters.
// word1 and word2 are in wordsDict.
// word1 != word2

/**
 * @param {string[]} wordsDict
 * @param {string} word1
 * @param {string} word2
 * @return {number}
 */
var shortestDistance = function(wordsDict, word1, word2) {
    let index1 = -1, index2 = -1, minDistance = wordsDict.length;

    for(let i = 0; i <wordsDict.length; i++){
        if(wordsDict[i] === word1){
            index1 = i;
        }
        else if(wordsDict[i] === word2){
            index2 = i;
        }

        if(index1 !== -1 && index2 !== -1){
            minDistance = Math.min(minDistance, Math.abs(index1 - index2))
        }
    }

    return minDistance;
};
