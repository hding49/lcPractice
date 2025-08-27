// For this challenge, you will need to parse data from STDIN to find a character in a matrix.
// Below is an example of the input you will receive from STDIN:

// [2, 4]
// AFLOW
// BGLOW
// COSMW
// DENSX

// The first line is the [X, Y] coordinates of the character in the matrix (0,0 is the bottom left character).
// The remaining lines contain a matrix of random characters, with a character located at the coordinates from line 1.
// So, in the example above, we’re looking for a character at the coordinates [2,4].
// Moving right X spaces, and up Y, we find the character S. X is the character.

// Please write a program that reads from STDIN and prints the result to STDOUT.
// Use the Run Tests button to check your solution against the test cases.

// This challenge builds off of the previous one. The matrix follows the (x,y) system from the previous one.

// For this challenge, the goal is to construct a password from a series of chunks.
// The chunks will now look like:

// 1
// [3, 4]
// SOMETHING
// UMFJZOWE
// VALDKDMS
// ZANDOWSD
// WONDOROW
// 2
// [0, 3]
// MLFOWSD

// You will notice each chunk looks similar to the previous challenge with one addition —
// the first line is the (0-based) index of the password character.

// In our example:
// - First chunk positioned character index 1. Character at [3,4] is 'I'.
// - Second chunk positioned character index 2. Character at [0,3] is 'M'.

// So the password is "IM".

// Once you have processed all of the chunks you should print the password
// and you should process STDIN.

const fs = require("fs");

function solution1(path) {
  // 读文件，顺手去掉可能的 BOM，按行拆分（兼容 \n / \r\n）
  const text = fs.readFileSync(path, "utf8").replace(/^\uFEFF/, "");
  const lines = text.split(/\r?\n/).filter((s) => s !== "");

  // 解析第一行坐标 [x, y]（兼容 [2,3] / [2, 3]）
  const [x, y] = lines[0].slice(1, -1).split(/,\s*/).map(Number);

  // 其余行是矩阵（top -> bottom）
  const board = lines.slice(1);

  // 原点在左下：目标行索引需要翻转
  const row = board.length - 1 - y;
  const col = x;

  // 返回目标字符
  return board[row][col];
}

function solution2(path) {
  const text = fs.readFileSync(path, "utf8").replace(/^\uFEFF/, "");
  const lines = text.split(/\r?\n/); // 不过滤空行，解析时跳过
  const isIndexLine = (s) => /^\d+$/.test(s.trim()); // 纯数字行 = 新块 index

  const map = new Map(); // index -> char
  let i = 0;

  while (i < lines.length) {
    // 跳过空行
    while (i < lines.length && lines[i].trim() === "") i++;
    if (i >= lines.length) break;

    // 1) 读取 index
    if (!isIndexLine(lines[i])) break;
    const idx = parseInt(lines[i].trim(), 10);
    i++;

    // 2) 读取坐标 [x, y]
    const [x, y] = lines[i].slice(1, -1).split(/,\s*/).map(Number);
    i++;

    // 3) 读取矩阵（直到下一 index / 空行 / EOF）
    const board = [];
    while (
      i < lines.length &&
      !isIndexLine(lines[i]) &&
      lines[i].trim() !== ""
    ) {
      board.push(lines[i]);
      i++;
    }

    // 跳过矩阵后的空行（若有）
    while (i < lines.length && lines[i].trim() === "") i++;

    // 4) 取字符并记录
    const row = board.length - 1 - y;
    map.set(idx, board[row][x]);
  }

  // 组装密码（要求 0..maxIndex 连续存在）
  if (map.size === 0) return "";
  const maxIndex = Math.max(...map.keys());
  let out = "";
  for (let k = 0; k <= maxIndex; k++) {
    if (!map.has(k)) return ""; // 缺位则按空串处理（也可按题目需要调整）
    out += map.get(k);
  }
  return out;
}

function solution3(path) {
  // 读取文件，并去掉可能存在的 BOM 头
  const text = fs.readFileSync(path, "utf8").replace(/^\uFEFF/, "");
  // 按行拆分（兼容 \n 和 \r\n）
  const lines = text.split(/\r?\n/);

  // 判断一行是否是纯数字（表示 index 行）
  const isIndexLine = (s) => /^\d+$/.test(s.trim());

  /**
   * assemble(map): 尝试将一个密码的所有 chunk 拼接成完整字符串
   * map: index -> char
   * 规则：
   *   - index 必须从 0 到 maxIndex 连续存在，否则返回空串
   *   - 返回拼接好的字符串
   */
  function assemble(map) {
    if (map.size === 0) return "";
    const max = Math.max(...map.keys());
    for (let k = 0; k <= max; k++) if (!map.has(k)) return "";
    let s = "";
    for (let k = 0; k <= max; k++) s += map.get(k);
    return s;
  }

  const passwords = []; // 存放所有解析出的密码
  let i = 0; // 当前行号指针
  let curr = new Map(); // 当前正在解析的密码（index -> char）

  while (i < lines.length) {
    // 跳过前导空行
    while (i < lines.length && lines[i].trim() === "") i++;
    if (i >= lines.length) break;

    // ===== 开始读取一个密码的所有 chunk =====
    while (i < lines.length && lines[i].trim() !== "") {
      // 1) 读取 index 行
      if (!isIndexLine(lines[i])) {
        // 如果不是纯数字，说明输入格式不对，跳出当前密码解析
        break;
      }
      const idx = parseInt(lines[i].trim(), 10);
      i++;

      // 2) 读取坐标 [x, y]
      const coord = lines[i]?.trim() || "";
      const [x, y] = coord.slice(1, -1).split(/,\s*/).map(Number);
      i++;

      // 3) 读取矩阵行（直到遇到下一 index 或空行或文件结尾）
      const board = [];
      while (
        i < lines.length &&
        !isIndexLine(lines[i]) && // 不能是新的 index 行
        lines[i].trim() !== "" // 不能是空行
      ) {
        board.push(lines[i]);
        i++;
      }

      // 4) 根据 [x,y] 从矩阵里取字符
      const H = board.length; // 矩阵高度
      const row = H - 1 - y; // (0,0) 在左下，所以要翻转行号
      if (
        H > 0 &&
        row >= 0 &&
        row < H &&
        x >= 0 &&
        x < (board[row]?.length ?? 0)
      ) {
        // 坐标合法 → 存到 curr map
        curr.set(idx, board[row][x]);
      } else {
        // 越界或非法 → 存一个空字符串（让 assemble 失败）
        curr.set(idx, "");
      }
    }

    // 当前密码的 chunk 读取完毕（因为遇到空行或异常）
    const pwd = assemble(curr);
    if (pwd) passwords.push(pwd); // 如果完整，收集起来
    curr = new Map(); // 重置 map，准备下一组密码

    // 跳过分隔的空行
    while (i < lines.length && lines[i].trim() === "") i++;
  }

  // 文件末尾如果还有一个密码没收集（例如最后没有空行）
  if (curr.size > 0) {
    const pwd = assemble(curr);
    if (pwd) passwords.push(pwd);
  }

  // 返回所有密码（多密码时一行一个）
  return passwords.join("\n");
}
