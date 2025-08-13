/**
 * `sendRequest` is a helper function to send your request with
 * following type signature:
 *
 * sendRequest(body: Object) => Promise<void>
 *
 * You can abort the request "in-flight" via the following:
 *
 * const requestPromise = sendRequest()
 * requestPromise.abort()
 *
 */

// 第一问：直接 sendRequest。

// 第二问：加 eventQueue + setInterval 批量发送。

// 第三问：在第二问基础上，加 uploadQueue + isUploading 串行化控制。

import { sendRequest } from "./utils";

export class EventLogger {
  constructor() {
    // Part 2 - 维护事件队列和定时器
    this.eventQueue = [];
    this.uploadInterval = 2000; // 2秒上传一次
    this.timerId = null;

    // Part 3 - 串行上传控制
    this.isUploading = false;
    this.uploadQueue = [];

    // Part 4 - 超时控制和 abort controller
    this.currentAbortController = null;

    this.startBatchUpload();
  }

  // ---------------- Part 1 ----------------
  // Part 1: 每次点击立即上传
  // 但 Part 2 开启后，logEvent 改为入队，不立即上传
  logEvent(eventName, data) {
    const event = {
      eventName,
      hostname: data.hostname,
      timestamp: new Date().toISOString(),
      data: data.data,
    };

    // Part 2+ 后，改为入队等待批量上传
    this.eventQueue.push(event);
  }

  // Part 2 - 定时批量上传
  startBatchUpload() {
    if (this.timerId) return; // 防止多次调用

    this.timerId = setInterval(() => {
      if (this.eventQueue.length === 0) return;

      // 取出当前批次的事件
      const batch = this.eventQueue;
      this.eventQueue = [];

      // 加入上传队列，保证串行上传（Part 3）
      this.enqueueUpload(batch);
    }, this.uploadInterval);
  }

  // Part 3 - 上传队列串行执行
  enqueueUpload(batch) {
    return new Promise((resolve, reject) => {
      this.uploadQueue.push({ batch, resolve, reject });
      this.processQueue();
    });
  }

  async processQueue() {
    if (this.isUploading) return; // 已经有上传任务，等待完成

    if (this.uploadQueue.length === 0) return;

    const { batch, resolve, reject } = this.uploadQueue.shift();

    this.isUploading = true;

    try {
      await this.uploadBatchWithTimeout(batch);
      resolve();
    } catch (error) {
      reject(error);
    }

    this.isUploading = false;

    // 上传完成后，继续处理队列
    this.processQueue();
  }

  // Part 4 - 超时取消和合并重试
  async uploadBatchWithTimeout(batch) {
    // 创建 AbortController 用于取消请求
    this.currentAbortController = new AbortController();
    const { signal } = this.currentAbortController;

    // 超时设置 3秒
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        // 超时，abort 请求
        if (this.currentAbortController) {
          //在调用 abort() 前检查对象是否存在
          this.currentAbortController.abort();
          reject(new Error("Upload timeout"));
        }
      }, 3000);
    });

    // 发起上传请求
    const uploadPromise = sendRequest({ events: batch }, { signal });

    try {
      // Promise.race：哪个先完成，返回哪个
      await Promise.race([uploadPromise, timeoutPromise]);
      this.currentAbortController = null;
    } catch (err) {
      if (err.message === "Upload timeout") {
        // Part 4 - 超时合并处理
        // 把本次失败 batch 放回事件队列，并合并下一批事件再上传
        this.eventQueue = batch.concat(this.eventQueue);
        // 这里拒绝当前上传，下一轮 setInterval 会重新上传
        throw err;
      } else if (err.name === "AbortError") {
        // 请求被中止，也抛错让外层处理
        throw err;
      } else {
        throw err;
      }
    }
  }
}

const eventLogger = new EventLogger();
export { eventLogger };
