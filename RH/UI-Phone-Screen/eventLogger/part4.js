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

    // Part 4 - 当前请求 & 超时控制
    this.currentRequest = null;
    this.requestTimeout = 3000; // 3秒超时

    this.startBatchUpload();
  }

  // ---------------- Part 1 ----------------
  // 每次点击 → Part 1 直接上传，Part 2+ 改为入队
  logEvent(eventName, data) {
    const event = {
      eventName,
      hostname: data.hostname,
      timestamp: new Date().toISOString(),
      data: data.data,
    };

    // Part 2+ 改为入队等待批量上传
    this.eventQueue.push(event);
  }

  // ---------------- Part 2 ----------------
  startBatchUpload() {
    if (this.timerId) return; // 防止重复启动

    this.timerId = setInterval(() => {
      if (this.eventQueue.length === 0) return;

      const batch = this.eventQueue;
      this.eventQueue = [];

      // Part 3 - 串行上传
      this.enqueueUpload(batch);
    }, this.uploadInterval);
  }

  // ---------------- Part 3 ----------------
  enqueueUpload(batch) {
    return new Promise((resolve, reject) => {
      this.uploadQueue.push({ batch, resolve, reject });
      this.processQueue();
    });
  }

  async processQueue() {
    if (this.isUploading) return; // 正在上传中

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
    this.processQueue(); // 继续下一个
  }

  // ---------------- Part 4 ----------------
  async uploadBatchWithTimeout(batch) {
    // 如果有请求在飞，先中断
    if (this.currentRequest) {
      this.currentRequest.abort();
      this.currentRequest = null;
    }

    const requestPromise = sendRequest({ events: batch });
    this.currentRequest = requestPromise;

    // 超时控制
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        if (this.currentRequest === requestPromise) {
          requestPromise.abort();
          // 把事件放回队列
          this.eventQueue = batch.concat(this.eventQueue);
          reject(new Error("Upload timeout"));
        }
      }, this.requestTimeout);
    });

    try {
      await Promise.race([requestPromise, timeoutPromise]);
    } finally {
      if (this.currentRequest === requestPromise) {
        this.currentRequest = null;
      }
    }
  }
}

const eventLogger = new EventLogger();
export { eventLogger };
