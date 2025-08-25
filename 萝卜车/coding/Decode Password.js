// A security system hides a password character within a grid, with its exact location indicated by coordinates.

// You are given a list of strings text that simulates the password board. The first element of text is a coordinate in the format "[x, y]", where x and y are zero-based integers. Each subsequent element represents a row of the board, composed of uppercase English letters, listed from top to bottom.

// The origin (0, 0) is at the bottom-left corner of the grid. The x axis increases to the right, and the y axis increases upwards.

// Your task is to return the letter found at the specified coordinate on the password board.

// Constraints:

// 1 ≤ text.length ≤ 1000
// All board rows have equal length, each between 1 and 1000.
// The coordinate [x, y] is always within the board boundaries.
// All characters in the board are uppercase English letters.
// Example 1:

// Input: text = ["[2, 3]", "ABCDEFG", "HIGKLMN", "OPQRSTU", "VWXYZAB"]
// Output: "C"
// Explanation:

// [2, 3]
// ABCDEFG
// HIGKLMN
// OPQRSTU
// VWXYZAB
// The board's bottom row is "VWXYZAB" (y = 0), so row y = 3 is "ABCDEFG". The character at column x = 2 is "C".

// Example 2:

// Input: text = ["[0, 0]", "ABCDEFG", "HIGKLMN", "OPQRSTU", "VWXYZAB"]
// Output: "V"

// Example 3:

// Input: text = ["[6, 3]", "ABCDEFG", "HIGKLMN", "OPQRSTU", "VWXYZAB"]
// Output: "G"

// class Solution {
//     public decode(text: string[]): string {
//         let i = 0;
//         const coords = text[i].substring(1, text[i].length - 1).split(", ");
//         const x = parseInt(coords[0]);
//         const y = parseInt(coords[1]);

//         const board: string[] = [];
//         i++;
//         while (i < text.length && text[i].trim() !== "") {
//             board.unshift(text[i]); // reversely add the line
//             i++;
//         }

//         return board[y].charAt(x);
//     }
// }

class Solution {
  decode(text) {
    // 解析坐标
    const [x, y] = text[0]
      .slice(1, -1) // 去掉 [ ]
      .split(", ")
      .map(Number);

    // 构建棋盘：把输入的 top→bottom 翻转为 bottom→top
    const board = text.slice(1).reverse();

    // 取出目标字符
    return board[y][x];
  }
}

const sol = new Solution();

console.log(sol.decode(["[2, 3]", "ABCDEFG", "HIGKLMN", "OPQRSTU", "VWXYZAB"])); // "C"
console.log(sol.decode(["[0, 0]", "ABCDEFG", "HIGKLMN", "OPQRSTU", "VWXYZAB"])); // "V"
console.log(sol.decode(["[6, 3]", "ABCDEFG", "HIGKLMN", "OPQRSTU", "VWXYZAB"])); // "G"
