const os = require('os');
const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const express = require('express');
const { Server } = require('socket.io');
const ytmux = require('ytdl-core-muxer');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// node index /path/to/video
//            ^~~~~~~~~~~~~~
const VIDEO = {
    arg: process.argv[2],
    path: ''
};
const PORT = 53050;
const TEMP_FILE_PATH = path.join(__dirname, 'video.tmp');

app.use(express.static(path.join(__dirname, 'static')));

app.get('/video', (req, res) => {
    res.sendFile(VIDEO.path);
});

io.on('connection', socket => {
    socket.on('play', time => io.emit('play', time));
    socket.on('pause', () => io.emit('pause'));
});

start();
async function start() {
    await checkConstants();
    server.listen(PORT, () => {
        console.log(`You can access this service on this device using the following link:`);
        console.log(`http://localhost:${PORT}/`);
        console.log();
        console.log(`You can access this service on other devices using one of the following links:`);
        for (let ip of getExternalIPs()) console.log(`http://${ip}:${PORT}/`);
    });
}
function exitWithError(error, code = 1) {
    console.error(error);
    process.exit(code);
}

process.stdin.resume();
process.on('exit', handleExit);
process.on('SIGINT', handleExit);
process.on('SIGUSR1', handleExit);
process.on('SIGUSR2', handleExit);
process.on('uncaughtException', handleExit);
function handleExit() {
    if (fs.existsSync(TEMP_FILE_PATH)) fs.unlinkSync(TEMP_FILE_PATH);
    console.log();
    process.exit(0);
}

async function checkConstants() {
    if (VIDEO.arg === undefined) exitWithError('You have to specify a path for the video.');

    if (VIDEO.arg.includes('youtube.com/watch?v=') || VIDEO.arg.includes('youtu.be/')) {
        console.log('Downloading video...');
        try {
            VIDEO.path = await downloadYouTubeVideo(VIDEO.arg);
        } catch (err) {
            exitWithError(`There was an error while downloading the video: ${err}`);
        }
    } else if (VIDEO.arg.startsWith('http://') || VIDEO.arg.startsWith('https://')) {
        console.log('Downloading video...');
        try {
            VIDEO.path = await downloadVideo(VIDEO.arg);
        } catch (err) {
            exitWithError(`There was an error while downloading the video: ${err}`);
        }
    } else {
        if (!fs.existsSync(VIDEO.arg)) exitWithError('You must input an existing file.');
        VIDEO.path = path.resolve(VIDEO.arg);
    }
}
function getTransferProtocol(url) {
    if (url.startsWith('https://')) return https;
    else return http;
}
function downloadVideo(url) {
    return new Promise((resolve, reject) => {
        let path = TEMP_FILE_PATH;
        let stream = fs.createWriteStream(path);
        getTransferProtocol(url).get(url, res => res.pipe(stream));
        stream.on('close', () => resolve(path));
        stream.on('error', err => reject(err));
    });
}
function downloadYouTubeVideo(url) {
    return new Promise((resolve, reject) => {
        let path = TEMP_FILE_PATH;
        let stream = fs.createWriteStream(path);
        ytmux(url).pipe(stream);
        stream.on('close', () => resolve(path));
        stream.on('error', err => reject(err));
    });
}
function getExternalIPs() {
    let res = [];
    let nets = os.networkInterfaces();
    for (let key in nets) for (let net of nets[key]) if (net.family === 'IPv4' && !net.internal) res.push(net.address);
    return res;
}