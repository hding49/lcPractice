// const fs = require('fs');
// const path = require('path');

// // 文件夹路径（请根据实际路径修改）
// const folderPath = '/Users/achilles/Desktop/lcPractice/note/买它';

// // 从买它.txt 文件中提取的题号和题目名称
// const problems = [
//     { id: 17, name: 'Letter Combinations of a Phone Number' },
//     { id: 50, name: 'Pow(x, n)' },
//     { id: 56, name: 'Merge Intervals' },
//     { id: 65, name: 'Valid Number' },
//     { id: 91, name: 'Decode Ways' },
//     { id: 127, name: 'Word Ladder' },
//     { id: 146, name: 'LRU Cache' },
//     { id: 162, name: 'Find Peak Element' },
//     { id: 163, name: 'Missing Ranges' },
//     { id: 173, name: 'Binary Search Tree Iterator' },
//     { id: 199, name: 'Binary Tree Right Side View' },
//     { id: 207, name: 'Course Schedule' },
//     { id: 215, name: 'Kth Largest Element in an Array' },
//     { id: 227, name: 'Basic Calculator II' },
//     { id: 236, name: 'Lowest Common Ancestor of a Binary Tree' },
//     { id: 270, name: 'Closest Binary Search Tree Value' },
//     { id: 295, name: 'Find Median from Data Stream' },
//     { id: 314, name: 'Binary Tree Vertical Order Traversal' },
//     { id: 324, name: 'Wiggle Sort II' },
//     { id: 339, name: 'Nested List Weight Sum' },
//     { id: 364, name: 'Nested List Weight Sum II' },
//     { id: 378, name: 'Kth Smallest Element in a Sorted Matrix' },
//     { id: 398, name: 'Random Pick Index' },
//     { id: 408, name: 'Valid Word Abbreviation' },
//     { id: 426, name: 'Convert Binary Search Tree to Sorted Doubly Linked List' },
//     { id: 480, name: 'Sliding Window Median' },
//     { id: 525, name: 'Contiguous Array' },
//     { id: 543, name: 'Diameter of Binary Tree' },
//     { id: 647, name: 'Palindromic Substrings' },
//     { id: 658, name: 'Find K Closest Elements' },
//     { id: 680, name: 'Valid Palindrome II' },
//     { id: 708, name: 'Insert into a Sorted Circular Linked List' },
//     { id: 721, name: 'Accounts Merge' },
//     { id: 744, name: 'Find Smallest Letter Greater Than Target' },
//     { id: 766, name: 'Toeplitz Matrix' },
//     { id: 791, name: 'Custom Sort String' },
//     { id: 863, name: 'All Nodes Distance K in Binary Tree' },
//     { id: 873, name: 'Length of Longest Fibonacci Subsequence' },
//     { id: 908, name: 'Smallest Range I' },
//     { id: 934, name: 'Shortest Bridge' },
//     { id: 938, name: 'Range Sum of BST' },
//     { id: 973, name: 'K Closest Points to Origin' },
//     { id: 987, name: 'Vertical Order Traversal of a Binary Tree' },
//     { id: 1209, name: 'Remove All Adjacent Duplicates in String II' },
//     { id: 1249, name: 'Minimum Remove to Make Valid Parentheses' },
//     { id: 1351, name: 'Count Negative Numbers in a Sorted Matrix' },
//     { id: 1539, name: 'Kth Missing Positive Number' },
// ];

// // 创建文件
// problems.forEach(problem => {
//     const fileName = `${problem.id}-${problem.name.replace(/ /g, '_')}.js`;
//     const filePath = path.join(folderPath, fileName);
//     const content = `// ${problem.id} - ${problem.name}\n\n// Your solution here\n`;

//     // 创建文件并写入内容
//     try {
//         fs.writeFileSync(filePath, content, 'utf8');
//         console.log(`Created: ${filePath}`);
//     } catch (err) {
//         console.error(`Error creating file ${fileName}:`, err);
//     }
// });



const fs = require('fs');
const path = require('path');

// 文件夹路径（与 script.js 平级）
const folderPath = path.join(__dirname, 'done-blind75');

