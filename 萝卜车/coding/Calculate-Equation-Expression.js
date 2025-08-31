// Round 1（基础版）

// 输入：一个目标变量 + 一组赋值语句。

// 右侧（RHS）只能是整数或单个变量。

// 任务：递归解析目标变量的值。

// Round 2（Follow-up 1）

// 输入格式不变。

// RHS 可以包含整数、变量和 + / - 运算（单层、多项）。

// 任务：支持加减运算后，计算目标变量的值。

// Round 3（Follow-up 2）

// 输入格式不变，但允许：

// 循环依赖

// 未定义变量

// 多次定义同一变量

// 任务：如果目标值唯一且可解析，返回值；否则返回空串 ""。

/**
 * Round 1: 右侧 expression 只可能是：
 *   - 单个整数   例："T1 = 5"
 *   - 单个变量名 例："T2 = T1"
 * 无环、每个变量恰好一次定义
 * 目标：解析 target 的值（字符串）
 */

// const fs = require("fs");
// const input = fs.readFileSync(0, "utf8");
// solve(input);

// function solve(input) {
//   const lines = input.trim().split(/\r?\n/);
//   if (lines.length < 2) {
//     console.log("");
//     return;
//   }
//   const target = lines[0].trim();
//   const expressions = lines.slice(1);
//   console.log(computeExp(target, expressions));
// }

/**
 * 核心思路：
 * - 建立 var -> rhs 的映射（唯一定义）
 * - 自顶向下 DFS：evalVar(v)
 * - 记忆化避免重复计算
 */
function computeExp1(target, expressions) {
  // 解析：var -> rhs（字符串）
  const defs = new Map();
  for (const line of expressions) {
    const idx = line.indexOf("=");
    if (idx === -1) continue;
    const lhs = line.slice(0, idx).trim();
    const rhs = line.slice(idx + 1).trim();
    defs.set(lhs, rhs);
  }

  const memo = new Map();
  const isInt = (s) => /^-?\d+$/.test(s);

  function evalVar(v) {
    // 常量直接返回
    if (isInt(v)) return parseInt(v, 10);

    // 记忆化
    if (memo.has(v)) return memo.get(v);

    // 取出 v 的定义（本轮保证一定存在且无环）
    const rhs = defs.get(v);
    // rhs 要么是整数，要么是变量名
    const val = isInt(rhs) ? parseInt(rhs, 10) : evalVar(rhs);

    memo.set(v, val);
    return val;
  }

  return String(evalVar(target));
}

// Round 1 (Basic: single integer or variable on RHS)

// Time Complexity:
// Each variable is evaluated at most once thanks to memoization. Evaluating a variable either returns an integer or recursively resolves another variable.
// → O(N) where N is the number of expressions.

// Space Complexity:

// defs map stores up to N expressions.

// memo caches values for up to N variables.

// Call stack depth is at most N in worst case (long chain).
// → O(N) overall.

// How to say in interview:
// “Each variable is resolved once with memoization, so the time complexity is linear in the number of expressions, O(N).
// The space complexity is also O(N) because of the hash maps and recursion stack.”

/**
 * Round 2: 右侧 expression 允许：
 *   - 多个变量/整数 + 单层加减（用空格分隔），如 "T3 = T1 + 7 - T2"
 * 依旧：每个变量恰好一次定义、无环、无未定义
 * 目标：解析 target 的值（字符串）
 */

/**
 * 思路扩展点：
 * - 增加 evalExpr(expr)：按空格分词，左结合处理 + / -
 * - token 是整数则直接解析；否则当作变量递归求值
 */
function computeExp2(target, expressions) {
  // var -> rhs（字符串）
  const defs = new Map();
  for (const line of expressions) {
    const idx = line.indexOf("=");
    if (idx === -1) continue;
    const lhs = line.slice(0, idx).trim();
    const rhs = line.slice(idx + 1).trim();
    defs.set(lhs, rhs);
  }

  const memo = new Map();
  const isInt = (s) => /^-?\d+$/.test(s);

  function evalVar(v) {
    if (isInt(v)) return parseInt(v, 10);
    if (memo.has(v)) return memo.get(v);
    const rhs = defs.get(v);
    const val = evalExpr(rhs);
    memo.set(v, val);
    return val;
  }

  // 解析并计算一个表达式（形如 "T1 + 7 - T2" 或 "T1" 或 "5"）
  function evalExpr(expr) {
    const tokens = expr.split(/\s+/).filter(Boolean);
    // 第一个 token
    let acc = evalToken(tokens[0]);

    // 后续以对儿出现：op token
    for (let i = 1; i < tokens.length; i += 2) {
      const op = tokens[i];
      const next = evalToken(tokens[i + 1]);
      acc = op === "+" ? acc + next : acc - next;
    }
    return acc;
  }

  function evalToken(tok) {
    return isInt(tok) ? parseInt(tok, 10) : evalVar(tok);
  }

  return String(evalVar(target));
}

