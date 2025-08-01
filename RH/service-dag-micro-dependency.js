// You are building an application composed of multiple services, where each service may rely on one or more other services, forming a directed acyclic graph (DAG) of dependencies. One of these services serves as the entry point that receives user requests and, upon receiving a request, calls each of its dependencies. These dependencies then call their own dependencies, and so on.

// The load factor of a service is defined as the number of units of load it must handle when the entry point receives 1 unit of load, assuming all upstream services issue their requests simultaneously.

// You are building an application that consists of many different services that can depend on each other. One of these services is the entrypoint which receives user requests and then makes requests to each of its dependencies, which will in turn call each of their dependencies and so on before returning.
// Given a directed acyclic graph that contains these dependencies, you are tasked with determining the "load factor" for each of these services to handle this load. The load factor of a service is defined as the number of units of load it will receive if the entrypoint receives a 1 unit of load. Note that we are interested in the worst case capacity. For a given downstream service, its load factor is the number of units of load it is required to handle if all upstream services made simultaneous requests. For example, in the following dependency graph where A is the entrypoint:

// Each query to A will generate one query to B which will pass it on to C and from there to D. A will also generate a query to C which will pass it on to D, so the worst case (maximum) load factors for each service is A:1, B:1, C:2, D:2.
// (Important: make sure you've fully understood the above example before proceeding!)

// Problem Details

// service_list: An array of strings of format service_name=dependency1,dependency2. Dependencies can be blank (e.g. dashboard=) and non-existent dependency references should be ignored (e.g. prices=users,foobar and foobar is not a service defined in the graph). Each service is defined only once in the graph.
// entrypoint: An arbitrary service that is guaranteed to exist within the graph
// Output: A list of all services depended by (and including) entrypoint as an array of strings with the format service_name*load_factor sorted by service name.
// Example

// Input:
// service_list = ["logging=",
// "user=logging",
// "orders=user,foobar",
// "recommendations=user,orders",
// "dashboard=user,orders,recommendations"]
// entrypoint = "dashboard"

// Output (note sorted by service name)
// ["dashboard1",
// "logging4",
// "orders2",
// "recommendations1",
// "user*4"]
// [execution time limit] 3 seconds (cs)

// [input] array.string service_list

// [input] string entrypoint

// [output] array.string

// [C#] Syntax Tips

// // Prints help message to the console
// // Returns a string
// string helloWorld(string name) {
// Console.Write("This prints to the console when you Run Tests");
// return "Hello, " + name;
// }

// Phone - microsvc dependency

// 别的面经没有提到的是要求用两种方法做，因为正着做的runtime是 2^n，反着做会快
// 虽然说错runtime了，好心的国人大哥给了strong feedback

function calculateLoad(service_list, entrypoint) {
  const graph = {}; // 用于构建服务依赖图
  const loadCount = new Map(); // 用于存储每个服务的负载统计

  // 构建服务图，格式：service -> [dep1, dep2, ...]
  for (let line of service_list) {
    const [service, depsStr] = line.split("="); // 解析每行
    const deps = depsStr ? depsStr.split(",").filter((dep) => dep) : [];
    graph[service] = deps;
  }

  // 深度优先搜索，从 entrypoint 开始，带着当前路径的请求 weight（权重）
  function dfs(service, weight) {
    if (!graph[service]) return;

    // 累加当前服务的负载
    loadCount.set(service, (loadCount.get(service) || 0) + weight);

    // 遍历当前服务的每个依赖，继续 DFS
    for (let dep of graph[service]) {
      if (graph.hasOwnProperty(dep)) {
        // 忽略未定义的依赖（如 foobar）
        dfs(dep, weight); // 同步请求，传递相同 weight
      }
    }
  }

  // 从入口服务开始，初始 weight 是 1
  dfs(entrypoint, 1);

  // 格式化输出结果：service*load，按服务名字母序排列
  const result = [];
  for (let [service, count] of loadCount.entries()) {
    result.push(`${service}*${count}`);
  }

  return result.sort((a, b) => a.localeCompare(b));
}

const service_list = [
  "logging=",
  "user=logging",
  "orders=user,foobar",
  "recommendations=user,orders",
  "dashboard=user,orders,recommendations",
];

const entrypoint = "dashboard";

console.log(calculateLoad(service_list, entrypoint));
// Output:
// [
//   "dashboard*1",
//   "logging*4",
//   "orders*2",
//   "recommendations*1",
//   "user*4"
// ]
