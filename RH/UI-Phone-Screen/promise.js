// https://medium.com/swlh/implement-a-simple-promise-in-javascript-20c9705f197a

// 面试是实现一个promise class的简化版，需要现场跑代码
// class Promise {
//   constructor(initialFn) {
//    ....

// }

//   then(fn) {
//   ...
// }
// }

// follow up是实现chaining

// 可以在网上搜一下关于实现promise class的相关代码

// 上来先自我介绍，然后问了一些前端基本知识，考了react hook，问了喜欢和不喜欢的理由

// coding是实现Promise的变种

// Constructor + then
// async then
// all

// 实现promise 1) constructor, 2)then, 3)resolve is asynchrous 4) chainable then

// 实现 Promise：首先只要实现Promise执行synchronous function的情况。executor function在实例Promise的时候调用，callback按顺序被调用就行。
// follow up 1:实现Promise执行asynchronous function的情况
// follow up 2: 分别在Promise resolve之前和之后调用then
// follow up 3: 实现Promise chain

// 题目主要内容
// 实现一个 Promise 类（简化版）

// 基础功能要求
// 构造函数（constructor）

// 接受一个执行器函数 executor，执行器同步调用，接收 resolve 和 reject 两个回调。

// 管理 Promise 状态：pending、fulfilled（成功）、rejected（失败）。

// 在调用 resolve 或 reject 后改变状态和保存对应的值。

// 支持在 executor 里抛错时调用 reject。

// then 方法

// 接收两个回调：onFulfilled（成功回调）、onRejected（失败回调）。

// 根据 Promise 状态调用对应回调。

// 支持多次调用 .then（多个回调存储队列）。

// Follow-up 扩展要求
// 异步回调执行

// 确保 .then 回调异步执行（使用 setTimeout 或微任务队列）。

// 支持在 resolve 之前或之后调用 .then，保证回调按时执行。

// 链式调用

// .then 返回一个新的 Promise，实现链式调用。

// 支持链式返回值是 Promise 或普通值。

// 需要实现辅助函数，处理 then 中返回的 Promise，避免循环引用。

// （可能）实现 Promise.all 等静态方法

// 题目里提到，但可能是额外问答，不一定现场写。

