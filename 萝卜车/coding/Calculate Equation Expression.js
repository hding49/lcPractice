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
function computeExp(target, expressions) {
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
function computeExp(target, expressions) {
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

function computeExp(target, expressions) {
  // var -> array of RHS（支持多定义）
  const defs = new Map();
  for (const line of expressions) {
    const idx = line.indexOf("=");
    if (idx === -1) continue;
    const lhs = line.slice(0, idx).trim();
    const rhs = line.slice(idx + 1).trim();
    if (!defs.has(lhs)) defs.set(lhs, []);
    defs.get(lhs).push(rhs);
  }

  const memo = new Map(); // var -> number（仅缓存“唯一确定”的值）
  const visiting = new Set(); // 用于检测环
  const isInt = (s) => /^-?\d+$/.test(s);

  function evalVar(v) {
    // 允许 token 直接是数字字面量
    if (isInt(v)) return { ok: true, val: parseInt(v, 10) };
    if (memo.has(v)) return { ok: true, val: memo.get(v) };

    // 检测环
    if (visiting.has(v)) return { ok: false };

    const rhss = defs.get(v);
    if (!rhss || rhss.length === 0) return { ok: false }; // 未定义

    visiting.add(v);

    const values = new Set();
    let sawAny = false;

    for (const rhs of rhss) {
      const r = evalExpr(rhs);
      if (r.ok) {
        sawAny = true;
        values.add(r.val);
        if (values.size > 1) {
          visiting.delete(v);
          return { ok: false }; // 多定义结果冲突
        }
      }
      // 如果 r 不 ok，跳过这条定义，其他定义可能可解
    }

    visiting.delete(v);

    if (!sawAny) return { ok: false }; // 没有任何定义能确定出值（可能是环/未定义导致）

    // 唯一值成立
    const onlyVal = values.values().next().value;
    memo.set(v, onlyVal);
    return { ok: true, val: onlyVal };
  }

  function evalExpr(expr) {
    const tokens = expr.split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return { ok: false };

    let first = evalToken(tokens[0]);
    if (!first.ok) return { ok: false };
    let acc = first.val;

    for (let i = 1; i < tokens.length; i += 2) {
      const op = tokens[i];
      const nextTok = tokens[i + 1];
      if (nextTok === undefined || (op !== "+" && op !== "-"))
        return { ok: false };
      const r = evalToken(nextTok);
      if (!r.ok) return { ok: false };
      acc = op === "+" ? acc + r.val : acc - r.val;
    }
    return { ok: true, val: acc };
  }

  function evalToken(tok) {
    if (isInt(tok)) return { ok: true, val: parseInt(tok, 10) };
    return evalVar(tok);
  }

  const res = evalVar(target);
  return res.ok ? String(res.val) : "IMPOSSIBLE";
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
