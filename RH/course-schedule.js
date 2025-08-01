// Given an array of pairs where each pair represents a course dependency in the form of [prerequisite, course].
// Each pair indicates that the prerequisite course must be completed before the next course.
// It is guaranteed that the given pairs form one continuous chain with an odd total number of courses, ensuring a single middle course exists.
// And every course appears only once as a prerequisite (except for the starting course) and only once as a course (except for the final course).

// input1 = [
//     ["Data Structures", "Algorithms"],
//     ["COBOL", "Networking"],
//     ["Algorithms", "COBOL"]
// ]

// input2 = [
//     ["Logic", "COBOL"],["Data Structures", "Algorithms"],
//     ["Creative Writing", "Data Structures"],
//     ["Algorithms", "COBOL"],
//     ["Intro to Computer Science", "Data Structures"],
//     ["Logic", "Compilers"],
//     ["Data Structures", "Logic"],
//     ["Graphics", "Networking"],
//     ["Networking", "Algorithms"],
//     ["Creative Writing", "System Administration"],
//     ["Databases", "System Administration"],
//     ["Creative Writing", "Databases"],
//     ["Intro to Computer Science", "Graphics"]
// ]

// input3 = [
//     ["Course_3", "Course_7"],
//     ["Course_0", "Course_1"],
//     ["Course_1", "Course_2"],
//     ["Course_2", "Course_3"],
//     ["Course_3", "Course_4"],
//     ["Course_4", "Course_5"],
//     ["Course_5", "Course_6"]
// ]

// def find_mid_course(rules):

//     # calculate in-degrees
//     in_map = {}
//     # memorize next course
//     next_cs_map = {}
//     for pre, next in rules:
//         in_map[next] = in_map.get(next, 0) + 1
//         next_cs_map[pre] = next

//     # find the head
//     head = None

//     for cs in next_cs_map:
//         if cs not in in_map:
//             head = cs
//             break

//     # find mid
//     for i in range(0, (len(next_cs_map) - 1) // 2):
//         head = next_cs_map[head]

//     return head

// def find_mid_course_2(rules):

//     # find in-degrees
//     in_map = {}
//     # {cs1:[cs1, cs2]}
//     nex_map = {}
//     for pre, nex in rules:
//         in_map[nex] = in_map.get(nex, 0) + 1
//         nex_map[pre] = nex_map.get(pre, [])
//         nex_map[pre].append(nex)

//     # find heads
//     heads = []
//     for pre in nex_map:
//         if pre not in in_map:
//             heads.append(pre)

//     # find all paths
//     all_paths = []
//     find_all_path(heads, nex_map, all_paths, [])

//     result = []
//     # find all mid cs:
//     for path in all_paths:
//         mid_course = path[(len(path) - 1) // 2]
//         if mid_course not in result:
//             result.append( mid_course )

//     return result

// def find_all_path(courses, next_course_map, all_path, pre_path):

//     if not courses:
//         all_path.append(pre_path)
//         return

//     for course in courses:
//         find_all_path(next_course_map.get(course, []), next_course_map, all_path, pre_path + [course])

// print(find_mid_course(input1))
// print(find_mid_course_2(input2))

function findMidCourse(rules) {
  const inMap = new Map();
  const nextMap = new Map();

  for (const [pre, next] of rules) {
    inMap.set(next, (inMap.get(next) || 0) + 1);
    nextMap.set(pre, next);
  }

  // 找头课程
  let head = null;
  for (const course of nextMap.keys()) {
    if (!inMap.has(course)) {
      head = course;
      break;
    }
  }

  // 沿着链走一半
  const len = nextMap.size;
  const steps = Math.floor((len - 1) / 2);
  for (let i = 0; i < steps; i++) {
    head = nextMap.get(head);
  }

  return head;
}

const input1 = [
  ["Data Structures", "Algorithms"],
  ["COBOL", "Networking"],
  ["Algorithms", "COBOL"],
];

console.log(findMidCourse(input1)); // Output: "Algorithms"

function findMidCourses2(rules) {
  const inMap = new Map();
  const nextMap = new Map();

  for (const [pre, next] of rules) {
    inMap.set(next, (inMap.get(next) || 0) + 1);
    if (!nextMap.has(pre)) nextMap.set(pre, []);
    nextMap.get(pre).push(next);
  }

  // 找所有链的头节点
  const heads = [];
  for (const pre of nextMap.keys()) {
    if (!inMap.has(pre)) {
      heads.push(pre);
    }
  }

  const allPaths = [];
  for (const head of heads) {
    dfs(head, nextMap, [], allPaths);
  }

  const mids = new Set();
  for (const path of allPaths) {
    const mid = path[Math.floor((path.length - 1) / 2)];
    mids.add(mid);
  }

  return Array.from(mids);
}

function dfs(course, nextMap, path, allPaths) {
  path.push(course);
  const nexts = nextMap.get(course) || [];
  if (nexts.length === 0) {
    allPaths.push([...path]);
  } else {
    for (const next of nexts) {
      dfs(next, nextMap, path, allPaths);
    }
  }
  path.pop();
}

const input2 = [
  ["Logic", "COBOL"],
  ["Data Structures", "Algorithms"],
  ["Creative Writing", "Data Structures"],
  ["Algorithms", "COBOL"],
  ["Intro to Computer Science", "Data Structures"],
  ["Logic", "Compilers"],
  ["Data Structures", "Logic"],
  ["Graphics", "Networking"],
  ["Networking", "Algorithms"],
  ["Creative Writing", "System Administration"],
  ["Databases", "System Administration"],
  ["Creative Writing", "Databases"],
  ["Intro to Computer Science", "Graphics"],
];

console.log(findMidCourses2(input2));
// Output: 中间课程数组，例如 [ "Data Structures", "Networking", "Databases", ... ]

const input3 = [
  ["Course_3", "Course_7"],
  ["Course_0", "Course_1"],
  ["Course_1", "Course_2"],
  ["Course_2", "Course_3"],
  ["Course_3", "Course_4"],
  ["Course_4", "Course_5"],
  ["Course_5", "Course_6"],
];

console.log(findMidCourses2(input3)); // Output: [ 'Course_3' ]
