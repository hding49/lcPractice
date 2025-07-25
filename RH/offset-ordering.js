// Offset Ordering
// Problem
// Suppose we are consuming a list of messages from an ordered stream. Each message is represented by its offset, which denotes its order in the stream.

// For example, a 4-message stream may look like:

// [offset = 0][offset = 1][offset = 2][offset = 3]
// However, while messages may arrive in order, we might not necessarily process them in order.

// For example, imagine we are processing messages in a multi-threaded environment, and thus we are at the whim of the scheduler. We may process messages in the order [offset = 3][offset = 0][offset = 1][offset = 2], for instance.

// When we're finished with a message (i.e. an offset), we need to tell the stream this, so it knows not to send it again. This is called committing an offset.

// To "commit an offset" means that we're done with every message up to that offset. In other words, committing an offset of 2 means "I'm done with messages with offsets 0, 1, and 2". That means we can ONLY commit to 2 if we're ALSO done with 0, 1, and 2.

// Problem statement

// Given a list of offsets, ordered by when they are processed, return a list of offsets that represent the greediest order of commits. That is, when an offset CAN be committed, we MUST commit it.

// We can commit an offset X when EITHER:

// X = 0, since it is the first message of the stream
// All offsets < X are either ready to be committed or are already committed
// If we cannot commit offset X, we represent this as -1.
// Example 1:
// Input: [2, 0, 1]
// Output: [-1, 0, 2]

// We iterate through each message from left to right:

// 1). We try to commit 2, but we CANNOT because all previous offsets (0, 1) have not been committed yet. Thus, we append -1 in our result list, which represents NO commit on this offset.
// It might help to visualize this state as something like:

//                     (ready to be committed 2)
//                      ----------
// [offset = 0][offset = 1][offset = 2]
// 2). We try to commit 0, and we CAN because it's the first message of the stream. We commit the offset 0. Thus, we append 0 to our result list.

// (committed 0)
// xxxxxxxxxx ----------
// [offset = 0][offset = 1][offset = 2]
// 3). We try to commit 1, and we CAN because all messages up to 1 have been committed. We commit the offset 2. Thus, we append 2 to our result list.

//                     (committed 2)    
// xxxxxxxxxx xxxxxxxxxx xxxxxxxxxx
// [offset = 0][offset = 1][offset = 2]
// Thus, we output [-1, 0, 2]. Remember, 1 is NOT in the output because the commit of offset 2 encapsulates it.

// Example 2
// Input: [0, 1, 2]
// Output: [0, 1, 2]

// We can commit each message as we iterate because each successive offset is the lowest offset we can possibly commit.

// Example 3
// Input: [2, 1, 0, 5, 4]
// Output: [-1, -1, 2, -1, -1]

// We do NOT commit 4 and 5. Had we received 3, we would have committed 4 and 5.

// Important things to remember

// Assume a clean "state of the world" for every function call, i.e. no offsets have been committed thus far (so we must always start at 0).
// Every offset is >= 0.
// We never have any duplicate offsets.

// 记录所有已处理的 offset（用一个 Set 存储）

// 维护上一次成功 commit 的最大值 maxCommitted

// 每次处理完一个 offset，检查是否可以从 maxCommitted + 1 开始连续推进 offset

// 如果能推进，就提交最大的连续 offset

// 否则就返回 -1


function offsetCommits(processed) {
  const seen = new Set(); // 存储已处理过的 offset
  const result = [];      // 最终结果数组
  let maxCommitted = -1;  // 当前已提交的最大 offset，初始为 -1 表示还未提交

  // 遍历处理顺序中的每个 offset
  for (let offset of processed) {
    seen.add(offset); // 标记该 offset 已处理

    // 从当前已提交的最大 offset 的下一个开始，尝试往前推进
    let next = maxCommitted + 1;

    // 只要下一个 offset 存在于已处理集合中，就可以继续推进
    while (seen.has(next)) {
      next++;
    }

    // 如果推进到了更高的 offset，说明可以 commit（贪心提交到最大连续 offset）
    if (next - 1 > maxCommitted) {
      maxCommitted = next - 1;      // 更新最大提交 offset
      result.push(maxCommitted);    // 记录此次提交的 offset
    } else {
      result.push(-1); // 否则不能提交，标记为 -1
    }
  }

  return result; // 返回所有提交记录
}

// Test Case 1
console.log(offsetCommits([2, 0, 1])); // [-1, 0, 2]

// Test Case 2
console.log(offsetCommits([0, 1, 2])); // [0, 1, 2]

// Test Case 3
console.log(offsetCommits([2, 1, 0, 5, 4])); // [-1, -1, 2, -1, -1]