// Round 2 (Follow-up 1: + / - expressions allowed)

// Time Complexity:
// For each variable, when we evaluate its RHS, we tokenize the expression and process it linearly.
// If the total number of tokens across all expressions is M, each token is resolved at most once due to memoization.
// → O(M) where M is the total size of all expressions (still linear).

// Space Complexity:

// defs map stores RHS strings (total size M).

// memo caches up to N variable values.

// Recursion depth at most N.
// → O(N + M), which is still linear.

// How to say in interview:
// “The runtime is linear in the total size of the input expressions, O(M),
// because each token is processed once. Space is also linear, O(N + M).”

/**
 * Round 3: 现在可能出现不确定性，要求“无法唯一解析”则返回空串 ""：
 *   1) 依赖成环
 *   2) 目标（或依赖链上）未定义
 *   3) "同一变量多次定义且可达结果不一致"（冲突）
 *
 * 变化：
 *   - defs: var -> [rhs1, rhs2, ...] 支持多定义
 *   - visiting: Set 检测 DFS 环
 *   - evalVar 返回 { ok, val }：ok=false 表示无法确定（环/未定义/冲突）
 *   - 对同一变量的多条定义：能算出来的结果如果出现 ≥2 个不同值 → 冲突
 */

function computeExp3(target, expressions) {
  // 构建一个映射：变量 -> RHS 数组（支持多重定义）
  const defs = new Map();
  for (const line of expressions) {
    const idx = line.indexOf("=");
    if (idx === -1) continue;
    const lhs = line.slice(0, idx).trim(); // 等号左边的变量
    const rhs = line.slice(idx + 1).trim(); // 等号右边的表达式
    if (!defs.has(lhs)) defs.set(lhs, []);
    defs.get(lhs).push(rhs); // 一个变量可能有多条定义
  }

  const memo = new Map(); // 记忆化缓存：变量 -> 已经唯一确定的数值
  const visiting = new Set(); // DFS 递归栈，用来检测环
  const isInt = (s) => /^-?\d+$/.test(s); // 简单判断 token 是否是整数

  // 递归解析一个变量的值
  function evalVar(v) {
    if (isInt(v)) return { ok: true, val: parseInt(v, 10), cycle: false }; // 常量直接返回
    if (memo.has(v)) return { ok: true, val: memo.get(v), cycle: false }; // 已缓存值直接返回
    if (visiting.has(v)) return { ok: false, cycle: true }; // 变量在递归栈中，再次访问 -> 环

    const rhss = defs.get(v);
    if (!rhss || rhss.length === 0) return { ok: false, cycle: false }; // 变量未定义

    visiting.add(v);

    const values = new Set(); // 收集所有成功算出的结果
    let sawCycle = false; // 标记：子分支是否出现过环
    let successCount = 0; // 成功算出的定义条数

    for (const rhs of rhss) {
      const r = evalExpr(rhs); // 递归解析该 RHS
      if (r.cycle) sawCycle = true; // 子分支中见过环，记录下来
      if (r.ok) {
        successCount++; // 统计成功的定义条数
        values.add(r.val);
        if (values.size > 1) {
          // 多定义算出不同结果 -> 冲突
          visiting.delete(v);
          return { ok: false, cycle: sawCycle };
        }
      }
      // r.ok === false：该定义失败（未定义/环/语法错误），后续统一检查
    }

    visiting.delete(v);

    // 严格规则 1：如果子分支见过环 -> 整体失败
    if (sawCycle) return { ok: false, cycle: true };

    // 严格规则 2：必须所有定义都成功 -> 否则失败
    if (successCount !== rhss.length) return { ok: false, cycle: false };

    // 此时唯一确定，缓存并返回
    const onlyVal = values.values().next().value;
    memo.set(v, onlyVal);
    return { ok: true, val: onlyVal, cycle: false };
  }

  // 解析并计算一个表达式（可能是常量/变量/带 + - 的式子）
  function evalExpr(expr) {
    const tokens = expr.split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return { ok: false, cycle: false };

    let first = evalToken(tokens[0]);
    if (!first.ok) return { ok: false, cycle: first.cycle };
    let acc = first.val;
    let sawCycle = first.cycle;

    // 从左到右处理 + / - 运算
    for (let i = 1; i < tokens.length; i += 2) {
      const op = tokens[i];
      const nextTok = tokens[i + 1];
      if (nextTok === undefined || (op !== "+" && op !== "-"))
        return { ok: false, cycle: sawCycle };
      const r = evalToken(nextTok);
      if (!r.ok) return { ok: false, cycle: sawCycle || r.cycle };
      sawCycle = sawCycle || r.cycle;
      acc = op === "+" ? acc + r.val : acc - r.val;
    }
    return { ok: true, val: acc, cycle: sawCycle };
  }

  // 判断 token 是数字还是变量
  function evalToken(tok) {
    if (isInt(tok)) return { ok: true, val: parseInt(tok, 10), cycle: false };
    return evalVar(tok);
  }

  const res = evalVar(target);
  // 最终：只有在唯一确定且无环时返回数值，否则返回 "IMPOSSIBLE"
  return res.ok && !res.cycle ? String(res.val) : "IMPOSSIBLE";
}

