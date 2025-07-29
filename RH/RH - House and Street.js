// // A trade is defined as a fixed-width string containing the 4 properties given below separated by commas:

// // Symbol (4 alphabetical characters, left-padded by spaces)
// // Type (either "B" or "S" for buy or sell)
// // Quantity (4 digits, left-padded by zeros)
// // ID (6 alphanumeric characters)
// // e.g.
// // "AAPL,B,0100,ABC123"

// // which represents a trade of a buy of 100 shares of AAPL with ID "ABC123"

// // Given two lists of trades - called "house" and "street" trades, write code to filter out groups of matches between trades and return a list of unmatched house and street trades sorted alphabetically. There are many ways to match trades, the first and most important way is an exact match (Tests 1-5):

// // An exact match is a house_trade+street_trade pair with identical symbol, type, quantity, and ID
// // Note: Trades are distinct but not unique

// // For example, given the following input:

// // // house_trades:
// // [
// // "AAPL,B,0080,ABC123",
// // "AAPL,B,0050,ABC123",
// // "GOOG,S,0050,CDC333"
// // ]

// // // street_trades:
// // [
// // " FB,B,0100,GBGGGG",
// // "AAPL,B,0100,ABC123"
// // ]

// // We would expect the following output:

// // [
// // " FB,B,0100,GBGGGG",
// // "AAPL,B,0100,ABC123",
// // "GOOG,S,0050,CDC333"
// // ]

// // Because the first (or second) house trade and second street trade form an exact match, leaving behind three unmatched trades.

// // Follow-up 1 (Test 6,7,8,9): A "fuzzy" match is a house_trade+street_trade pair with identical symbol, type, and quantity ignoring ID. Prioritize exact matches over fuzzy matches. Prioritize matching the earliest alphabetical house trade with the earliest alphabetical street trade in case of ties.

// // Follow-up 2: (Test 10) An offsetting match is a house_trade+house_trade or street_trade+street_trade pair where the symbol and quantity of both trades are the same, but the type is different (one is a buy and one is a sell). Prioritize exact and fuzzy matches over offsetting matches. Prioritize matching the earliest alphabetical buy with the earliest alphabetical sell.

// void addTrades(unordered_map<string, int>& trade2count,
//                vector<string>& trades) {
//     for (auto it = trade2count.begin(); it != trade2count.end(); it++) {
//         int count = trade2count[it->first];
//         while (count--) {
//             trades.push_back(it->first);
//         }
//     }
//     sort(trades.begin(), trades.end());
// }

// void exactMatch(vector<string>& house_trades,
//                 vector<string>& street_trades,
//                 vector<string>& output_house_trades,
//                 vector<string>& output_street_trades) {
//     output_house_trades.clear();
//     output_street_trades.clear();
//     unordered_map<string/*trade*/, int/*count*/> house_trade2count, street_trade2count;
//     for (auto& trade : house_trades) {
//         house_trade2count[trade]++;
//     }
//     for (auto& trade : street_trades) {
//         street_trade2count[trade]++;
//     }
//     for (auto it = house_trade2count.begin(); it != house_trade2count.end(); it++) {
//         string trade = it->first;
//         if (street_trade2count.find(trade) == street_trade2count.end()) {
//             continue;
//         }
//         int matches = min(house_trade2count[trade], street_trade2count[trade]);
//         house_trade2count[trade] -= matches;
//         street_trade2count[trade] -= matches;
//     }

//     addTrades(house_trade2count, output_house_trades);

//     addTrades(street_trade2count, output_street_trades);
// }

// void fuzzMatchWithExact(vector<string>& house_trades,
//                         vector<string>& street_trades,
//                         vector<string>& output_house_trades,
//                         vector<string>& output_street_trades) {
//     output_house_trades.clear();
//     output_street_trades.clear();
//     unordered_map<string/*fuzzy pattern*/, vector<string>> house_map, street_map;
//     for (auto trade : house_trades) {
//         house_map[trade.substr(0, 11)].push_back(trade);
//     }
//     for (auto trade : street_trades) {
//         street_map[trade.substr(0, 11)].push_back(trade);
//     }
//     for (auto it = house_map.begin(); it != house_map.end(); it++) {
//         if (street_map.find(it->first) == street_map.end()) continue;
//         int matches = min(it->second.size(), street_map[it->first].size());
//         it->second.erase(it->second.begin(), it->second.begin() + matches);
//         auto& list = street_map[it->first];
//         list.erase(list.begin(), list.begin() + matches);
//     }
//     for (auto it = house_map.begin(); it != house_map.end(); it++) {
//         if (it->second.empty()) continue;
//         output_house_trades.insert(output_house_trades.end(), it->second.begin(), it->second.end());
//     }
//     for (auto it = street_map.begin(); it != street_map.end(); it++) {
//         if (it->second.empty()) continue;
//         output_street_trades.insert(output_street_trades.end(), it->second.begin(), it->second.end());
//     }

// }

// void print(vector<string>& house_trades,
//            vector<string>& street_trades) {

//     for (auto& trade : house_trades) {
//         cout << "\n" << trade;
//     }
//     for (auto& trade : street_trades) {
//         cout << "\n" << trade;
//     }
// }

