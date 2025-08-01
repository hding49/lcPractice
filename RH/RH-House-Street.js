// https://leetcode.com/discuss/interview-question/882324/robinhood-phone-screen

// A trade is defined as a string containing the 4 properties given below separated by commas:

// Symbol (4 alphabetical characters, left-padded by spaces)
// Side (either "B" or "S" for buy or sell)
// Quantity (4 digits, left-padded by zeros)
// ID (6 alphanumeric characters)
// e.g.
// "AAPL,B,0100,ABC123"

// which represents a trade of a buy of 100 shares of AAPL with ID "ABC123"

// Given two lists of trades - called "house" and "street" trades, write code to create groups of matches between trades and return a list of unmatched house and street trades sorted alphabetically. Without any matching, the output list would contain all elements of both house and street trades. There are many ways to match trades, the first and most important way is an exact match:

// An exact match is a pair of trades containing exactly one house trade and exactly one street trade with identical symbol, side, quantity, and ID
// Note: Trades are distinct but not unique

// For example, given the following input:
// house_trades:
// [ "AAPL,B,0100,ABC123", "AAPL,B,0100,ABC123", "GOOG,S,0050,CDC333" ]
// street_trades:
// [ " FB,B,0100,GBGGGG", "AAPL,B,0100,ABC123" ]
// We would expect the following output:
// [ " FB,B,0100,GBGGGG", "AAPL,B,0100,ABC123", "GOOG,S,0050,CDC333" ]

// Because the first (or second) house trade and second street trade form an exact match, leaving behind three unmatched trades.

// Bonus 1 (Test 4 and 5): An attribute match is a match containing exactly one house trade and exactly one street trade with identical symbol, side, and quantity ignoring ID. Prioritize exact matches over attribute matches. Prioritize matching the earliest lexicographical house trade with the earliest lexicographical street trade in case of ties.

// Bonus 2: (Test 6) An offsetting match is a match containing exactly two house trades or exactly two street trades where the symbol and quantity of both trades are the same, but the side is different (one is a buy and one is a sell). Prioritize exact and attribute matches over offsetting matches. Prioritize matching the earliest lexicographical buy with the earliest lexicographical sell.

// Step 1: 完全匹配（Exact Match）
// house 和 street 中完全相同的交易按数量匹配并剔除
function exactMatch(house, street) {
  const houseMap = {};
  const streetMap = {};

  // 统计 house 交易出现次数
  for (const t of house) houseMap[t] = (houseMap[t] || 0) + 1;
  // 统计 street 交易出现次数
  for (const t of street) streetMap[t] = (streetMap[t] || 0) + 1;

  // 遍历 houseMap 中每个交易，如果 streetMap 中也存在，匹配数量取最小值
  for (const t in houseMap) {
    if (streetMap[t]) {
      const matched = Math.min(houseMap[t], streetMap[t]);
      // 双方减去匹配数量
      houseMap[t] -= matched;
      streetMap[t] -= matched;
      // 如果数量为0，删除该键，表示完全匹配
      if (houseMap[t] === 0) delete houseMap[t];
      if (streetMap[t] === 0) delete streetMap[t];
    }
  }

  // 展开剩余未匹配的交易（按数量重复填充），返回house和street剩余列表
  return [
    Object.entries(houseMap).flatMap(([k, v]) => Array(v).fill(k)),
    Object.entries(streetMap).flatMap(([k, v]) => Array(v).fill(k)),
  ];
}

// Step 2: 模糊匹配（Attribute Match）
// 只比较交易的 symbol+side+quantity（前11字符），忽略ID字段，尽量匹配数量
function fuzzyMatch(house, street) {
  // 根据前11字符分组交易列表
  const groupByFuzzy = (list) => {
    const map = {};
    for (const trade of list) {
      const key = trade.slice(0, 11); // symbol(4)+comma+side+comma+quantity(4)
      if (!map[key]) map[key] = [];
      map[key].push(trade);
    }
    return map;
  };

  const houseMap = groupByFuzzy(house);
  const streetMap = groupByFuzzy(street);

  const remainingHouse = [];
  const remainingStreet = [];

  // 遍历 house 分组，找对应的 street 分组匹配，匹配数量取最小
  for (const key in houseMap) {
    const hList = houseMap[key];
    const sList = streetMap[key] || [];
    const matched = Math.min(hList.length, sList.length);
    // 剩余未匹配的加入结果数组
    remainingHouse.push(...hList.slice(matched));
    remainingStreet.push(...sList.slice(matched));
    // 删除已匹配的street分组，避免重复处理
    delete streetMap[key];
  }

  // street中剩余未匹配的加入结果
  for (const key in streetMap) {
    remainingStreet.push(...streetMap[key]);
  }

  return [remainingHouse, remainingStreet];
}

