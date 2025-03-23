// Design Add and Search Word Data Structure
// Design a data structure that supports adding new words and searching for existing words.

// Implement the WordDictionary class:

// void addWord(word) Adds word to the data structure.
// bool search(word) Returns true if there is any string in the data structure that matches word or false otherwise. word may contain dots '.' where dots can be matched with any letter.
// Example 1:

// Input:
// ["WordDictionary", "addWord", "day", "addWord", "bay", "addWord", "may", "search", "say", "search", "day", "search", ".ay", "search", "b.."]

// Output:
// [null, null, null, null, false, true, true, true]

// Explanation:
// WordDictionary wordDictionary = new WordDictionary();
// wordDictionary.addWord("day");
// wordDictionary.addWord("bay");
// wordDictionary.addWord("may");
// wordDictionary.search("say"); // return false
// wordDictionary.search("day"); // return true
// wordDictionary.search(".ay"); // return true
// wordDictionary.search("b.."); // return true
// Constraints:

// 1 <= word.length <= 20
// word in addWord consists of lowercase English letters.
// word in search consist of '.' or lowercase English letters.


class WordDictionary {
    constructor() {
        this.root = new TrieNode();
    }
    
    /**
     * @param {string} c
     * @return {number}
     */
    getIndex(c) {
        return c.charCodeAt(0) - 'a'.charCodeAt(0);
    }

    /**
     * @param {string} word
     * @return {void}
     */
    addWord(word) {
        let cur = this.root;
        for (const c of word) {
            const idx = this.getIndex(c); 
            if (cur.children[idx] === null) {
                cur.children[idx] = new TrieNode();
            }
            cur = cur.children[idx];
        }
        cur.word = true;
    }
    
     /**
     * @param {string} word
     * @return {boolean}
     */
    search(word) {
        return this.dfs(word, 0, this.root);
    }

    /**
     * @param {string} word
     * @param {number} j
     * @param {TrieNode} root
     * @return {boolean}
     */
    dfs(word, j, root) {
        let cur = root;

        for (let i = j; i < word.length; i++) {
            const c = word[i];
            if (c === '.') {
                for (const child of cur.children) {
                    if (child !== null && 
                        this.dfs(word, i + 1, child)) {
                        return true;
                    }
                }
                return false;
            } else {
                const idx = this.getIndex(c);  
                if (cur.children[idx] === null) {
                    return false;
                }
                cur = cur.children[idx];
            }
        }
        return cur.word;
    }
}