class MyPromise {
  constructor(executor) {
    this.state = "pending"; // Promise 状态：pending, fulfilled, rejected
    this.value = undefined; // fulfilled 时的值
    this.reason = undefined; // rejected 时的原因

    this.onFulfilledCallbacks = []; // fulfilled 状态回调队列
    this.onRejectedCallbacks = []; // rejected 状态回调队列

    const resolve = (value) => {
      if (this.state !== "pending") return;

      // 如果 resolve 的值是一个 Promise，则等待其完成
      if (value instanceof MyPromise) {
        return value.then(resolve, reject);
      }

      this.state = "fulfilled";
      this.value = value;

      // 微任务执行所有成功回调
      Promise.resolve().then(() => {
        this.onFulfilledCallbacks.forEach((fn) => fn(this.value));
      });
    };

    const reject = (reason) => {
      if (this.state !== "pending") return;

      this.state = "rejected";
      this.reason = reason;

      // 微任务执行所有失败回调
      Promise.resolve().then(() => {
        this.onRejectedCallbacks.forEach((fn) => fn(this.reason));
      });
    };

    // 立即执行 executor，捕获异常自动 reject
    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    // 如果不是函数，提供默认函数传递值或抛错
    onFulfilled = typeof onFulfilled === "function" ? onFulfilled : (v) => v;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (err) => {
            throw err;
          };

    // then 返回一个新的 Promise，支持链式调用
    const promise2 = new MyPromise((resolve, reject) => {
      if (this.state === "fulfilled") {
        Promise.resolve().then(() => {
          try {
            const x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      } else if (this.state === "rejected") {
        Promise.resolve().then(() => {
          try {
            const x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      } else if (this.state === "pending") {
        // 状态为 pending 时，将回调保存，状态改变后再执行
        this.onFulfilledCallbacks.push(() => {
          Promise.resolve().then(() => {
            try {
              const x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          });
        });

        this.onRejectedCallbacks.push(() => {
          Promise.resolve().then(() => {
            try {
              const x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          });
        });
      }
    });

    return promise2;
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  finally(onFinally) {
    return this.then(
      (value) => {
        return MyPromise.resolve(onFinally()).then(() => value);
      },
      (reason) => {
        return MyPromise.resolve(onFinally()).then(() => {
          throw reason;
        });
      }
    );
  }

  // 实现静态方法 Promise.all
  static all(promises) {
    return new MyPromise((resolve, reject) => {
      if (!Array.isArray(promises)) {
        return reject(new TypeError("Argument must be an array"));
      }

      const results = [];
      let completedCount = 0;

      if (promises.length === 0) {
        resolve(results);
        return;
      }

      promises.forEach((p, index) => {
        // 兼容非 Promise 值
        MyPromise.resolve(p).then(
          (value) => {
            results[index] = value;
            completedCount++;
            if (completedCount === promises.length) {
              resolve(results);
            }
          },
          (err) => {
            reject(err);
          }
        );
      });
    });
  }

  // 静态 resolve 方法，兼容普通值和 Promise
  static resolve(value) {
    if (value instanceof MyPromise) {
      return value;
    }
    return new MyPromise((resolve) => resolve(value));
  }
}

// 辅助函数：处理 then 返回值，兼容 Promise/A+ 规范
function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    return reject(new TypeError("Chaining cycle detected for promise"));
  }

  if (x !== null && (typeof x === "object" || typeof x === "function")) {
    let called = false;
    try {
      let then = x.then;
      if (typeof then === "function") {
        then.call(
          x,
          (y) => {
            if (called) return;
            called = true;
            resolvePromise(promise2, y, resolve, reject);
          },
          (r) => {
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } else {
        if (called) return;
        called = true;
        resolve(x);
      }
    } catch (e) {
      if (called) return;
      called = true;
      reject(e);
    }
  } else {
    resolve(x);
  }
}

// ===== 测试用例 =====

function testSyncResolve() {
  const p = new MyPromise((resolve) => {
    resolve(42);
  });

  p.then((value) => {
    console.log("Sync resolve:", value); // Sync resolve: 42
  });
}

function testAsyncResolve() {
  const p = new MyPromise((resolve) => {
    setTimeout(() => {
      resolve("async value");
    }, 100);
  });

  p.then((value) => {
    console.log("Async resolve:", value); // Async resolve: async value
  });
}

function testThenBeforeResolve() {
  const p = new MyPromise((resolve) => {
    setTimeout(() => {
      resolve("late resolve");
    }, 100);
  });

  p.then((value) => {
    console.log("Then before resolve:", value); // Then before resolve: late resolve
  });
}

function testChain() {
  new MyPromise((resolve) => {
    resolve(10);
  })
    .then((x) => {
      console.log("Chain step 1:", x); // Chain step 1: 10
      return x * 2;
    })
    .then((x) => {
      console.log("Chain step 2:", x); // Chain step 2: 20
      return new MyPromise((resolve) => {
        setTimeout(() => resolve(x + 5), 50);
      });
    })
    .then((x) => {
      console.log("Chain step 3 async:", x); // Chain step 3 async: 25
    });
}

function testReject() {
  new MyPromise((_, reject) => {
    reject("error happened");
  }).then(null, (err) => {
    console.log("Rejected:", err); // Rejected: error happened
  });
}

function testPromiseAll() {
  const p1 = new MyPromise((resolve) => setTimeout(() => resolve(1), 100));
  const p2 = new MyPromise((resolve) => setTimeout(() => resolve(2), 50));
  const p3 = 3; // 普通值

  MyPromise.all([p1, p2, p3])
    .then((results) => {
      console.log("Promise.all results:", results); // Promise.all results: [1, 2, 3]
    })
    .catch((err) => {
      console.error("Promise.all error:", err);
    });
}

// 运行所有测试
testSyncResolve();
testAsyncResolve();
testThenBeforeResolve();
testChain();
testReject();
testPromiseAll();