// LeetCode 题目名称和题号的映射表
const problemMap = {
    "Two_Sum": 1,
    "Longest_Substring_Without_Repeating_Characters": 3,
    "Median_of_Two_Sorted_Arrays": 4,
    "Container_With_Most_Water": 11,
    "3Sum": 15,
    "Remove_Nth_Node_From_End_of_List": 19,
    "Valid_Parentheses": 20,
    "Merge_Two_Sorted_Lists": 21,
    "Best_Time_to_Buy_and_Sell_Stock": 121,
    "Valid_Palindrome": 125,
    "Linked_List_Cycle": 141,
    "Maximum_Subarray": 53,
    "Climbing_Stairs": 70,
    "Binary_Search": 704,
    "Invert_Binary_Tree": 226,
    "Maximum_Depth_of_Binary_Tree": 104,
    "Same_Tree": 100,
    "Subtree_of_Another_Tree": 572,
    "Lowest_Common_Ancestor_of_a_Binary_Search_Tree": 235,
    "Binary_Tree_Level_Order_Traversal": 102,
    "Serialize_and_Deserialize_Binary_Tree": 297,
    "Kth_Smallest_Element_in_a_BST": 230,
    "Number_of_Islands": 200,
    "Rotting_Oranges": 994,
    "Course_Schedule": 207,
    "Implement_Trie_(Prefix_Tree)": 208,
    "Add_and_Search_Word_-_Data_structure_design": 211,
    "Word_Search": 79,
    "Longest_Increasing_Subsequence": 300,
    "Longest_Common_Subsequence": 1143,
    "Word_Break": 139,
    "Combination_Sum": 39,
    "House_Robber": 198,
    "House_Robber_II": 213,
    "Decode_Ways": 91,
    "Unique_Paths": 62,
    "Jump_Game": 55,
    "Clone_Graph": 133,
    "Course_Schedule_II": 210,
    "Pacific_Atlantic_Water_Flow": 417,
    "Number_of_Connected_Components_in_an_Undirected_Graph": 323,
    "Graph_Valid_Tree": 261,
    "Alien_Dictionary": 269,
    "Find_Minimum_in_Rotated_Sorted_Array": 153,
    "Search_in_Rotated_Sorted_Array": 33,
    "Median_of_Two_Sorted_Arrays": 4,
    "Sliding_Window_Maximum": 239,
    "Longest_Repeating_Character_Replacement": 424,
    "Minimum_Window_Substring": 76,
    "Valid_Anagram": 242,
    "Group_Anagrams": 49,
    "Top_K_Frequent_Elements": 347,
    "Product_of_Array_Except_Self": 238,
    "Valid_Sudoku": 36,
    "Encode_and_Decode_Strings": 271,
    "Maximal_Square": 221,
    "Number_of_1_Bits": 191,
    "Counting_Bits": 338,
    "Reverse_Bits": 190,
    "Missing_Number": 268,
    "Sum_of_Two_Integers": 371,
    "Reverse_Linked_List": 206,
    "Detect_Cycle_in_a_Linked_List": 142,
    "Merge_K_Sorted_Lists": 23,
    "Remove_Duplicates_from_Sorted_Array": 26,
    "Container_With_Most_Water": 11,
    "Best_Time_to_Buy_and_Sell_Stock": 121,
    "Find_Minimum_in_Rotated_Sorted_Array": 153,
    "Search_in_Rotated_Sorted_Array": 33,
    "Word_Search": 79,
    "Combination_Sum": 39,
    "House_Robber": 198,
    "House_Robber_II": 213,
    "Decode_Ways": 91,
    "Unique_Paths": 62,
    "Jump_Game": 55,
};

// 遍历文件夹中的文件
fs.readdir(folderPath, (err, files) => {
    if (err) {
        console.error('Error reading folder:', err);
        return;
    }

    files.forEach(file => {
        const ext = path.extname(file); // 获取文件扩展名
        const baseName = path.basename(file, ext); // 获取文件名（不含扩展名）

        // 查找题号
        const problemId = problemMap[baseName];
        if (problemId) {
            // 构造新的文件名
            const newFileName = `${problemId}-${baseName}${ext}`;
            const oldFilePath = path.join(folderPath, file);
            const newFilePath = path.join(folderPath, newFileName);

            // 重命名文件
            fs.rename(oldFilePath, newFilePath, err => {
                if (err) {
                    console.error(`Error renaming file ${file}:`, err);
                } else {
                    console.log(`Renamed: ${file} -> ${newFileName}`);
                }
            });
        } else {
            console.log(`No problem ID found for file: ${file}`);
        }
    });
});