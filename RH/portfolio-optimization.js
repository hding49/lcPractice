// Portfolio Value Optimization
// You have some securities available to buy that each has a price Pi.
// Your friend predicts for each security the stock price will be Si at some future date.
// But based on volatility of each share, you only want to buy up to Ai shares of each security i.
// Given M dollars to spend, calculate the maximum value you could potentially
// achieve based on the predicted prices Si (and including any cash you have remaining).

// Pi = Current Price
// Si = Expected Future Price
// Ai = Maximum units you are willing to purchase
// M = Dollars available to invest
// Example 1:
// Input:
// M = $140 available
// N = 4 Securities
// P1=15, S1=45, A1=3 (AAPL)
// P2=40, S2=50, A2=3 (BYND)
// P3=25, S3=35, A3=3 (SNAP)
// P4=30, S4=25, A4=4 (TSLA)

// Output: $265 (no cash remaining)
// 3 shares of apple -> 45(15 *3), 135(45 *3)
// 3 shares of snap -> 75, 105
// 0.5 share of bynd -> 20, 25

function maximizeFutureValue(M, stocks) {
  // Step 1: 计算每支股票的性价比（未来价值/当前价格）
  for (let stock of stocks) {
    stock.ratio = stock.S / stock.P;
  }

  // Step 2: 按性价比从高到低排序
  stocks.sort((a, b) => b.ratio - a.ratio);

  let remaining = M;
  let totalFutureValue = 0;

  for (let stock of stocks) {
    const { P, S, A } = stock;

    let maxSpendableUnits = Math.min(A, remaining / P); // 最多买多少股（整/非整）

    if (maxSpendableUnits <= 0) continue;

    let cost = maxSpendableUnits * P;
    let futureValue = maxSpendableUnits * S;

    totalFutureValue += futureValue;
    remaining -= cost;
  }

  // 可以加上剩余现金（因为现金本身就是未来的现金价值）
  totalFutureValue += remaining;

  return Math.round(totalFutureValue);
}

// 示例输入
const M = 140;
const stocks = [
  { P: 15, S: 45, A: 3 }, // AAPL
  { P: 40, S: 50, A: 3 }, // BYND
  { P: 25, S: 35, A: 3 }, // SNAP
  { P: 30, S: 25, A: 4 }, // TSLA
];

console.log(maximizeFutureValue(M, stocks)); // 输出 265
