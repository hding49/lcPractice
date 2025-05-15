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
    
    //整个grid是从左上方为原点开始的 不是普通的坐标系 往下是i增加 往右是j增加
    //left[i][j] 表示在位置 (i, j) 往左边（水平方向）看，连续的 1 的数量
    //top[i][j] 表示在位置 (i, j) 往上边（垂直方向）看，连续的 1 的数量
    // grid = [
    //   [1, 1, 0],
    //   [1, 1, 1],
    //   [0, 1, 1]
    // ]
    let ans = 0;
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        //在右边和下边取一个连续的最小k
        let size = Math.min(top[i][j], left[i][j]);
        for (let k = size; k > 0; k--) {
          //判断左边是否有k个
          let bottomLeftTop = top[i][j - k + 1];
          //判断上边是否有k个
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