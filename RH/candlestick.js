// Our goal is to build a simplified version of a real Robinhood system that reads prices from a stream and aggregates those prices into historical datapoints aka candlestick charts. We’re looking for clean code, good naming, testing, etc.

// Step 1: Parse Prices

// Your input will be a comma-separated string of prices and timestamps in the format price:timestamp e.g.

// 1:0,3:10,2:12,4:19,5:35 is equivalent to

// price: 1, timestamp: 0
// price: 3, timestamp: 10
// price: 2, timestamp: 12
// price: 4, timestamp: 19
// price: 5, timestamp: 35

// You can assume the input is sorted by timestamp and values are non-negative integers.

// Step 2: Aggregate Historical Data from Prices

// We calculate historical data across fixed time intervals. In this case, we’re interested in intervals of 10, so the first interval will be [0, 10).
// For each interval, you’ll build a datapoint with the following values.

// Start time
// First price
// Last price
// Max price
// Min price

// Important: If an interval has no prices, use the previous datapoint’s last price for all prices.
// If there are no prices and no previous datapoints, skip the interval.

// You should return a string formatted as {start,first,last,max,min}. For the prices shown above, the expected datapoints are

// {0,1,1,1,1}{10,3,4,4,2}{20,4,4,4,4}{30,5,5,5,5}

function parseAndAggregate(prices_to_parse) {
  const interval = 10; // 每个时间区间为 10 秒

  if (!prices_to_parse) return ""; // 空输入直接返回空字符串

  // 解析输入字符串，转为数组对象 [{price, timestamp}]
  const prices = prices_to_parse.split(",").map((p) => {
    const [price, ts] = p.split(":").map(Number); // 拆分 price:timestamp，转为数字
    return { price, timestamp: ts };
  });

  let result = ""; // 最终输出结果字符串
  let idx = 0; // 当前指向 price 数组的索引
  let start = 0; // 当前时间区间的开始时间
  let lastPrice = null; // 上一个时间区间的最后价格，用于填补空区间

  // 主循环：一直处理直到所有数据处理完，且没有 lastPrice
  while (idx < prices.length || lastPrice !== null) {
    const end = start + interval; // 当前时间区间的结束时间
    const windowPrices = []; // 当前区间内的所有价格数据

    // 收集当前时间窗口内所有符合条件的价格数据
    while (idx < prices.length && prices[idx].timestamp < end) {
      windowPrices.push(prices[idx]);
      idx++;
    }

    if (windowPrices.length > 0) {
      // 当前区间有价格数据，计算 K 线数据
      const first = windowPrices[0].price; // 开盘价（区间内第一个）
      const last = windowPrices[windowPrices.length - 1].price; // 收盘价（区间内最后一个）
      const max = Math.max(...windowPrices.map((p) => p.price)); // 最高价
      const min = Math.min(...windowPrices.map((p) => p.price)); // 最低价
      lastPrice = last; // 更新 lastPrice，便于后续填补空区间
      result += `{${start},${first},${last},${max},${min}}`; // 添加本区间数据
    } else {
      // 当前区间没有数据
      if (lastPrice !== null) {
        // 使用前一区间的 lastPrice 填补
        result += `{${start},${lastPrice},${lastPrice},${lastPrice},${lastPrice}}`;
      }
      // 否则跳过（意味着开头几个区间都无数据）
    }

    start += interval; // 处理下一个区间

    // 提前退出条件：数据全部处理完，且没有历史 lastPrice 可用
    if (idx >= prices.length && lastPrice === null) break;
  }

  return result;
}

console.log(
  parseAndAggregate(
    "1:0,2:1,3:2,4:3,5:4,6:5,7:6,8:7,9:8,10:9,11:10,12:11,13:12,14:13,15:14,16:15,17:16,18:17,19:18,20:19"
  )
);
// Output: "{0,1,10,10,1}{10,11,20,20,11}"
