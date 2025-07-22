// Question
// Robinhood is famous for its referral program. It’s exciting to see our users spreading the word across their friends and family. One thing that is interesting about the program is the network effect it creates. We would like to build a dashboard to track the status of the program. Specifically, we would like to learn about how people refer others through the chain of referral.

// For the purpose of this question, we consider that a person refers all other people down the referral chain. For example, A refers B, C, and D in a referral chain of A -> B -> C -> D. Please build a leaderboard for the top 3 users who have the most referred users along with the referral count.

// Referral rules:

// A user can only be referred once.
// Once the user is on the RH platform, he/she cannot be referred by other users. For example: if A refers B, no other user can refer A or B since both of them are on the RH platform.
// Referrals in the input will appear in the order they were made.
// Leaderboard rules:

// The user must have at least 1 referral count to be on the leaderboard.
// The leaderboard contains at most 3 users.
// The list should be sorted by the referral count in descending order.
// If there are users with the same referral count, break the ties by the alphabetical order of the user name.
// Input

// rh_users = ["A", "B", "C"]
// | | |
// v v v
// new_users = ["B", "C", "D"]
// Output

// ["A 3", "B 2", "C 1"]
// [execution time limit] 3 seconds (java)

// [memory limit] 1 GB

// [input] array.string rh_users

// A list of referring users.

// [input] array.string new_users

// A list of user that was referred by the users in the referrers array with the same order.

// [output] array.string

// An array of 3 users on the leaderboard. Each of the element here would have the "[user] [referral count]" format. For example, "A 4".


function referralLeaderboard(rh_users, new_users) {
  const graph = new Map();
  const joined = new Set(); // 存在平台上的用户（new_users）

  // Step 1: 构建推荐图
  for (let i = 0; i < rh_users.length; i++) {
    const referrer = rh_users[i];
    const newUser = new_users[i];

    // 如果新用户已加入平台，不能再次被推荐（题目限制）
    if (joined.has(newUser)) continue;

    // 添加推荐关系
    if (!graph.has(referrer)) {
      graph.set(referrer, []);
    }
    graph.get(referrer).push(newUser);

    // 加入平台
    joined.add(newUser);
  }

  // Step 2: DFS 计算每个人推荐链的总人数
  const referralCount = new Map();

  function dfs(user) {
    if (!graph.has(user)) return 0;

    let count = 0;
    for (const child of graph.get(user)) {
      count += 1 + dfs(child); // 包括下一级
    }
    referralCount.set(user, count);
    return count;
  }

  for (const user of graph.keys()) {
    if (!referralCount.has(user)) {
      dfs(user);
    }
  }

  // Step 3: 排序 + 构建结果
  const result = Array.from(referralCount.entries())
    .filter(([user, count]) => count >= 1)
    .sort((a, b) => {
      if (b[1] === a[1]) {
        return a[0].localeCompare(b[0]); // 字母排序
      }
      return b[1] - a[1]; // 数量降序
    })
    .slice(0, 3)
    .map(([user, count]) => `${user} ${count}`);

  return result;
}


referralLeaderboard(["A", "B", "C"], ["B", "C", "D"]);
// 输出: ["A 3", "B 2", "C 1"]
