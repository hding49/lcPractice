import { sendRequest } from "./utils";

export class EventLogger {
  constructor() {
    // 第一问不需要队列、不需要定时器、不需要串行控制
  }

  logEvent(eventName, data) {
    const event = {
      eventName,
      hostname: data.hostname,
      timestamp: new Date().toISOString(),
      data: data.data,
    };

    // 第一问：直接上传
    sendRequest({ events: [event] });
  }
}

const eventLogger = new EventLogger();
export { eventLogger };
