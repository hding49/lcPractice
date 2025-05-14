// 1139. Largest 1-Bordered Square
// Medium
// Topics
// Companies
// Hint
// Given a 2D grid of 0s and 1s, return the number of elements in the largest square subgrid that has all 1s on its border, or 0 if such a subgrid doesn't exist in the grid.

 

// Example 1:

// Input: grid = [[1,1,1],[1,0,1],[1,1,1]]
// Output: 9
// Example 2:

// Input: grid = [[1,1,0,0]]
// Output: 1
 

// Constraints:

// 1 <= grid.length <= 100
// 1 <= grid[0].length <= 100
// grid[i][j] is 0 or 1


var largest1BorderedSquare = function(grid) {
    let m = grid.length, n = grid[0].length;
    let top = Array(m).fill(0).map(() => Array(n).fill(0));
    let left = Array(m).fill(0).map(() => Array(n).fill(0));
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        if (grid[i][j] === 1) {
          left[i][j] = j > 0 ? left[i][j - 1] + 1 : 1;
          top[i][j] = i > 0 ? top[i - 1][j] + 1 : 1;
        } 
      }
    }
    
    let ans = 0;
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        let size = Math.min(top[i][j], left[i][j]);
        for (let k = size; k > 0; k--) {
          let bottomLeftTop = top[i][j - k + 1];
          let topRightLeft = left[i - k + 1][j];
          if (bottomLeftTop >= k && topRightLeft >= k) {
            ans = Math.max(ans, k * k);
            break;
          }
        }
      }
    }
    return ans;
  };