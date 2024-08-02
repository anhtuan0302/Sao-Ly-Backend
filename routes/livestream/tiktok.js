// const { bootstrap } = require('global-agent');

// // Set up environment variable for global proxy
// process.env.GLOBAL_AGENT_HTTP_PROXY = 'http://35.247.130.215:3128';
// bootstrap();

const express = require("express");
const router = express.Router();
const { WebcastPushConnection } = require('tiktok-live-connector');

let tiktokUsername = "quyenleodaily";
let tiktokLiveConnection = new WebcastPushConnection(tiktokUsername);

tiktokLiveConnection.connect().then(state => {
    console.info(`Connected to roomId ${state.roomId}`);
}).catch(err => {
    console.error('Failed to connect', err);
});

tiktokLiveConnection.on('chat', data => {
    console.log(data);
    const time = new Date(parseInt(data.createTime)).toLocaleTimeString('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });    
    console.log(`${data.nickname} (${data.uniqueId} userId:${data.userId}) writes at ${time}: ${data.comment}`);
});

tiktokLiveConnection.on('gift', data => {
    const time = new Date(parseInt(data.timestamp)).toLocaleString();
    console.log(`${data.nickname} (${data.uniqueId} userId:${data.userId}) sends gift at ${time}: ${data.giftId}`);
});

module.exports = router;