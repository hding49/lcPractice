/*
        Our goal is to build a simplified version of a real Robinhood system that reads a customer's trades from a stream, maintains what they own, and rectifies running out of cash (through a process called a "margin call", which we'll define later). We’re looking for clean code, good naming, testing, etc. We're not particularly looking for the most performant solution.

    **Step 1 (tests 1-4): Parse trades and build a customer portfolio**

    Your input will be a list of trades, each of which is itself a list of strings in the form [timestamp, symbol, B/S (for buy/sell), quantity, price], e.g.

    [["1", "AAPL", "B", "10", "10"], ["3", "GOOG", "B", "20", "5"], ["10", "AAPL", "S", "5", "15"]]

    is equivalent to buying 10 shares (i.e. units) of AAPL for 5 each at timestamp 3, and selling 5 shares of AAPL for $15 at timestamp 10.

    **Input assumptions:**

    - The input is sorted by timestamp
    - All numerical values are nonnegative integers
    - Trades will always be valid (i.e. a customer will never sell more of a stock than they own).

    From the provided list of trades, our goal is to maintain the customer's resulting portfolio (meaning everything they own), **assuming they begin with $1000**. For instance, in the above example, the customer would end up with $875, 5 shares of AAPL, and 20 shares of GOOG. You should return a list representing this portfolio, formatting each individual position as a list of strings in the form [symbol, quantity], using 'CASH' as the symbol for cash and sorting the remaining stocks alphabetically based on symbol. For instance, the above portfolio would be represented as

    [["CASH", "875"], ["AAPL", "5"], ["GOOG", "20"]]

    **Step 2 (tests 5-7): Margin calls**

    If the customer ever ends up with a negative amount of cash **after a buy**, they then enter a process known as a **margin call** to correct the situation. In this process, we forcefully sell stocks in the customer's portfolio (sometimes including the shares we just bought) until their cash becomes non-negative again.

    We sell shares from the most expensive to least expensive shares (based on each symbol's most-recently-traded price) with ties broken by preferring the alphabetically earliest symbol. Assume we're able to sell any number of shares in a symbol at that symbol's most-recently-traded price.

    For example, for this input:

    ```
    [["1", "AAPL", "B", "10", "100"],
    ["2", "AAPL", "S", "2", "80"],
    ["3", "GOOG", "B", "15", "20"]]

    ```

    The customer would be left with 8 AAPL shares, 15 GOOG shares, and 80 a share) to cover the deficit. Afterwards, they would have 6 shares of AAPL, 15 shares of GOOG, and a cash balance of $20.

    The expected output would be

    [["CASH", "20"], ["AAPL", "6"], ["GOOG", "15"]]

    **Step 3/Extension 1 (tests 8-10): Collateral**

    Certain stocks have special classifications, and require the customer to also own another "collateral" stock, meaning it cannot be sold during the margin call process. Our goal is to handle a simplified version of this phenomenon.

    Formally, we'll consider stocks with symbols ending in "O" to be special, with the remainder of the symbol identifying its collateral stock. For example, AAPLO is special, and its collateral stock is AAPL. **At all times**, the customer must hold at least as many shares of the collateral stock as they do the special stock; e.g. they must own at least as many shares of AAPL as they do of AAPLO.

    As a result, the margin call process will now sell the most valuable **non-collateral** share until the balance is positive again. Note that if this sells a special stock, some of the collateral stock may be freed up to be sold.

    For example, if the customer purchases 5 shares of AAPL for 75 each, then finally 5 shares of AAPLO for 125, but their shares of AAPL can no longer be used to cover the deficit (since they've become collateral for AAPLO). As a result, 2 shares of GOOG would be sold back (again at 25, 5 AAPL, 5 AAPLO, and 3 GOOG. Thus, with an input of

    [["1", "AAPL", "B", "5", "100"], ["2", "GOOG", "B", "5", "75"], ["3", "AAPLO", "B", "5", "50"]]

    the corresponding output would be

    [["CASH", "25"], ["AAPL", "5"], ["AAPLO", "5"], ["GOOG", "3"]
    */