// int main() {
//     vector<string> house_trades = {
//         "AAPL,B,0100,ABC123",
//         "GOOG,S,0050,CDC333"
//     };
//     vector<string> street_trades = {
//         "  FB,B,0100,GBGGGG",
//         "AAPL,B,0100,ABC123"
//     };
//     vector<string> output_house_trades, output_street_trades;
//     cout << "\n\nQ1 test case 1:";
//     vector<string> trades;
//     exactMatch(house_trades, street_trades, output_house_trades, output_street_trades);
//     print(output_house_trades, output_street_trades);

//     house_trades = {
//          "AAPL,S,0010,ZYX445",
//          "AAPL,S,0010,ZYX446",
//          "AAPL,B,0010,ABC123",
//          "GOOG,S,0050,GHG545"
//     };
//     street_trades = {
//          "GOOG,S,0050,GHG545",
//          "AAPL,S,0010,ZYX444",
//          "AAPL,B,0010,TTT222"
//     };
//     cout << "\n\nQ1 test case 2:";
//     fuzzMatchWithExact(house_trades, street_trades, output_house_trades, output_street_trades);
//     print(output_house_trades, output_street_trades);

// }

function tradeKey(trade) {
  return trade.trim();
}

function fuzzyKey(trade) {
  return trade.slice(0, 11);
}

function parseTrade(trade) {
  const [symbol, type, qty, id] = trade.split(",");
  return { symbol: symbol.trim(), type, qty, id, raw: trade };
}

function exactMatch(house, street) {
  const houseMap = {};
  const streetMap = {};

  for (const t of house) houseMap[t] = (houseMap[t] || 0) + 1;
  for (const t of street) streetMap[t] = (streetMap[t] || 0) + 1;

  for (const t in houseMap) {
    if (streetMap[t]) {
      const matched = Math.min(houseMap[t], streetMap[t]);
      houseMap[t] -= matched;
      streetMap[t] -= matched;
      if (houseMap[t] === 0) delete houseMap[t];
      if (streetMap[t] === 0) delete streetMap[t];
    }
  }

  return [
    Object.entries(houseMap).flatMap(([k, v]) => Array(v).fill(k)),
    Object.entries(streetMap).flatMap(([k, v]) => Array(v).fill(k)),
  ];
}

function fuzzyMatch(house, street) {
  const groupByFuzzy = (list) => {
    const map = {};
    for (const trade of list) {
      const key = fuzzyKey(trade);
      if (!map[key]) map[key] = [];
      map[key].push(trade);
    }
    return map;
  };

  const houseMap = groupByFuzzy(house);
  const streetMap = groupByFuzzy(street);

  const remainingHouse = [];
  const remainingStreet = [];

  for (const key in houseMap) {
    const hList = houseMap[key];
    const sList = streetMap[key] || [];
    const matched = Math.min(hList.length, sList.length);
    remainingHouse.push(...hList.slice(matched));
    remainingStreet.push(...sList.slice(matched));
    delete streetMap[key];
  }

  // Add remaining unmatched street trades
  for (const key in streetMap) {
    remainingStreet.push(...streetMap[key]);
  }

  return [remainingHouse, remainingStreet];
}

function offsettingMatch(trades) {
  const map = {}; // symbol+qty => { B: [], S: [] }

  for (const trade of trades) {
    const { symbol, type, qty } = parseTrade(trade);
    const key = `${symbol},${qty}`;
    if (!map[key]) map[key] = { B: [], S: [] };
    map[key][type].push(trade);
  }

  const unmatched = [];

  for (const key in map) {
    const { B, S } = map[key];
    const matched = Math.min(B.length, S.length);
    unmatched.push(...B.slice(matched));
    unmatched.push(...S.slice(matched));
  }

  return unmatched.sort();
}

function solve(house, street) {
  // Step 1: Exact match
  let [h1, s1] = exactMatch(house, street);

  // Step 2: Fuzzy match (on leftover from step 1)
  let [h2, s2] = fuzzyMatch(h1, s1);

  // Step 3: Offsetting match within each side
  const h3 = offsettingMatch(h2);
  const s3 = offsettingMatch(s2);

  // Step 4: Combine and sort
  const result = [...h3, ...s3].sort();
  return result;
}

const house1 = [
  "AAPL,B,0080,ABC123",
  "AAPL,B,0050,ABC123",
  "GOOG,S,0050,CDC333",
];

const street1 = ["  FB,B,0100,GBGGGG", "AAPL,B,0100,ABC123"];

console.log("Test Case 1:");
console.log(solve(house1, street1));
// Output:
// [
//   "  FB,B,0100,GBGGGG",
//   "AAPL,B,0100,ABC123",
//   "GOOG,S,0050,CDC333"
// ]

const house2 = [
  "AAPL,S,0010,ZYX445",
  "AAPL,S,0010,ZYX446",
  "AAPL,B,0010,ABC123",
  "GOOG,S,0050,GHG545",
];

const street2 = [
  "GOOG,S,0050,GHG545",
  "AAPL,S,0010,ZYX444",
  "AAPL,B,0010,TTT222",
];

console.log("Test Case 2:");
console.log(solve(house2, street2));
// Output:
// [
//   "AAPL,S,0010,ZYX445",
//   "AAPL,S,0010,ZYX446",
//   "AAPL,S,0010,ZYX444",
//   "AAPL,B,0010,TTT222"
// ]
