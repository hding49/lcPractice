// 790. Domino and Tromino Tiling
// Medium
// Topics
// Companies
// You have two types of tiles: a 2 x 1 domino shape and a tromino shape. You may rotate these shapes.


// Given an integer n, return the number of ways to tile an 2 x n board. Since the answer may be very large, return it modulo 109 + 7.

// In a tiling, every square must be covered by a tile. Two tilings are different if and only if there are two 4-directionally adjacent cells on the board such that exactly one of the tilings has both squares occupied by a tile.

 

// Example 1:


// Input: n = 3
// Output: 5
// Explanation: The five different ways are show above.
// Example 2:

// Input: n = 1
// Output: 1
 

// Constraints:

// 1 <= n <= 1000


var numTilings = function(n) {
    const MOD = 1e9 + 7;
    const dp = Array(Math.max(4, n + 1)).fill(0);
    dp[1] = 1; dp[2] = 2; dp[3] = 5;
    for (let i = 4; i <= n; i++) {
        dp[i] = (2 * dp[i - 1] + dp[i - 3]) % MOD;
    }
    return dp[n];
};


// 🤔 怎么推 dp[i]
// 我们来推 dp[i]，从 i = 4 开始考虑。

// 一、放一个 竖的 domino
// 如果在最后一列放一个竖的 domino，前面就是一个 2 x (i - 1) 的棋盘，所以：

// Copy
// Edit
// dp[i] += dp[i - 1]
// 二、在最后两列放 两个横的 domino
// 这种情况会占掉最后两列的上下格子，所以剩下的是 2 x (i - 2)：

// Copy
// Edit
// dp[i] += dp[i - 2]
// 三、放一个 三角瓦片（tromino）
// 三角瓦片有 4 种旋转形态，但它们本质上只会让前面剩下 2 x (i - 3) 的棋盘。比如下面的这个：

// Copy
// Edit
// ██
// ███
// 这种 L 形状，占用最后 3 列中的 3 个格子。

// 👉 一共有 两种方式 放 tromino 到最后三列（左 L 或右 L），所以我们要加：

// Copy
// Edit
// dp[i] += 2 * dp[i - 3]

