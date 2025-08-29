// 第一问

// 输入：第一行是坐标 [x,y]，后面是一个字符矩阵（从上到下）。

// 要求：原点 (0,0) 在左下角，返回矩阵中该坐标对应的字符。

// 第二问

// 输入：由多个 chunk 组成。

// 每个 chunk 第一行是字符在密码中的索引（0-based）。

// 第二行是坐标 [x,y]。

// 后续是矩阵。

// 要求：从每个 chunk 提取字符，按索引顺序拼接成一个完整密码。

// 第三问

// 输入：包含多个密码，每个密码由一组 chunk 构成，用 空行分隔。

// 要求：对每组 chunk 执行第二问的逻辑，拼成一个密码，输出所有密码。

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
  const lines = text.split(/\r?\n/); // CHANGED from Q1: 不过滤空行，保留原始行序
  const isIndexLine = (s) => /^\d+$/.test(s.trim()); // NEW in Q2: 识别“纯数字行”= 新块 index

  const map = new Map(); // NEW in Q2: index -> char 的映射，用来存储密码中各个位置的字符
  let i = 0; // NEW in Q2: 行游标，逐行扫描文件内容

  while (i < lines.length) {
    // NEW in Q2: 主循环读取每个 chunk
    while (i < lines.length && lines[i].trim() === "") i++; // NEW in Q2: 跳过 chunk 间空行
    if (i >= lines.length) break; // NEW in Q2: 如果到达文件结尾则退出循环

    if (!isIndexLine(lines[i])) break; // NEW in Q2: 非法格式保守退出（当前行不是 index）
    const idx = parseInt(lines[i].trim(), 10); // NEW in Q2: 读取 index，表示该字符在密码中的位置
    i++; // NEW in Q2: 游标移到下一行（坐标行）

    const [x, y] = lines[i].slice(1, -1).split(/,\s*/).map(Number); // CHANGED from Q1: 坐标来自当前 chunk 的第二行
    i++; // NEW in Q2: 游标移到矩阵行

    const board = []; // NEW in Q2: 收集当前 chunk 的矩阵行
    while (
      i < lines.length &&
      !isIndexLine(lines[i]) &&
      lines[i].trim() !== ""
    ) {
      board.push(lines[i]); // NEW in Q2: 将矩阵行加入数组（按 top->bottom 顺序）
      i++; // NEW in Q2: 游标继续向下
    }
    while (i < lines.length && lines[i].trim() === "") i++; // NEW in Q2: 跳过矩阵后的空行

    const row = board.length - 1 - y; // CHANGED from Q1: 由于原点在左下，需要翻转行索引
    map.set(idx, board[row][x]); // NEW in Q2: 把提取出的字符存入对应的 index 位置
  }

  if (map.size === 0) return ""; // NEW in Q2: 如果没有任何块，直接返回空字符串
  const maxIndex = Math.max(...map.keys()); // NEW in Q2: 找出密码的最大索引位置
  let out = ""; // NEW in Q2: 用于拼接结果字符串
  for (let k = 0; k <= maxIndex; k++) {
    // NEW in Q2: 依次拼接 0..maxIndex 的字符
    if (!map.has(k)) return ""; // NEW in Q2: 如果缺少某个索引，密码不完整，返回空串
    out += map.get(k); // NEW in Q2: 否则将字符追加到结果中
  }
  return out; // CHANGED from Q1: 返回拼好的完整密码
}

function solution3(path) {
  const text = fs.readFileSync(path, "utf8").replace(/^\uFEFF/, "");
  const lines = text.split(/\r?\n/); // 与 solution2 一样：保留空行
  const isIndexLine = (s) => /^\d+$/.test(s.trim());

  const map = new Map(); // 与 solution2 一样
  let i = 0; // 与 solution2 一样

  while (i < lines.length) {
    // 与 solution2 一样：跳过 chunk 间空行
    while (i < lines.length && lines[i].trim() === "") i++;
    if (i >= lines.length) break;

    // 与 solution2 一样：读取 index
    if (!isIndexLine(lines[i])) break;
    const idx = parseInt(lines[i].trim(), 10);
    i++;

    // ★ 仅此处为第三问新增：若 index 重复，表示第二个密码开始 → 停止解析第一个密码
    if (map.has(idx)) break;

    // 与 solution2 一样：读取坐标
    const [x, y] = lines[i].slice(1, -1).split(/,\s*/).map(Number);
    i++;

    // 与 solution2 一样：读取矩阵直到下一 index / 空行 / EOF
    const board = [];
    while (
      i < lines.length &&
      !isIndexLine(lines[i]) &&
      lines[i].trim() !== ""
    ) {
      board.push(lines[i]);
      i++;
    }
    // 与 solution2 一样：跳过矩阵后的空行
    while (i < lines.length && lines[i].trim() === "") i++;

    // 与 solution2 一样：坐标系翻转并取字符
    const row = board.length - 1 - y;
    map.set(idx, board[row][x]);
  }

  // 与 solution2 一样：组装并返回（要求 0..maxIndex 连续）
  if (map.size === 0) return "";
  const maxIndex = Math.max(...map.keys());
  let out = "";
  for (let k = 0; k <= maxIndex; k++) {
    if (!map.has(k)) return "";
    out += map.get(k);
  }
  return out;
}