// Round 3 (Follow-up 2: cycles, multiple definitions, conflicts)

// Time Complexity:
// Each variable may have multiple RHS definitions, but we evaluate each definition at most once.
// Each RHS is tokenized and processed linearly.
// Cycle detection and conflict checking only add constant overhead per variable.
// → O(M), still linear in total expression size.

// Space Complexity:

// defs map stores possibly multiple RHS per variable (total size M).

// memo stores resolved values for up to N variables.

// visiting set is at most N during DFS.
// → O(N + M) overall.

// How to say in interview:
// “In this version, even with cycles and multiple definitions, each expression is still only visited once.
// So the time complexity remains O(M), linear in the total size of the input.
// The space complexity is also O(N + M), for the maps and recursion.”

console.log(
  "Solution 1 output:",
  computeExp1("T2", ["T1 = 1", "T2 = T3", "T3 = T1"])
); //
console.log(
  "Solution 2 output:",
  computeExp2("T2", ["T1 = 1", "T2 = 2 + T4", "T3 = T1 - 4", "T4 = T1 + T3"])
);
console.log("Solution 3 output:", computeExp3("T2", ["T1=4", "T1 = 2 + T2"])); // IMPOSSIBLE

console.log(
  "Solution 3 output:",
  computeExp3("T2", ["T2 = T1 - 2", "T1 = 4", "T1 = 2 + T2"])
); // IMPOSSIBLE

// 1) 基础可解（链式）
console.log(computeExp3("T2", ["T1 = 1", "T2 = T1"])); // "1"

// 2) 含加减（单层）
console.log(
  computeExp3("T3", ["T1 = 1", "T2 = 2 + T4", "T3 = T1 - 4", "T4 = T1 + T3"])
); // "-3"

// 3) 目标涉及的成环 → 失败
console.log(computeExp3("T1", ["T1 = T2", "T2 = T1"])); // IMPOSSIBLE

// 4) 存在有环的分支
console.log(computeExp3("T2", ["T2 = T1 - 2", "T1 = 4", "T1 = 2 + T2"])); // IMPOSSIBLE

// 5) 目标未定义 → 失败
console.log(computeExp3("T1", ["T2 = 1", "T3 = 2"])); // IMPOSSIBLE

// 6) 多定义一致（都可达且相同）→ 接受
console.log(computeExp3("A", ["A = 3", "A = 1 + 2"])); // "3"

// 7) 多定义冲突（都可达且不同）→ 失败
console.log(computeExp3("A", ["A = 3", "A = 4"])); // IMPOSSIBLE

// 8) 一条定义可达可解，另一条不可达/解不出
console.log(
  computeExp3("B", [
    "B = C + 1", // C 未定义 → 这一条解不出
    "B = 5",
  ])
); // "IMPOSSIBLE"

// 9) 深链条（确保 memo 与 DFS 正常工作）
console.log(computeExp3("Z", ["X = 2", "Y = X + 3", "Z = Y - 1"])); // "4"

// 10) 有环但不影响目标（环在无关分支上）→ 接受
console.log(
  computeExp3("T", [
    "T = 10",
    "U = V",
    "V = U", // 与 T 无依赖关系的环
  ])
); // "10"

console.log(computeExp3("A", ["A = 3", "A = 1 + 2"])); // "3"
