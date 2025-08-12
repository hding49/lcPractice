// TODO: Implement for Part 1
// Goal:
// When clicking on the colored square, we should send
// the following payload through network request:
// {
//   "events": [{
//     "eventName": "click",
//     "hostname": "1ic4u.csb.app", // Hostname of the current page
//     "timestamp": "2021-04-06T00:33:42.304Z", // Current UTC time in ISOString format
//     "data": {
//        "color": "rgb(255, 80, 0)" // Background color of the square
//     }
//   }]
// }

import { eventLogger } from "./eventLogger";

// ------------------ Part 1 ------------------
// 给页面所有 .square 方块绑定点击事件，点击时调用 eventLogger.logEvent
function setupClickListeners() {
  const squares = document.querySelectorAll(".square");

  squares.forEach((square) => {
    square.addEventListener("click", () => {
      const eventPayload = {
        hostname: window.location.hostname,
        data: {
          color: square.style.backgroundColor,
        },
      };
      eventLogger.logEvent("click", eventPayload);
    });
  });
}

setupClickListeners();
