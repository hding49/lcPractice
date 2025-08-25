// A retail analytics platform stores order records in a data warehouse, with each record represented as a list of strings. The first row contains column headers, while all subsequent rows are order records with each value as a string. Every record includes at least these columns: order_id, cost, sell_price, product, and date (formatted as "YYYY-MM-DD"). Additional columns (e.g., state) may also be present.

// Your task is to simulate the creation of a pivot table that computes the net profit (sell_price minus cost) for each unique value in a specified column (pivotColumn), using only orders on or after a given start date (startDate). The pivotColumn can be "state", "product", or any other column.

// Implement the DataWarehouse class:

// DataWarehouse(List<List<String>> data) Initializes the data warehouse with the provided dataset. The first row is the header and the rest are data rows.

// String getMostProfitable(String pivotColumn, String startDate) Considers only records where date is on or after startDate. Finds the value in the pivot column with the highest total net profit.

// In case of a tie, returns the lexicographically smallest value.
// If no records match, returns "".
// Constraints:

// The table data contains at least one row (the header).
// Each row has the same length as the header.
// All values are non-null strings.
// Dates are in "YYYY-MM-DD" format.
// 1 ≤ data.size() ≤
// 10
// 5
// 10
// 5

// 1 ≤ data[0].size() ≤ 20
// Example:

// Input:
// ["DataWarehouse", "getMostProfitable", "getMostProfitable", "getMostProfitable"]

// [[["order_id", "cost", "sell_price", "product", "date", "state"], ["23", "12", "18", "cheese", "2023-12-04", "CA"], ["24", "5", "12", "melon", "2023-12-04", "OR"], ["25", "25", "31", "cheese", "2023-12-05", "OR"], ["26", "4", "12", "bread", "2023-12-05", "CA"], ["25", "10", "14", "cheese", "2023-12-06", "CA"], ["26", "5", "6", "bread", "2023-12-06", "OR"]], ["state", "2023-12-05"], ["product", "2023-12-05"], ["product", "2025-12-05"], ["color", "2023-12-01"]]

// Output:
// [null, "CA", "cheese", ""]

// Explanation:

// order_id	cost	sell_price	product	date	state
// 23	12	18	cheese	2023-12-04	CA
// 24	5	12	melon	2023-12-04	OR
// 25	25	31	cheese	2023-12-05	OR
// 26	4	12	bread	2023-12-05	CA
// 25	10	14	cheese	2023-12-06	CA
// 26	5	6	bread	2023-12-06	OR
// DataWarehouse warehouse = new DataWarehouse(data);
// warehouse.getMostProfitable("state", "2023-12-05"); // Returns "CA". For all records on or after "2023-12-05", the net profit for "CA" is (12 - 4) + (14 - 10) = 8 + 4 = 12, for "OR" is (31 - 25) + (6 - 5) = 6 + 1 = 7.
// warehouse.getMostProfitable("product", "2023-12-05"); // Returns "cheese". Net profit for "cheese" is 10, "bread" is 9, and "melon" is 0.
// warehouse.getMostProfitable("product", "2025-12-05"); // Returns "", as no dates qualify.
// warehouse.getMostProfitable("color", "2023-12-01"); // Returns "", as no column qualify.

// class DataWarehouse {
//     private data: string[][];

//     constructor(data: string[][]) {
//         this.data = data;
//     }

//     public getMostProfitable(column: string, startDate: string): string {
//         const header = this.data[0];
//         const costIdx = header.indexOf("cost");
//         const sellPriceIdx = header.indexOf("sell_price");
//         const dateIdx = header.indexOf("date");
//         const columnIdx = header.indexOf(column);

//         if (columnIdx === -1) {
//             return "";
//         }

//         const profitMap = new Map<string, number>();

//         for (let i = 1; i < this.data.length; i++) {
//             const row = this.data[i];
//             const rowDate = row[dateIdx];

//             // Only consider rows on or after the given start date
//             if (rowDate >= startDate) {
//                 const columnValue = row[columnIdx];
//                 const cost = parseInt(row[costIdx]);
//                 const sellPrice = parseInt(row[sellPriceIdx]);
//                 const profit = sellPrice - cost;

//                 // Sum profits by the column value
//                 profitMap.set(columnValue, (profitMap.get(columnValue) || 0) + profit);
//             }
//         }

//         // Find the most profitable entry
//         let mostProfitable = "";
//         let maxProfit = Number.MIN_SAFE_INTEGER;

//         for (const [key, profit] of profitMap.entries()) {
//             // Update most profitable entry and sort alphabetically if profit is the same
//             if (profit > maxProfit || (profit === maxProfit && key < mostProfitable)) {
//                 mostProfitable = key;
//                 maxProfit = profit;
//             }
//         }

//         return mostProfitable;
//     }
// }

class DataWarehouse {
  constructor(data) {
    this.data = data;
  }

  getMostProfitable(column, startDate) {
    const header = this.data[0];
    const costIdx = header.indexOf("cost");
    const sellPriceIdx = header.indexOf("sell_price");
    const dateIdx = header.indexOf("date");
    const columnIdx = header.indexOf(column);

    if (columnIdx === -1) {
      return "";
    }

    const profitMap = new Map();

    for (let i = 1; i < this.data.length; i++) {
      const row = this.data[i];
      const rowDate = row[dateIdx];

      if (rowDate >= startDate) {
        const columnValue = row[columnIdx];
        const cost = parseInt(row[costIdx], 10);
        const sellPrice = parseInt(row[sellPriceIdx], 10);
        const profit = sellPrice - cost;

        profitMap.set(columnValue, (profitMap.get(columnValue) || 0) + profit);
      }
    }

    let mostProfitable = "";
    let maxProfit = Number.MIN_SAFE_INTEGER;

    for (const [key, profit] of profitMap.entries()) {
      if (
        profit > maxProfit ||
        (profit === maxProfit && key < mostProfitable)
      ) {
        mostProfitable = key;
        maxProfit = profit;
      }
    }

    return mostProfitable;
  }
}
