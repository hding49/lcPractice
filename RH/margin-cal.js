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
  let cash = 1000; // 初始现金
  const portfolio = {}; // 股票持仓：{ symbol: quantity }
  const lastPrice = {}; // 每个 symbol 最近一次交易的价格

  for (const [ts, symbol, action, qtyStr, priceStr] of trades) {
    const quantity = parseInt(qtyStr);
    const price = parseInt(priceStr);
    const cost = quantity * price;

    lastPrice[symbol] = price; // 更新该 symbol 最新交易价格

    if (action === "B") {
      // 买入：减少现金，增加股票数量
      cash -= cost;
      portfolio[symbol] = (portfolio[symbol] || 0) + quantity;

      // 如果现金变成负数，触发 margin call（强制平仓）
      if (cash < 0) {
        performMarginCall();
      }
    } else {
      // 卖出：增加现金，减少股票数量
      cash += cost;
      portfolio[symbol] -= quantity;
      if (portfolio[symbol] === 0) {
        delete portfolio[symbol]; // 如果某个股票数量变成 0 就删掉
      }
    }
  }

  /**
   * 执行强平操作，使 cash >= 0
   * 优先卖掉价格最高的股票，价格相同则按字母序优先
   * 遇到 collateral 股票需要遵守规则
   */
  function performMarginCall() {
    while (cash < 0) {
      // 过滤出可以被卖出的股票
      const candidates = Object.entries(portfolio)
        .filter(([sym, qty]) => canBeSold(sym))
        .map(([sym, qty]) => [sym, qty, lastPrice[sym]]) // [symbol, quantity, price]
        .sort((a, b) => {
          // 排序：价格高优先，价格相同按字母序
          if (b[2] !== a[2]) return b[2] - a[2];
          return a[0].localeCompare(b[0]);
        });

      // 如果没有可以卖的了，跳出（无法继续强平）
      if (candidates.length === 0) break;

      const [sym, qty, price] = candidates[0];
      // 最多卖多少股才能让 cash >= 0
      const maxSell = Math.min(qty, Math.ceil(-cash / price));

      // 更新 portfolio 和 cash
      portfolio[sym] -= maxSell;
      cash += maxSell * price;
      if (portfolio[sym] === 0) {
        delete portfolio[sym];
      }
    }
  }

  /**
   * 判断某个 symbol 是否可以在 margin call 时被卖出
   * - 普通股票默认可以卖
   * - 如果是 collateral（如 AAPL 支撑 AAPLO），不能卖出剩下的抵押份额
   */
  function canBeSold(symbol) {
    // 特殊股票（以 O 结尾）总是可以被卖出
    //基于题意约束：抵押关系始终成立，即普通股票持仓 ≥ 特殊股票持仓
    if (symbol.endsWith("O")) return true;

    // 检查是否有对应的特殊股票存在
    const specialPair = symbol + "O";
    if (portfolio[specialPair]) {
      const needed = portfolio[specialPair]; // 需要作为抵押的数量
      return portfolio[symbol] > needed; // 只有剩余的可以卖
    }

    // 默认允许卖出
    return true;
  }

  /**
   * 构建最终结果
   * - "CASH" 放在第一位
   * - 其余股票按 symbol 字母序排序
   */
  const result = [["CASH", String(cash)]];
  const stocks = Object.entries(portfolio)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([sym, qty]) => [sym, String(qty)]);

  return result.concat(stocks);
}

// -------------------------
// ✅ Test Runner
// -------------------------
function runTests() {
  const testCases = [
    {
      name: "Test 1: 单笔买入",
      input: [["1", "AAPL", "B", "5", "100"]],
      expected: [
        ["CASH", "500"],
        ["AAPL", "5"],
      ],
    },
    {
      name: "Test 2: 买入 + 卖出",
      input: [
        ["1", "AAPL", "B", "10", "10"],
        ["2", "AAPL", "S", "5", "15"],
      ],
      expected: [
        ["CASH", "925"],
        ["AAPL", "5"],
      ],
    },
    {
      name: "Test 3: 多个股票买入",
      input: [
        ["1", "AAPL", "B", "10", "10"],
        ["2", "GOOG", "B", "20", "5"],
      ],
      expected: [
        ["CASH", "800"],
        ["AAPL", "10"],
        ["GOOG", "20"],
      ],
    },
    {
      name: "Test 4: 简单 Margin Call",
      input: [
        ["1", "AAPL", "B", "10", "100"],
        ["2", "AAPL", "S", "2", "80"],
        ["3", "GOOG", "B", "15", "20"],
      ],
      expected: [
        ["CASH", "20"],
        ["AAPL", "6"],
        ["GOOG", "15"],
      ],
    },
    {
      name: "Test 5: 同价股票优先卖字母序早的",
      input: [
        ["1", "AAPL", "B", "5", "80"],
        ["2", "GOOG", "B", "5", "80"],
        ["3", "TSLA", "B", "20", "50"],
      ],
      expected: [
        ["CASH", "0"],
        ["AAPL", "2"],
        ["GOOG", "5"],
        ["TSLA", "20"],
      ],
    },
    {
      name: "Test 6: 拥有 collateral，不触发强平",
      input: [
        ["1", "AAPL", "B", "5", "100"],
        ["2", "AAPLO", "B", "5", "75"],
      ],
      expected: [
        ["CASH", "125"],
        ["AAPL", "5"],
        ["AAPLO", "5"],
      ],
    },
    {
      name: "Test 7: Margin Call 不卖 collateral",
      input: [
        ["1", "AAPL", "B", "5", "100"],
        ["2", "GOOG", "B", "5", "75"],
        ["3", "AAPLO", "B", "5", "50"],
      ],
      expected: [
        ["CASH", "25"],
        ["AAPL", "5"],
        ["AAPLO", "5"],
        ["GOOG", "3"],
      ],
    },
    {
      name: "Test 8: 卖特殊股票释放 collateral",
      input: [
        ["1", "AAPL", "B", "5", "100"],
        ["2", "AAPLO", "B", "5", "100"],
        ["3", "GOOG", "B", "5", "20"],
      ],
      expected: [
        ["CASH", "0"],
        ["AAPL", "5"],
        ["AAPLO", "4"],
        ["GOOG", "5"],
      ],
    },
  ];

  for (const { name, input, expected } of testCases) {
    const actual = processTrades(input);
    const passed =
      JSON.stringify(actual) === JSON.stringify(expected)
        ? "✅"
        : `❌\nExpected: ${JSON.stringify(
            expected
          )}\nActual:   ${JSON.stringify(actual)}`;
    console.log(`${name} -> ${passed}`);
  }
}

// Run all tests
runTests();

function process(trades) {
  let cash = 1000;
  let;
}