function processTrades(trades) {
  let cash = 1000;
  const portfolio = {}; // 股票持仓 {symbol: quantity}
  const lastPrice = {}; // 记录每支股票最后一次价格

  for (const [ts, symbol, action, qtyStr, priceStr] of trades) {
    const quantity = parseInt(qtyStr);
    const price = parseInt(priceStr);
    const cost = quantity * price;

    // 更新最新价格
    lastPrice[symbol] = price;

    if (action === "B") {
      cash -= cost;
      portfolio[symbol] = (portfolio[symbol] || 0) + quantity;

      // 如果现金为负，强平
      if (cash < 0) {
        performMarginCall();
      }
    } else {
      // 卖出，增加现金，减少持仓
      cash += cost;
      portfolio[symbol] -= quantity;
      if (portfolio[symbol] === 0) delete portfolio[symbol];
    }
  }

  function performMarginCall() {
    while (cash < 0) {
      const candidates = Object.entries(portfolio)
        .filter(([sym, qty]) => canBeSold(sym, qty))
        .map(([sym, qty]) => [sym, qty, lastPrice[sym]])
        .sort((a, b) => {
          // 高价优先，价格相等时按symbol排序
          if (b[2] !== a[2]) return b[2] - a[2];
          return a[0].localeCompare(b[0]);
        });

      if (candidates.length === 0) break; // 无法卖出

      const [sym, qty, price] = candidates[0];

      const maxSell = Math.min(qty, Math.ceil(-cash / price));
      portfolio[sym] -= maxSell;
      cash += maxSell * price;
      if (portfolio[sym] === 0) delete portfolio[sym];
    }
  }

  // 判断symbol是否可以被卖出（考虑collateral）
  function canBeSold(symbol, quantity) {
    // 如果是 collateral，本身不能被卖
    if (symbol.endsWith("O")) return true; // 特殊股票可以卖
    const specialPair = symbol + "O";
    if (portfolio[specialPair]) {
      const needed = portfolio[specialPair];
      return portfolio[symbol] > needed;
    }
    return true;
  }

  // 构造结果
  const result = [["CASH", String(cash)]];
  const stocks = Object.entries(portfolio)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([sym, qty]) => [sym, String(qty)]);

  return result.concat(stocks);
}

// Test Case 1: 单笔买入
[["1", "AAPL", "B", "5", "100"]][
  // Expected: [["CASH", "500"], ["AAPL", "5"]]

  // Test Case 2: 买入 + 卖出
  (["1", "AAPL", "B", "10", "10"], ["2", "AAPL", "S", "5", "15"])
][
  // Expected: [["CASH", "925"], ["AAPL", "5"]]

  // Test Case 3: 多个股票买入
  (["1", "AAPL", "B", "10", "10"], ["2", "GOOG", "B", "20", "5"])
][
  // Expected: [["CASH", "800"], ["AAPL", "10"], ["GOOG", "20"]]

  // Test Case 4: 简单 Margin Call
  (["1", "AAPL", "B", "10", "100"], // cash = 0
  ["2", "AAPL", "S", "2", "80"], // cash = 160
  ["3", "GOOG", "B", "15", "20"]) // cost = 300, cash = -140 => margin call
][
  // Expected: [["CASH", "20"], ["AAPL", "6"], ["GOOG", "15"]]

  // Test Case 5: 按 symbol 排序决定卖谁（AAPL 和 GOOG 都80元）
  (["1", "AAPL", "B", "5", "80"],
  ["2", "GOOG", "B", "5", "80"],
  ["3", "TSLA", "B", "20", "50"]) // cash < 0, margin call
][
  // Expected: 把贵股票先卖（AAPL 和 GOOG 价格相同 -> 按字母序卖 AAPL）
  // 最终：AAPL: 2, GOOG: 5, TSLA: 20, CASH: >= 0

  // Test Case 6: 拥有 collateral，不触发强平
  (["1", "AAPL", "B", "5", "100"], // cash = 500
  ["2", "AAPLO", "B", "5", "75"]) // cash = 125
][
  // Expected: [["CASH", "125"], ["AAPL", "5"], ["AAPLO", "5"]]

  // Test Case 7: Margin Call 不能卖掉 collateral
  (["1", "AAPL", "B", "5", "100"], // cash = 500
  ["2", "GOOG", "B", "5", "75"], // cash = 125
  ["3", "AAPLO", "B", "5", "50"]) // cash = -125, margin call
][
  // GOOG 价格 75，比 AAPL 低，但只能卖 GOOG（AAPL 是 collateral）
  // 应该卖出 2 股 GOOG，拿到 150 现金，CASH = 25
  // Expected: [["CASH", "25"], ["AAPL", "5"], ["AAPLO", "5"], ["GOOG", "3"]]

  // Test Case 8: 卖掉特殊股票，释放 collateral，进而可卖 collateral
  (["1", "AAPL", "B", "5", "100"],
  ["2", "AAPLO", "B", "5", "100"], // cash = -100, margin call
  ["3", "GOOG", "B", "5", "20"]) // 再次 margin call
];
// 可能先卖掉 AAPLO 部分，释放 AAPL 可卖