// Step 3: 反向匹配（Offsetting Match）
// 单边（house或street）内，按symbol和quantity分组，匹配买卖相反（B/S）交易数量
function offsettingMatch(trades) {
  const map = {};

  // 按symbol和quantity分组，分别保存买（B）和卖（S）交易列表
  for (const trade of trades) {
    const [symbol, type, qty, id] = trade.split(",");
    const key = `${symbol},${qty}`;
    if (!map[key]) map[key] = { B: [], S: [] };
    map[key][type].push(trade);
  }

  const unmatched = [];

  // 对每组，买卖双方尽量匹配，剩余未匹配的放入结果
  for (const key in map) {
    const { B, S } = map[key];
    const matched = Math.min(B.length, S.length);
    unmatched.push(...B.slice(matched));
    unmatched.push(...S.slice(matched));
  }

  // 返回排序后的剩余未匹配交易
  return unmatched.sort();
}

// 主流程函数：分三步匹配，最后返回剩余未匹配交易，排序输出
function solve(house, street) {
  // 标准化交易字符串，去除多余空格，保证格式统一
  function normalizeTrade(trade) {
    // 以逗号分割交易字符串
    const parts = trade.split(",");
    // 去除每个字段的前后空格
    const trimmedParts = parts.map((p) => p.trim());
    // symbol固定4字符，右对齐，不足补空格（保证统一格式）
    trimmedParts[0] = trimmedParts[0].padStart(4, " ").slice(-4);
    // 重新用逗号连接，返回标准化后的交易字符串
    return trimmedParts.join(",");
  }

  // 对交易数组中的每个元素统一调用normalizeTrade，返回新数组
  function normalizeTrades(trades) {
    return trades.map(normalizeTrade);
  }

  // 先统一格式化输入交易字符串，确保匹配时格式一致
  const normHouse = normalizeTrades(house);
  const normStreet = normalizeTrades(street);

  // Step 1: 完全匹配
  let [h1, s1] = exactMatch(normHouse, normStreet);

  // Step 2: 模糊匹配（忽略ID，只匹配前三属性）
  let [h2, s2] = fuzzyMatch(h1, s1);

  // Step 3: 单边反向匹配买卖相反交易
  const h3 = offsettingMatch(h2);
  const s3 = offsettingMatch(s2);

  // 合并剩余交易，排序返回
  return [...h3, ...s3].sort();
}

