// Set Matrix Zeroes
// Given an m x n matrix of integers matrix, if an element is 0, set its entire row and column to 0's.

// You must update the matrix in-place.

// Follow up: Could you solve it using O(1) space?

// Example 1:



// Input: matrix = [
//   [0,1],
//   [1,0]
// ]

// Output: [
//   [0,0],
//   [0,0]
// ]
// Example 2:



// Input: matrix = [
//   [1,2,3],
//   [4,0,5],
//   [6,7,8]
// ]

// Output: [
//   [1,0,3],
//   [0,0,0],
//   [6,0,8]
// ]
// Constraints:

// 1 <= matrix.length, matrix[0].length <= 100
// -2^31 <= matrix[i][j] <= (2^31) - 1


var setZeroes = function(matrix) {
    const m = matrix.length;    // 行数
    const n = matrix[0].length; // 列数
    
    // 标记第一行和第一列是否需要置零
    let firstRowZero = false;
    let firstColZero = false;
    
    // 检查第一行是否包含 0
    for (let j = 0; j < n; j++) {
      if (matrix[0][j] === 0) {
        firstRowZero = true;
        break;
      }
    }
  
    // 检查第一列是否包含 0
    for (let i = 0; i < m; i++) {
      if (matrix[i][0] === 0) {
        firstColZero = true;
        break;
      }
    }
  
    // 使用第一行和第一列标记其他行列是否需要置零
    for (let i = 1; i < m; i++) {
      for (let j = 1; j < n; j++) {
        if (matrix[i][j] === 0) {
          matrix[i][0] = 0;  // 标记该行
          matrix[0][j] = 0;  // 标记该列
        }
      }
    }
  
    // 将标记的行列置零
    for (let i = 1; i < m; i++) {
      for (let j = 1; j < n; j++) {
        if (matrix[i][0] === 0 || matrix[0][j] === 0) {
          matrix[i][j] = 0;
        }
      }
    }
  
    // 最后处理第一行
    if (firstRowZero) {
      for (let j = 0; j < n; j++) {
        matrix[0][j] = 0;
      }
    }
  
    // 最后处理第一列
    if (firstColZero) {
      for (let i = 0; i < m; i++) {
        matrix[i][0] = 0;
      }
    }
  };
  