// Spiral Matrix
// Given an m x n matrix of integers matrix, return a list of all elements within the matrix in spiral order.

// Example 1:



// Input: matrix = [[1,2],[3,4]]

// Output: [1,2,4,3]
// Example 2:



// Input: matrix = [[1,2,3],[4,5,6],[7,8,9]]

// Output: [1,2,3,6,9,8,7,4,5]
// Example 3:

// Input: matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]

// Output: [1,2,3,4,8,12,11,10,9,5,6,7]
// Constraints:

// 1 <= matrix.length, matrix[i].length <= 10
// -100 <= matrix[i][j] <= 100


var spiralOrder = function(matrix) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    let x = 0;
    let y = 0;
    let dx = 1;
    let dy = 0;
    const res = [];

    for (let i = 0; i < rows * cols; i++) {
        res.push(matrix[y][x]);
        matrix[y][x] = ".";

        if (!(0 <= x + dx && x + dx < cols && 0 <= y + dy && y + dy < rows) || matrix[y+dy][x+dx] === ".") {
            [dx, dy] = [-dy, dx];
        }

        x += dx;
        y += dy;
    }

    return res;    
};