// You are given a string array arr where the first element of it is the target, which is the name of a variable whose value you need to compute. The remaining elements each describe an assignment in the format:

// variable = expression
// Here, expression is either an integer constant or another variable name. The value of a variable may be a direct integer or may depend on a chain of assignments referencing other variables. For example, "T1 = 5" and "T2 = T1".

// You may assume that all assignments are valid, and each variable is assigned exactly once. Return the string representation of the target value by resolving all dependencies.

// Constraints:

// arr.length ≥ 2
// The first element of arr is the target variable (a non-empty string).
// All variable names are non-empty and assigned exactly once.
// There are no cycles or undefined variables.
// All values and results are strings representing integers, and are within the range [
// −
// 10
// 3
// −10
// 3
//  ,
// 10
// 3
// 10
// 3
//  ].
// Example 1:

// Input: arr = ["T2", "T1 = 5", "T2 = T1"]
// Output: "5"
// Explanation: The target value for "T2" can be determined as T2 = T1 = 5.

// Example 2:

// Input: arr = ["X", "X = -10"]
// Output: "10"

// Example 3:

// Input: arr = ["T3", "T1 = 2", "T2 = T1", "T3 = T2"]
// Output: "2"

/**
 * Example of using an existing data structure:
 * import { PriorityQueue } from 'datastructures-js';
 */

/**
 * CodeSignal 题目通常使用标准输入/输出。
 * 假设输入格式：
 *   第一行：目标变量 (target)
 *   后续每行：一个赋值表达式，例如 "T1 = 1"、"T2 = T1 + 3"
 *   输入以 EOF 结束
 *
 * 输出：
 *   如果 target 能唯一解析，输出其值（字符串）
 *   否则输出空串 ""
 */

// 主入口：读取标准输入并调用 solve
const fs = require("fs");
const input = fs.readFileSync(0, "utf8"); // 读取所有输入
solve(input);

function solve(input) {
  const lines = input.trim().split(/\r?\n/);
  if (lines.length < 2) {
    console.log("");
    return;
  }

  const target = lines[0].trim(); // 第一行是目标变量
  const expressions = lines.slice(1); // 其余行是赋值语句

  console.log(computeExp(target, expressions));
}

/**
 * 计算 target 的值
 * @param {string} target - 目标变量
 * @param {string[]} expressions - 表达式数组
 * @returns {string} - target 的值，或 ""（不可解析）
 */
function computeExp(target, expressions) {
  // 构建定义表：变量 -> 可能的右侧表达式列表
  // 注意：第三问允许同一变量多次定义
  const defs = new Map();
  for (const line of expressions) {
    const idx = line.indexOf("=");
    if (idx === -1) continue; // 防御性处理
    const lhs = line.slice(0, idx).trim();
    const rhs = line.slice(idx + 1).trim();
    if (!defs.has(lhs)) defs.set(lhs, []);
    defs.get(lhs).push(rhs);
  }

  const memo = new Map(); // 缓存已确定的唯一值：变量 -> number
  const visiting = new Set(); // 当前递归栈上的变量，用于检测环

  const isInt = (s) => /^-?\d+$/.test(s); // 判断是否为整数常量

  /**
   * 解析单个 token（整数或变量）
   */
  function evalToken(tok) {
    if (isInt(tok)) return { ok: true, val: parseInt(tok, 10) };
    return evalVar(tok);
  }

  /**
   * 解析右侧表达式（可能是整数 / 变量 / 加减组合）
   * 使用空格分词，例如 "T3 - 5", "2 + T4"
   */
  function evalExpr(expr) {
    const tokens = expr.split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return { ok: false };

    // 处理第一个 token
    let first = evalToken(tokens[0]);
    if (!first.ok) return { ok: false };
    let acc = first.val;

    // 依次处理 "+ term" 或 "- term"
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

  /**
   * 递归解析变量的值
   * - 使用 DFS 向下展开依赖
   * - 检测环
   * - 支持多定义冲突检测
   */
  function evalVar(v) {
    if (isInt(v)) return { ok: true, val: parseInt(v, 10) }; // 常量直接返回
    if (memo.has(v)) return { ok: true, val: memo.get(v) }; // 已缓存

    if (visiting.has(v)) return { ok: false }; // 检测到环 → 不可解析
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
          // 出现多个不同值 → 冲突
          visiting.delete(v);
          return { ok: false };
        }
      }
      // 如果 r 不 ok，则忽略该定义，可能是环或未定义导致
    }

    visiting.delete(v);

    if (!sawAny) return { ok: false }; // 没有任何定义能成功解析

    // 唯一确定值
    const onlyVal = values.values().next().value;
    memo.set(v, onlyVal);
    return { ok: true, val: onlyVal };
  }

  // 从 target 开始递归解析
  const res = evalVar(target);
  return res.ok ? String(res.val) : "";
}
