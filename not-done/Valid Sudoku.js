// Valid Sudoku
// You are given a a 9 x 9 Sudoku board board. A Sudoku board is valid if the following rules are followed:

// Each row must contain the digits 1-9 without duplicates.
// Each column must contain the digits 1-9 without duplicates.
// Each of the nine 3 x 3 sub-boxes of the grid must contain the digits 1-9 without duplicates.
// Return true if the Sudoku board is valid, otherwise return false

// Note: A board does not need to be full or be solvable to be valid.

// Example 1:



// Input: board = 
// [["1","2",".",".","3",".",".",".","."],
//  ["4",".",".","5",".",".",".",".","."],
//  [".","9","8",".",".",".",".",".","3"],
//  ["5",".",".",".","6",".",".",".","4"],
//  [".",".",".","8",".","3",".",".","5"],
//  ["7",".",".",".","2",".",".",".","6"],
//  [".",".",".",".",".",".","2",".","."],
//  [".",".",".","4","1","9",".",".","8"],
//  [".",".",".",".","8",".",".","7","9"]]

// Output: true
// Example 2:

// Input: board = 
// [["1","2",".",".","3",".",".",".","."],
//  ["4",".",".","5",".",".",".",".","."],
//  [".","9","1",".",".",".",".",".","3"],
//  ["5",".",".",".","6",".",".",".","4"],
//  [".",".",".","8",".","3",".",".","5"],
//  ["7",".",".",".","2",".",".",".","6"],
//  [".",".",".",".",".",".","2",".","."],
//  [".",".",".","4","1","9",".",".","8"],
//  [".",".",".",".","8",".",".","7","9"]]

// Output: false
// Explanation: There are two 1's in the top-left 3x3 sub-box.

// Constraints:

// board.length == 9
// board[i].length == 9
// board[i][j] is a digit 1-9 or '.'.


/**
 * @param {character[][]} board
 * @return {boolean}
 */
var isValidSudoku = function(board) {
    let rows = {}
    let cols = {}
    let square = {}

    for(let r = 0; r < 9; r ++){
        for(let c = 0; c < 9; c ++){
            let num = board[r][c]
            let grid = `${Math.floor(r/3)}${Math.floor(c/3)}`

            if(num === '.'){
                continue
            }

            if(!rows[r]) rows[r] = new Set()
            if(!cols[c]) cols[c] = new Set()
            if(!square[grid]) square[grid] = new Set()

            if(rows[r].has(num) || cols[c].has(num) || square[grid].has(num)){
                return false
            }
            rows[r].add(num)
            cols[c].add(num)
            square[grid].add(num)
        }
    }
    return true
};