// Word Search
// Given a 2-D grid of characters board and a string word, return true if the word is present in the grid, otherwise return false.

// For the word to be present it must be possible to form it with a path in the board with horizontally or vertically neighboring cells. The same cell may not be used more than once in a word.

// Example 1:



// Input: 
// board = [
//   ["A","B","C","D"],
//   ["S","A","A","T"],
//   ["A","C","A","E"]
// ],
// word = "CAT"

// Output: true
// Example 2:



// Input: 
// board = [
//   ["A","B","C","D"],
//   ["S","A","A","T"],
//   ["A","C","A","E"]
// ],
// word = "BAT"

// Output: false
// Constraints:

// 1 <= board.length, board[i].length <= 5
// 1 <= word.length <= 10
// board and word consists of only lowercase and uppercase English letters.

function exist(board, word) {
    const ROWS = board.length;
    const COLS = board[0].length;

    const dfs = (r, c, i) => {
        if (i === word.length) return true;
        if (r < 0 || c < 0 || r >= ROWS || c >= COLS || 
            board[r][c] !== word[i] || board[r][c] === '#') {
            return false;
        }

        board[r][c] = '#';
        const res = dfs(r + 1, c, i + 1) ||
                    dfs(r - 1, c, i + 1) ||
                    dfs(r, c + 1, i + 1) ||
                    dfs(r, c - 1, i + 1);
        board[r][c] = word[i];
        return res;
    };

    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (dfs(r, c, 0)) return true;
        }
    }
    return false;
}