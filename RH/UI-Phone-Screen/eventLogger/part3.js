import { sendRequest } from "./utils";

export class EventLogger {
  constructor() {
    this.eventQueue = []; // 事件缓冲
    this.uploadInterval = 2000;
    this.timerId = null;

    this.isUploading = false; // 串行上传锁
    this.uploadQueue = []; // 等待上传的批次

    this.startBatchUpload();
  }

  logEvent(eventName, data) {
    const event = {
      eventName,
      hostname: data.hostname,
      timestamp: new Date().toISOString(),
      data: data.data,
    };

    this.eventQueue.push(event);
  }

  startBatchUpload() {
    if (this.timerId) return;

    this.timerId = setInterval(() => {
      if (this.eventQueue.length === 0) return;

      const batch = this.eventQueue;
      this.eventQueue = [];

      this.enqueueUpload(batch);
    }, this.uploadInterval);
  }

  enqueueUpload(batch) {
    return new Promise((resolve, reject) => {
      this.uploadQueue.push({ batch, resolve, reject });
      this.processQueue();
    });
  }

  async processQueue() {
    if (this.isUploading) return;
    if (this.uploadQueue.length === 0) return;

    const { batch, resolve, reject } = this.uploadQueue.shift();

    this.isUploading = true;

    try {
      await this.uploadBatch(batch);
      resolve();
    } catch (error) {
      reject(error);
    }

    this.isUploading = false;
    this.processQueue();
  }

  uploadBatch(batch) {
    return sendRequest({ events: batch });
  }
}

const eventLogger = new EventLogger();
export { eventLogger };
