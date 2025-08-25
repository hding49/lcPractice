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

class Solution {
  resolveExpression(arr) {
    const target = arr[0];
    const assignments = new Map();

    // 解析赋值语句
    for (let i = 1; i < arr.length; i++) {
      const [variable, expr] = arr[i].split("=").map((s) => s.trim());
      assignments.set(variable, expr);
    }

    const memo = new Map();

    function evaluate(varName) {
      if (memo.has(varName)) return memo.get(varName);

      const expr = assignments.get(varName);

      // 如果是数字
      if (!isNaN(expr)) {
        memo.set(varName, expr);
        return expr;
      }

      // 否则是另一个变量
      const value = evaluate(expr);
      memo.set(varName, value);
      return value;
    }

    return evaluate(target);
  }
}

// 测试
const sol = new Solution();
console.log(sol.resolveExpression(["T2", "T1 = 5", "T2 = T1"])); // "5"
console.log(sol.resolveExpression(["X", "X = -10"])); // "-10"
console.log(sol.resolveExpression(["T3", "T1 = 2", "T2 = T1", "T3 = T2"])); // "2"

// class Solution {
//   public resolveExpression(arr: string[]): string {
//     const target = arr[0];
//     const assignments = new Map<string, string>();

//     // 解析赋值语句
//     for (let i = 1; i < arr.length; i++) {
//       const [variable, expr] = arr[i].split("=").map(s => s.trim());
//       assignments.set(variable, expr);
//     }

//     const memo = new Map<string, string>();

//     const evaluate = (varName: string): string => {
//       if (memo.has(varName)) return memo.get(varName)!;

//       const expr = assignments.get(varName)!;

//       // 如果是数字
//       if (!isNaN(Number(expr))) {
//         memo.set(varName, expr);
//         return expr;
//       }

//       // 否则是另一个变量
//       const value = evaluate(expr);
//       memo.set(varName, value);
//       return value;
//     };

//     return evaluate(target);
//   }
// }

// // 测试
// const sol = new Solution();
// console.log(sol.resolveExpression(["T2", "T1 = 5", "T2 = T1"])); // "5"
// console.log(sol.resolveExpression(["X", "X = -10"]));            // "-10"
// console.log(sol.resolveExpression(["T3", "T1 = 2", "T2 = T1", "T3 = T2"])); // "2"

// class Solution {
//     public resolveExpression(arr: string[]): string {
//         const target = arr[0];
//         const equations = arr.slice(1);

//         const values = new Map<string, number>(); // Store known values
//         const dependencies = new Map<string, string>(); // Store dependencies

//         for (const equation of equations) {
//             const parts = equation.split(" = ");
//             const left = parts[0].trim();
//             const right = parts[1].trim();

//             if (this.isNumeric(right)) {
//                 values.set(left, parseInt(right));
//             } else {
//                 dependencies.set(left, right);
//             }
//         }

//         const result = this.compute(target, values, dependencies);
//         return String(result);
//     }

//     private compute(variable: string, values: Map<string, number>, dependencies: Map<string, string>): number {
//         if (this.isNumeric(variable)) {
//             return parseInt(variable);
//         }
//         if (values.has(variable)) {
//             return values.get(variable)!;
//         }

//         const dependency = dependencies.get(variable)!;
//         const computedValue = this.compute(dependency, values, dependencies);

//         values.set(variable, computedValue);
//         return computedValue;
//     }

//     private isNumeric(str: string): boolean {
//         if (str == null || str.length === 0)
//             return false;
//         const parsed = parseInt(str);
//         return !isNaN(parsed) && isFinite(parsed);
//     }
// }
