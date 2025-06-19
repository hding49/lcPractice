/*
动态规划（Dynamic Programming，DP）总结

核心思想：
- 将复杂问题拆解成子问题，保存子问题的结果避免重复计算（“记忆化”）
- 自底向上或自顶向下求解，利用之前计算的状态得到当前状态
- 典型特征：最优子结构和重叠子问题

常用步骤：
1. 明确状态（State）：用什么变量描述子问题  
2. 状态转移方程（Transition）：如何从子问题推导出当前问题  
3. 初始化（Base Case）：已知最简单问题的答案  
4. 计算顺序：保证计算当前状态之前，子状态已经计算过  
5. 返回结果：一般是状态数组最后或特定位置的值

---

示例1：斐波那契数列（递归+记忆化）
*/

function fib(n, memo = {}) {
  if (n <= 1) return n;
  if (memo[n]) return memo[n];

  memo[n] = fib(n - 1, memo) + fib(n - 2, memo);
  return memo[n];
}

/*
说明：
- 递归实现，自顶向下
- 使用 memo 保存已经计算的子问题结果，避免重复计算
*/


// 示例2：斐波那契数列（迭代+DP数组）
function fibDP(n) {
  if (n <= 1) return n;

  const dp = new Array(n + 1).fill(0);
  dp[0] = 0;
  dp[1] = 1;

  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }

  return dp[n];
}

/*
说明：
- 自底向上计算，迭代实现
- dp[i] 存储第 i 个斐波那契数
- 计算顺序保证 dp[i-1], dp[i-2] 已经计算好
*/


// 示例3：0-1背包问题（经典二维DP）

/*
问题描述：
给定 N 件物品和一个背包，物品 i 有重量 w[i] 和价值 v[i]，背包容量为 W，
求最多能装入背包的总价值。
*/

function knapsack01(weights, values, W) {
  const N = weights.length;
  // dp[i][j] 表示前 i 件物品，容量为 j 时的最大价值
  const dp = Array.from({ length: N + 1 }, () => new Array(W + 1).fill(0));

  for (let i = 1; i <= N; i++) {
    for (let j = 0; j <= W; j++) {
      if (weights[i - 1] > j) {
        // 当前物品重量超过容量，不能装
        dp[i][j] = dp[i - 1][j];
      } else {
        // 不装或装当前物品，取较大值
        dp[i][j] = Math.max(dp[i - 1][j], dp[i - 1][j - weights[i - 1]] + values[i - 1]);
      }
    }
  }

  return dp[N][W];
}

/*
说明：
- 状态定义清晰，二维dp数组 i 和 j 分别表示物品数量和容量
- 状态转移方程根据是否选择当前物品确定
- 时间复杂度 O(N*W)
*/


// 示例4：最长公共子序列（LCS）

function longestCommonSubsequence(text1, text2) {
  const m = text1.length, n = text2.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  return dp[m][n];
}

/*
说明：
- dp[i][j] 表示 text1 前 i 个字符和 text2 前 j 个字符的最长公共子序列长度
- 状态转移依赖字符是否匹配
*/


/*
总结 DP 模板步骤：
function dp(args) {
  // 1. 定义状态数组 dp[] 或 dp[][]
  // 2. 初始化状态
  // 3. 迭代计算状态，按顺序保证子状态已计算
  // 4. 返回最终结果
}
*/