// === 测试用例 ===
const tests = [
  {
    name: "Test case 0",
    house: ["AAPL,B,0100,ABC123", "AAPL,B,0100,ABC123", "GOOG,S,0050,CDC333"],
    street: ["  FB,B,0100,GBGGGG", "AAPL,B,0100,ABC123"],
    expected: [
      "  FB,B,0100,GBGGGG",
      "AAPL,B,0100,ABC123",
      "GOOG,S,0050,CDC333",
    ].sort(),
  },
  {
    name: "Test case 1",
    house: ["AAPL,B,0100,ABC123", "GOOG,S,0050,CDC333"],
    street: ["  FB,B,0100,GBGGGG", "AAPL,B,0100,ABC123"],
    expected: ["  FB,B,0100,GBGGGG", "GOOG,S,0050,CDC333"].sort(),
  },
  {
    name: "Test case 2",
    house: [
      "AAPL,S,0010,ZYX444",
      "AAPL,S,0010,ZYX444",
      "AAPL,B,0010,ABC123",
      "GOOG,S,0050,GHG545",
    ],
    street: ["GOOG,S,0050,GHG545", "AAPL,S,0010,ZYX444", "AAPL,B,0010,TTT222"],
    expected: ["AAPL,S,0010,ZYX444"].sort(),
  },
  {
    name: "Test case 3",
    house: [
      "AAPL,B,0010,ABC123",
      "AAPL,S,0015,ZYX444",
      "AAPL,S,0015,ZYX444",
      "GOOG,S,0050,GHG545",
    ],
    street: ["GOOG,S,0050,GHG545", "AAPL,S,0015,ZYX444", "AAPL,B,0500,TTT222"],
    expected: [
      "AAPL,B,0010,ABC123",
      "AAPL,S,0015,ZYX444",
      "AAPL,B,0500,TTT222",
    ].sort(),
  },
  {
    name: "Test case 4",
    house: [
      "AAPL,B,0100,ABC123",
      "AAPL,B,0100,ABC123",
      "AAPL,B,0100,ABC123",
      "GOOG,S,0050,CDC333",
    ],
    street: [
      "  FB,B,0100,GBGGGG",
      "AAPL,B,0100,ABC123",
      "AAPL,B,0100,ABC123",
      "GOOG,S,0050,CDC333",
    ],
    expected: ["  FB,B,0100,GBGGGG", "AAPL,B,0100,ABC123"].sort(),
  },
  {
    name: "Test case 5",
    house: [
      "AAPL,B,0100,ABC123",
      "AAPL,B,0100,ABC123",
      "AAPL,B,0100,ABC123",
      "GOOG,S,0050,CDC333",
    ],
    street: [
      "  FB,B,0100,GBGGGG",
      "AAPL,B,0100,ABC123",
      "AAPL,B,0100,ABC123",
      "GOOG,S,0050,CDC333",
      "AAPL,S,0100,ABC124",
    ],
    expected: [
      "  FB,B,0100,GBGGGG",
      "AAPL,B,0100,ABC123",
      "AAPL,S,0100,ABC124",
    ].sort(),
  },
  {
    name: "Test case 6",
    house: [
      "AAPL,B,0010,ABC123",
      "AAPL,S,0015,ZYX444",
      "AAPL,S,0015,ZYX444",
      "AAPL,S,0015,ZYX444",
      "AAPL,S,0015,ZYX444",
      "AAPL,S,0015,ZYX444",
      "GOOG,S,0050,GHG545",
    ],
    street: [
      "GOOG,S,0050,GHG545",
      "AAPL,S,0015,ZYX444",
      "AAPL,S,0015,ZYX444",
      "AAPL,S,0015,ZYX444",
      "AAPL,S,0015,ZYX444",
      "AAPL,B,0500,TTT222",
    ],
    expected: [
      "AAPL,S,0015,ZYX444",
      "AAPL,B,0010,ABC123",
      "AAPL,B,0500,TTT222",
    ].sort(),
  },
  {
    name: "Empty inputs",
    house: [],
    street: [],
    expected: [],
  },
  {
    name: "Only house trades, no street trades",
    house: ["AAPL,B,0100,ABC123"],
    street: [],
    expected: ["AAPL,B,0100,ABC123"],
  },
  {
    name: "Only street trades, no house trades",
    house: [],
    street: ["AAPL,B,0100,ABC123"],
    expected: ["AAPL,B,0100,ABC123"],
  },
  {
    name: "Exact match priority over attribute and offset",
    house: [
      "AAPL,B,0100,ABC123",
      "AAPL,B,0100,XXX999",
      "AAPL,S,0100,ZYX111",
      "AAPL,S,0100,ZYX222",
    ],
    street: [
      "AAPL,B,0100,ABC123",
      "AAPL,B,0100,ZZZ888",
      "AAPL,S,0100,ZYX222",
      "AAPL,S,0100,ZZZ333",
    ],
    expected: [].sort(), // 全部匹配完，无剩余
  },
  {
    name: "Formats with spaces and trimming",
    house: ["  AAPL , B , 0100 , ABC123 ", "GOOG,S,0050,CDC333"],
    street: ["AAPL,B,0100,ABC123", "GOOG,S,0050,CDC333 "],
    expected: [], // 全部匹配完
  },
];

// === 运行测试 ===
for (const { name, house, street, expected } of tests) {
  const result = solve(house, street);
  const pass = JSON.stringify(result) === JSON.stringify(expected);
  console.log(`${name} result:`);
  console.log(result);
  console.log(`Expected:`);
  console.log(expected);
  console.log(`Test ${pass ? "PASSED ✅" : "FAILED ❌"}`);
  console.log("------");
}