// ① 第一问（solution1）

// Time 时间复杂度

// EN: O(N) where N is the total size of the input (reading file + splitting lines). The actual lookup of the target cell is O(1).

// ZH: O(N)，其中 N 为输入总大小（读文件与分行）。实际取目标字符是 O(1)。

// Space 空间复杂度

// EN: O(N) to hold the lines/board in memory. Extra/auxiliary space beyond the parsed input is O(1).

// ZH: O(N)（存放整份输入的行与矩阵）。除输入存储外的额外空间为 O(1)。

// Interview blurb（面试可说）

// EN: “We read and split the whole input once—so time is linear in input size, O(N). The actual index calculation and access are O(1).
// Space is O(N) for the parsed lines; auxiliary space is constant.”

// ZH: “整体读入并分行一次，所以时间是 O(N)；定位与访问是 O(1)。空间为存输入的 O(N)，额外空间 O(1)。”

// ② 第二问（solution2：单个密码、多个 chunk）

// Time 时间复杂度

// EN: O(N + P) where N is total input size and P is the password length (max index + 1).
// We linearly scan lines, parse each chunk, and do one pass to assemble the password ⇒ effectively O(N).

// ZH: O(N + P)，N 为输入总大小，P 为密码长度（最大索引+1）。逐行线性扫描并解析 chunk，最后拼一次密码，本质上近似 O(N)。

// Space 空间复杂度

// EN: O(N) to store all lines; auxiliary peak is O(B + P) where B is the size of the largest matrix chunk we hold at once,
// and P is the size of the index→char map. Since we discard each board after use, peak is dominated by the largest board.

// ZH: O(N)（保存所有行）；额外峰值为 O(B + P)，其中 B 是单个最大矩阵块的大小、P 是索引映射大小。矩阵按块处理，用完即丢，峰值由最大块决定。

// Interview blurb（面试可说）

// EN: “Single pass over the input to parse chunks, plus one pass to assemble 0..maxIndex: time O(N + P) ≈ O(N).
// Memory is O(N) for the loaded input; extra peak O(B + P) due to the largest board held and the index map.”

// ZH: “线性扫描解析各个 chunk，最后按 0..maxIndex 拼接：时间 O(N + P)，近似 O(N)；内存 O(N) 存输入，额外峰值 O(B + P)（最大矩阵块 + 索引映射）。”

// ③ 第三问（solution3：多个密码，空行分组）

// 时间复杂度

// EN: O(N) in the worst case, since we may still scan the entire file if no index repeats. In the average case, we often stop earlier. Assembling the first password is O(P) where P is its length, so overall O(N + P) ≈ O(N).

// ZH: 最坏情况下需要扫描完整个文件，所以是 O(N)；通常情况下会更早停止。组装第一个密码是 O(P)（P = 密码长度），整体是 O(N + P)，近似 O(N)。

// 空间复杂度

// EN: O(N) to store input lines; auxiliary is O(B + P) where B is the current board size and P is the size of the first password’s index map. Unlike before, we only keep one password, not all, so there is no ΣP_i.

// ZH: O(N) 存输入；额外空间是 O(B + P)，其中 B 是当前矩阵大小，P 是第一个密码的 map 大小。与之前不同，现在只存一个密码，没有 ΣP_i。

// 面试时可说

// EN: “We scan the file linearly until we either finish the first password or hit a repeated index. That’s O(N) time in the worst case. Space is O(N) for the input lines plus O(B + P) for the current board and index map. We only keep the first password, so memory is lower than before.”

// ZH: “我们线性扫描文件，直到解析出第一个密码或者遇到重复 index。最坏情况时间是 O(N)，组装密码是 O(P)，整体 O(N)。空间是 O(N) 存输入，再加 O(B + P) 存当前矩阵和 index map。相比之前保存所有密码，这里只保存第一个，内存更小。”
