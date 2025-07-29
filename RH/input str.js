// 给定一个input str是一本书的一个段落，要求处理input str，extract word，返回top 10 freq word 和 frequency，这个word要lowercase。

// 思路就是先处理input str，忽略标点符号和空格拿到word，然后把word处理成lowercase，之后用map来存每个word的frequency，然后heapify成maxheap，再取top 10 words。
// follow up 1：如果input str too big to store in memory怎么办，within one machine，maintain 一个global count map，然后batch处理input str，update map之后算top 10 words
// follow up 2：如果一台机器也处理不过来怎么办，我说用redis来存global count map，每台机器处理完update redis。又问怎么handle failure，机器挂了怎么办，答定期给机器snapshot保存进度，挂了再根据snapshot restore progress

function getTop10Words(inputStr) {
  // Step 1: 清洗字符串，只保留字母、数字、空格，转换为小写
  const cleaned = inputStr.replace(/[^a-zA-Z0-9\s]/g, " ").toLowerCase();

  // Step 2: 拆分成单词
  const words = cleaned.split(/\s+/).filter(Boolean);

  // Step 3: 统计词频
  const freqMap = new Map();
  for (const word of words) {
    freqMap.set(word, (freqMap.get(word) || 0) + 1);
  }

  // Step 4: 排序取前10
  const sorted = Array.from(freqMap.entries()).sort((a, b) => b[1] - a[1]);

  // Step 5: 返回前10
  return sorted.slice(0, 10);
}

// ✅ 示例
const paragraph =
  "Hello world! Hello again, world. It's a great day to say hello.";
console.log(getTop10Words(paragraph));
