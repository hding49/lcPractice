// You are given a list of order records for a single stock. Each record is a list containing the limit price (a number), quantity (number of shares), and order type (either "buy" or "sell").

// Your task is to calculate the total number of shares traded based on the following rules:

// A buy order can be matched with a sell order if the sell price is less than or equal to the buy price.
// A sell order can be matched with a buy order if the buy price is greater than or equal to the sell price.
// If no matching order exists, the order is stored until a matching counter-order arrives.
// Orders must be matched at the best possible price:
// Buy orders match with the lowest sell price available.
// Sell orders match with the highest buy price available.
// Orders may be partially filled if the available quantity is less than the order's quantity.
// Return the total number of shares successfully traded.

// Example 1:

// Input: orders = [["150", "5", "buy"],["190", "1", "sell"],["200", "1", "sell"],["100", "9", "buy"],["140", "8", "sell"],["210", "4", "buy"]]
// Output: 9
// Explanation: There's no trade in the first four orders. Trading begins with the fifth order, a sell at 140 for 8 shares, which matches a stored buy order at 150, executing 5 shares. The sixth order, a buy at 210 for 4 shares, then triggers trading by matching the remaining 3 shares from the sell at 140 and 1 share from the sell at 190. In total, 5 + 4 = 9 shares are traded.

// Example 2:

// Input: orders = [["100","10","buy"],["105","5","buy"],["110","8","buy"]]
// Output: 0

// Example 3:

// Input: orders = [["120","10","buy"],["115","5","sell"],["110","3","sell"]]
// Output: 8

/**
 * 计算给定订单列表中成功交易的总股数
 * @param {Array} orders - 订单列表，每个订单格式为 [价格(字符串), 数量(字符串), 类型("buy"或"sell")]
 * @return {number} 成交的总股数
 */
function totalSharesTraded(orders) {
  // 用两个数组模拟买卖优先队列：
  // buyHeap：买单，按价格从大到小排序（最高价优先）
  // sellHeap：卖单，按价格从小到大排序（最低价优先）

  let buyHeap = []; // 存放买单，格式：{price, qty}
  let sellHeap = []; // 存放卖单，格式：{price, qty}
  let totalTraded = 0; // 成交总量

  // 插入买单，保持买单价格从大到小排序
  function insertBuy(order) {
    buyHeap.push(order);
    buyHeap.sort((a, b) => b.price - a.price);
  }

  // 插入卖单，保持卖单价格从小到大排序
  function insertSell(order) {
    sellHeap.push(order);
    sellHeap.sort((a, b) => a.price - b.price);
  }

  for (const [priceStr, qtyStr, type] of orders) {
    let price = Number(priceStr);
    let qty = Number(qtyStr);

    if (type === "buy") {
      // 尝试用当前买单和卖单匹配，匹配条件是卖单价格 <= 买单价格
      while (qty > 0 && sellHeap.length > 0 && sellHeap[0].price <= price) {
        let sellOrder = sellHeap[0];

        if (sellOrder.qty <= qty) {
          // 卖单全部成交
          qty -= sellOrder.qty;
          totalTraded += sellOrder.qty;
          sellHeap.shift(); // 移除已成交卖单
        } else {
          // 卖单部分成交
          sellOrder.qty -= qty;
          totalTraded += qty;
          qty = 0; // 买单全部成交
        }
      }

      // 如果买单还有剩余，加入买单队列等待匹配
      if (qty > 0) {
        insertBuy({ price, qty });
      }
    } else if (type === "sell") {
      // 尝试用当前卖单和买单匹配，匹配条件是买单价格 >= 卖单价格
      while (qty > 0 && buyHeap.length > 0 && buyHeap[0].price >= price) {
        let buyOrder = buyHeap[0];

        if (buyOrder.qty <= qty) {
          // 买单全部成交
          qty -= buyOrder.qty;
          totalTraded += buyOrder.qty;
          buyHeap.shift(); // 移除已成交买单
        } else {
          // 买单部分成交
          buyOrder.qty -= qty;
          totalTraded += qty;
          qty = 0; // 卖单全部成交
        }
      }

      // 如果卖单还有剩余，加入卖单队列等待匹配
      if (qty > 0) {
        insertSell({ price, qty });
      }
    }
  }

  return totalTraded;
}

// 测试示例：
console.log(
  totalSharesTraded([
    ["150", "5", "buy"],
    ["190", "1", "sell"],
    ["200", "1", "sell"],
    ["100", "9", "buy"],
    ["140", "8", "sell"],
    ["210", "4", "buy"],
  ])
); // 输出: 9

console.log(
  totalSharesTraded([
    ["100", "10", "buy"],
    ["105", "5", "buy"],
    ["110", "8", "buy"],
  ])
); // 输出: 0

console.log(
  totalSharesTraded([
    ["120", "10", "buy"],
    ["115", "5", "sell"],
    ["110", "3", "sell"],
  ])
); // 输出: 8
