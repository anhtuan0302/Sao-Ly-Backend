const express = require("express");
const axios = require("axios");
const schedule = require("node-schedule");
const router = express.Router();
require("dotenv").config();

// Function to send message
function sendMessage(sender_psid, messageText) {
  const messageData = {
      recipient: {
          id: sender_psid
      },
      message: {
          text: messageText
      },
      messaging_type: "MESSAGE_TAG",
      tag: "CONFIRMED_EVENT_UPDATE"
  };

  axios.post(`https://graph.facebook.com/v20.0/me/messages`, messageData, {
      headers: { 'Content-Type': 'application/json' },
      params: {
          access_token: process.env.FACEBOOK_PAGE_ACCESS_TOKEN
      }
  }).then(response => {
      console.log('Message sent successfully:', response.data);
  }).catch(error => {
      console.error('Failed to send message:', error.response.data);
  });
}

// Array of PSIDs
const psids = [
  "26557398710525202", //Vũ Trọng Hùng
  //"26210567721892282", //Trần Nguyễn Tâm Trang
  //"7922816257793860", //Trịnh Phương Hoà
  //"26125709830377890", //Nguyễn Linh Chi
  "26700953616184981", //Nguyễn Phương Mai
  "7995576590523177", //Đoàn Minh Quang
  "7561767890594802", //Ngô Anh Tuấn
  "8443591832341965", //Trịnh Phượng
];

schedule.scheduleJob('0 12 * * *', function() {
    console.log('Sending daily reminders...');
    psids.forEach(psid => {
        sendMessage(psid, 'Đừng quên ăn trưa nhé!');
    });
});

schedule.scheduleJob("0 15 * * *", function () {
  console.log("Sending daily reminders...");
  sendMessage("26557398710525202", "Nhắc nhở: Dọn vệ sinh phòng Marketing ngày 01/08/2024");
});

schedule.scheduleJob("30 17 * * *", function () {
    console.log("Sending daily reminders...");
    sendMessage("26557398710525202", "Nhắc nhở: Dọn vệ sinh phòng Marketing ngày 01/08/2024");
});

// schedule.scheduleJob("30 19 * * *", function () {
//     console.log("Sending daily reminders...");
//     sendMessage("26557398710525202", "Chấm công ngày 30/07/2024\nCheck-in: 09:18\nCheck-out: 17:54");
//     sendMessage("26210567721892282", "Chấm công ngày 30/07/2024\nCheck-in: 09:16\nCheck-out: 17:56");
//     sendMessage("7922816257793860", "Chấm công ngày 30/07/2024\nCheck-in: 09:00\nCheck-out: 18:20");
//     sendMessage("26125709830377890", "Chấm công ngày 30/07/2024\nCheck-in: 09:00\nCheck-out: 18:20");
//     sendMessage("26700953616184981", "Chấm công ngày 30/07/2024\nCheck-in: 09:06\nCheck-out: 18:21");
//     sendMessage("7995576590523177", "Chấm công ngày 30/07/2024\nCheck-in: 09:00\nCheck-out: 18:20");
//     sendMessage("7561767890594802", "Chấm công ngày 30/07/2024\nCheck-in: 07:21\nCheck-out: 19:14");
//     sendMessage("8443591832341965", "Chấm công ngày 30/07/2024\nCheck-in: 09:29\nCheck-out: 18:02");
//     sendMessage("8443591832341965", "Danh sách chấm công 30/07/2024\nVũ Trọng Hùng: 09:18 - 17:54\nTrần Nguyễn Tâm Trang: 09:16 - 17:56\nTrịnh Phương Hoà: 09:00 - 18:20\nNguyễn Linh Chi: 09:00 - 18:20\nNguyễn Phương Mai: 09:06 - 18:21\nNgô Anh Tuấn: 07:21 - 19:14\nTrịnh Phượng: 09:29 - 18:02");
// });

module.exports = router;
