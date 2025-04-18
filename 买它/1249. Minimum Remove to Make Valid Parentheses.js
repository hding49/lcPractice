// 1249. Minimum Remove to Make Valid Parentheses
// Medium
// Topics
// Companies
// Hint
// Given a string s of '(' , ')' and lowercase English characters.

// Your task is to remove the minimum number of parentheses ( '(' or ')', in any positions ) so that the resulting parentheses string is valid and return any valid string.

// Formally, a parentheses string is valid if and only if:

// It is the empty string, contains only lowercase characters, or
// It can be written as AB (A concatenated with B), where A and B are valid strings, or
// It can be written as (A), where A is a valid string.
 

// Example 1:

// Input: s = "lee(t(c)o)de)"
// Output: "lee(t(c)o)de"
// Explanation: "lee(t(co)de)" , "lee(t(c)ode)" would also be accepted.
// Example 2:

// Input: s = "a)b(c)d"
// Output: "ab(c)d"
// Example 3:

// Input: s = "))(("
// Output: ""
// Explanation: An empty string is also valid.
 

// Constraints:

// 1 <= s.length <= 105
// s[i] is either '(' , ')', or lowercase English letter.

const minRemoveToMakeValid = (str) => {
  const stack = []; // 用来存储左括号的索引
  const splitted_str = str.split(""); // 拆成数组，方便修改字符

  // 第一次遍历，处理多余的右括号
  for (let i = 0; i < str.length; i++) {
      const char = str[i];
      if (char === "(") {
          stack.push(i); // 左括号位置入栈
      } else if (char === ")") {
          if (stack.length === 0) {
              // 没有配对的左括号，删除当前的右括号
              splitted_str[i] = "";
          } else {
              stack.pop(); // 找到一对括号，匹配掉
          }
      }
  }

  // 第二次遍历，处理多余的左括号
  for (let i = 0; i < stack.length; i++) {
      const index = stack[i];
      splitted_str[index] = ""; // 删除多余的左括号
  }

  // 拼接成最终字符串
  return splitted_str.join("");
};
