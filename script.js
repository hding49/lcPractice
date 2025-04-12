const fs = require('fs');
const path = require('path');

// 文件夹路径（请根据实际路径修改）
const folderPath = '/Users/achilles/Desktop/lcPractice/note/买它';

// 从买它.txt 文件中提取的题号和题目名称
const problems = [
    { id: 17, name: 'Letter Combinations of a Phone Number' },
    { id: 50, name: 'Pow(x, n)' },
    { id: 56, name: 'Merge Intervals' },
    { id: 65, name: 'Valid Number' },
    { id: 91, name: 'Decode Ways' },
    { id: 127, name: 'Word Ladder' },
    { id: 146, name: 'LRU Cache' },
    { id: 162, name: 'Find Peak Element' },
    { id: 163, name: 'Missing Ranges' },
    { id: 173, name: 'Binary Search Tree Iterator' },
    { id: 199, name: 'Binary Tree Right Side View' },
    { id: 207, name: 'Course Schedule' },
    { id: 215, name: 'Kth Largest Element in an Array' },
    { id: 227, name: 'Basic Calculator II' },
    { id: 236, name: 'Lowest Common Ancestor of a Binary Tree' },
    { id: 270, name: 'Closest Binary Search Tree Value' },
    { id: 295, name: 'Find Median from Data Stream' },
    { id: 314, name: 'Binary Tree Vertical Order Traversal' },
    { id: 324, name: 'Wiggle Sort II' },
    { id: 339, name: 'Nested List Weight Sum' },
    { id: 364, name: 'Nested List Weight Sum II' },
    { id: 378, name: 'Kth Smallest Element in a Sorted Matrix' },
    { id: 398, name: 'Random Pick Index' },
    { id: 408, name: 'Valid Word Abbreviation' },
    { id: 426, name: 'Convert Binary Search Tree to Sorted Doubly Linked List' },
    { id: 480, name: 'Sliding Window Median' },
    { id: 525, name: 'Contiguous Array' },
    { id: 543, name: 'Diameter of Binary Tree' },
    { id: 647, name: 'Palindromic Substrings' },
    { id: 658, name: 'Find K Closest Elements' },
    { id: 680, name: 'Valid Palindrome II' },
    { id: 708, name: 'Insert into a Sorted Circular Linked List' },
    { id: 721, name: 'Accounts Merge' },
    { id: 744, name: 'Find Smallest Letter Greater Than Target' },
    { id: 766, name: 'Toeplitz Matrix' },
    { id: 791, name: 'Custom Sort String' },
    { id: 863, name: 'All Nodes Distance K in Binary Tree' },
    { id: 873, name: 'Length of Longest Fibonacci Subsequence' },
    { id: 908, name: 'Smallest Range I' },
    { id: 934, name: 'Shortest Bridge' },
    { id: 938, name: 'Range Sum of BST' },
    { id: 973, name: 'K Closest Points to Origin' },
    { id: 987, name: 'Vertical Order Traversal of a Binary Tree' },
    { id: 1209, name: 'Remove All Adjacent Duplicates in String II' },
    { id: 1249, name: 'Minimum Remove to Make Valid Parentheses' },
    { id: 1351, name: 'Count Negative Numbers in a Sorted Matrix' },
    { id: 1539, name: 'Kth Missing Positive Number' },
];

// 创建文件
problems.forEach(problem => {
    const fileName = `${problem.id}-${problem.name.replace(/ /g, '_')}.js`;
    const filePath = path.join(folderPath, fileName);
    const content = `// ${problem.id} - ${problem.name}\n\n// Your solution here\n`;

    // 创建文件并写入内容
    try {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Created: ${filePath}`);
    } catch (err) {
        console.error(`Error creating file ${fileName}:`, err);
    }
});