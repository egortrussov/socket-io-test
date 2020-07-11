const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(path.join(__dirname, 'public')))

io.on('connection', socket => {
    console.log('Connected')

    socket.emit('message', 'Welcome');

    socket.broadcast.emit('message', 'A user has connected')

    socket.on('chatMessage', msg => {
        socket.emit('message', msg)
    })

    socket.on('disconnect', () => {
        io.emit('message', 'User has disconnected')
    })
})

server.listen(3000, () => {
    console.log('Server running')
})