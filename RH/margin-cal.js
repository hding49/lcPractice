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

function process(trades) {
  let cash = 1000; // 初始现金余额为 1000 美元
  const portfolio = {}; // 股票持仓，格式为 { symbol: quantity }
  const lastPrice = {}; // 每个股票的最近交易价格 { symbol: price }

  // 遍历每一笔交易
  for (let [ts, sym, action, qtyStr, priceStr] of trades) {
    let quantity = parseInt(qtyStr); // 交易股数
    let price = parseInt(priceStr); // 每股价格
    lastPrice[sym] = price; // 更新该股票的最新交易价格

    let cost = quantity * price; // 该笔交易总金额

    if (action === "B") {
      // 买入操作：减少现金，增加持仓
      cash -= cost;
      portfolio[sym] = (portfolio[sym] || 0) + quantity;

      // 如果现金不足，触发强平流程
      if (cash < 0) {
        performMarginCall();
      }
    } else {
      // 卖出操作：增加现金，减少持仓
      cash += cost;
      portfolio[sym] = (portfolio[sym] || 0) - quantity;

      // 如果某个股票持仓变为 0，移除它
      if (portfolio[sym] === 0) {
        delete portfolio[sym];
      }
    }
  }

  /**
   * 强平流程：
   * 当现金为负时，自动卖出持有的股票以补足现金
   * 卖出顺序：
   *   - 按最近交易价格从高到低
   *   - 若价格相同，按股票代号字母序排列
   * 注意：不能卖出作为抵押品的股票（例如 AAPL 支撑 AAPLO）
   */
  function performMarginCall() {
    while (cash < 0) {
      // 从当前 portfolio 中筛选出可被卖出的股票
      const candidates = Object.entries(portfolio)
        .filter(([sym, qty]) => canBeSold(sym)) // 排除不能卖的抵押股票
        .map(([sym, qty]) => [sym, qty, lastPrice[sym]]) // 加入最近价格
        .sort((a, b) => {
          // 优先卖价格高的；价格相同的按字母序排
          if (a[2] !== b[2]) return b[2] - a[2];
          return a[0].localeCompare(b[0]);
        });

      // 如果没有可以卖的股票了，停止强平
      if (candidates.length == 0) break;

      // 选出当前最优的股票来卖
      let [sym, qty, price] = candidates[0];

      // 计算最多能卖多少股来填补现金缺口（不能超过持仓数量）
      let maxSell = Math.min(qty, Math.ceil(-cash / price));

      // 执行卖出
      portfolio[sym] -= maxSell;
      cash += maxSell * price;

      // 如果该股票被卖光了，移除它
      if (portfolio[sym] === 0) {
        delete portfolio[sym];
      }
    }
  }

  /**
   * 判断一只股票在强平时是否可以被卖出
   *
   * 规则：
   * - 特殊股票（以 'O' 结尾，例如 AAPLO）可以随时卖
   * - 抵押股票（例如 AAPL）如果用于支持 AAPLO，则不能卖超剩余部分
   */
  function canBeSold(sym) {
    // 特殊股票（以 'O' 结尾）始终可以卖
    if (sym.endsWith("O")) return true;

    // 若该股票是 collateral，且存在对应特殊股票
    let specialStock = sym + "O";
    if (portfolio[specialStock]) {
      // 只能卖超出抵押需求的部分（AAPL > AAPLO 才能卖）
      return portfolio[sym] > portfolio[specialStock];
    }

    return true; // 普通股票或无抵押需求，可以卖
  }

  /**
   * 构造最终输出格式：
   * - 第一项是现金 ["CASH", amount]
   * - 后续股票持仓按字母序排列
   */
  let result = [["CASH", String(cash)]];
  let stocks = Object.entries(portfolio)
    .sort((a, b) => a[0].localeCompare(b[0])) // 按股票 symbol 排序
    .map(([sym, qty]) => [sym, String(qty)]); // 转为字符串格式

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
        ["CASH", "975"],
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
    const actual = process(input);
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
