import { sendRequest } from "./utils";

export class EventLogger {
  constructor() {
    this.eventQueue = [];
    this.uploadInterval = 2000; // 2秒上传一次
    this.timerId = null;

    this.startBatchUpload();
  }

  logEvent(eventName, data) {
    const event = {
      eventName,
      hostname: data.hostname,
      timestamp: new Date().toISOString(),
      data: data.data,
    };

    // 第二问：入队等待批量上传
    this.eventQueue.push(event);
  }

  startBatchUpload() {
    if (this.timerId) return;

    this.timerId = setInterval(() => {
      if (this.eventQueue.length === 0) return;

      // 取出当前批次事件
      const batch = this.eventQueue;
      this.eventQueue = [];

      // 直接上传
      sendRequest({ events: batch });
    }, this.uploadInterval);
  }
}

const eventLogger = new EventLogger();
export { eventLogger };
