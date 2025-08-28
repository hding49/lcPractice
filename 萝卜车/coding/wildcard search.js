// 第一问：实现 indexOf

// 给定主串 str 和目标串 target，返回 target 在 str 中第一次出现的下标；如果不存在，返回 -1。

// 不能用内置的 indexOf。

// 第二问：支持通配符 * 的查找

// 给定模式串 pattern（可能包含 *）和主串 str。

// * 可以匹配任意长度（含 0）的任意字符，其他字母必须按顺序出现。

// 返回 pattern 在 str 中第一次能匹配的起始下标；若不存在返回 -1。

// 第三问：是否 at most 1 edit distance

// 给定两个字符串，判断它们是否只需 一次或零次编辑就能相同。

// 允许的编辑：替换一个字符 / 插入一个字符 / 删除一个字符。

// 第四问：是否 at most K edit distances

// 给定两个字符串和整数 K，判断它们是否可以通过 K 次以内的编辑变得相同。

// 允许的编辑操作同上（替换 / 插入 / 删除）。

// =========================
// Q1. indexOf（不能用内置 indexOf）
// 采用 KMP，时间 O(n + m)，空间 O(m)
// =========================
function indexOfKMP(str, target) {
  const n = str.length,
    m = target.length;
  if (m === 0) return 0;
  if (m > n) return -1;

  // build LPS (longest prefix suffix) for target
  const lps = new Array(m).fill(0);
  for (let i = 1, len = 0; i < m; ) {
    if (target[i] === target[len]) {
      lps[i++] = ++len;
    } else if (len > 0) {
      len = lps[len - 1];
    } else {
      lps[i++] = 0;
    }
  }

  // KMP scan
  for (let i = 0, j = 0; i < n; ) {
    if (str[i] === target[j]) {
      i++;
      j++;
      if (j === m) return i - j;
    } else if (j > 0) {
      j = lps[j - 1];
    } else {
      i++;
    }
  }
  return -1;
}

// =========================
// Q2. wildcard `*` 版 indexOf（返回首个匹配起点）
// 规则：'*' 匹配任意长度(含0)；其他字母必须保持顺序
// 做法：合并连续 * -> 分割成纯字母 token；按序用 KMP 查找
// 若不以 * 开头：第一段 token 的出现位置就是候选起点
// =========================
function wildcardIndexOf(pattern, s) {
  // helpers
  function buildLPS(p) {
    const lps = new Array(p.length).fill(0);
    for (let i = 1, len = 0; i < p.length; ) {
      if (p[i] === p[len]) lps[i++] = ++len;
      else if (len > 0) len = lps[len - 1];
      else lps[i++] = 0;
    }
    return lps;
  }
  function kmpFind(text, pat, start) {
    if (pat.length === 0) return start;
    const lps = buildLPS(pat);
    let j = 0;
    for (let i = start; i < text.length; ) {
      if (text[i] === pat[j]) {
        i++;
        j++;
        if (j === pat.length) return i - j;
      } else if (j > 0) {
        j = lps[j - 1];
      } else {
        i++;
      }
    }
    return -1;
  }

  // normalize: collapse consecutive '*'
  let norm = "";
  for (let i = 0; i < pattern.length; i++) {
    const ch = pattern[i];
    if (ch === "*" && norm.endsWith("*")) continue;
    norm += ch;
  }

  if (norm.length === 0) return 0; // 空模式
  if (/^\*+$/.test(norm)) return 0; // 只有星号

  const tokens = norm.split("*").filter(Boolean);
  const startsWithStar = norm[0] === "*";

  if (startsWithStar) {
    // 起点可为 0，只需 tokens 依次出现
    let pos = 0;
    for (const tok of tokens) {
      const nxt = kmpFind(s, tok, pos);
      if (nxt === -1) return -1;
      pos = nxt + tok.length;
    }
    return 0;
  } else {
    // 第一个 token 的位置决定起点
    const first = tokens[0];
    let idx = kmpFind(s, first, 0);
    while (idx !== -1) {
      let pos = idx + first.length;
      let ok = true;
      for (let k = 1; k < tokens.length; k++) {
        const nxt = kmpFind(s, tokens[k], pos);
        if (nxt === -1) {
          ok = false;
          break;
        }
        pos = nxt + tokens[k].length;
      }
      if (ok) return idx;
      idx = kmpFind(s, first, idx + 1);
    }
    return -1;
  }
}

// =========================
// Q3. 是否 at most 1 edit distance（替换/插入/删除）
// 双指针一次通过，时间 O(min(n,m))，空间 O(1)
// =========================
function isAtMostOneEdit(s, t) {
  const n = s.length,
    m = t.length;
  if (Math.abs(n - m) > 1) return false;

  if (n === m) {
    // 等长：最多一次替换
    let diff = 0;
    for (let i = 0; i < n; i++) {
      if (s[i] !== t[i] && ++diff > 1) return false;
    }
    return true;
  } else {
    // 长度差 1：允许长串跳过一次
    const a = n > m ? s : t; // 长
    const b = n > m ? t : s; // 短
    let i = 0,
      j = 0,
      skipped = false;
    while (i < a.length && j < b.length) {
      if (a[i] === b[j]) {
        i++;
        j++;
      } else {
        if (skipped) return false;
        skipped = true;
        i++; // 跳过长串当前字符（对应一次插入/删除）
      }
    }
    return true; // 结尾多出的那个字符也算一次跳过
  }
}

// =========================
// Q4. 是否 at most K edit distances（编辑距离 ≤ K）
// 带宽 DP（Banded DP） + 剪枝：|n - m| > K 直接 false
// 时间 O(K * min(n, m))，空间 O(m)
// =========================
function isAtMostKEdits(s, t, K) {
  const n = s.length,
    m = t.length;
  if (K < 0) return false;
  if (Math.abs(n - m) > K) return false;
  if (K >= Math.max(n, m)) return true; // 粗暴上界：最多 n 或 m 次操作即可

  const INF = 1e9;
  // 只维护两行 DP，列范围限制在对角线 ±K 之内
  let prev = new Array(m + 1).fill(INF);
  let curr = new Array(m + 1).fill(INF);

  // i = 0 行：dp[0][j] = j（但超出带宽设为 INF）
  for (let j = 0; j <= Math.min(m, K); j++) prev[j] = j;

  for (let i = 1; i <= n; i++) {
    curr.fill(INF);

    // 本行允许的 j 范围（带宽）
    const jStart = Math.max(0, i - K);
    const jEnd = Math.min(m, i + K);

    // j = 0：dp[i][0] = i（若在带宽内）
    if (jStart === 0) curr[0] = i;

    let rowMin = INF;

    for (let j = jStart; j <= jEnd; j++) {
      if (j > 0) {
        const costReplace =
          prev[j - 1] !== INF
            ? prev[j - 1] + (s[i - 1] === t[j - 1] ? 0 : 1)
            : INF;
        const costInsert = curr[j - 1] !== INF ? curr[j - 1] + 1 : INF; // 在 s 中插入/在 t 中前进
        const costDelete = prev[j] !== INF ? prev[j] + 1 : INF; // 在 s 中删除/在 t 中停
        const val = Math.min(costReplace, costInsert, costDelete);
        curr[j] = Math.min(curr[j], val);
      }
      rowMin = Math.min(rowMin, curr[j]);
    }

    if (rowMin > K) return false; // 早停：当前行最小值已超过 K

    // 下一轮
    const tmp = prev;
    prev = curr;
    curr = tmp;
  }

  return prev[m] <= K;
}
