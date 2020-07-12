const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const formmatMessage = require('./utils/messages')
const { userJoin, getCurrentUser, getRoomUsers, userLeave } = require('./utils/users')

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(path.join(__dirname, 'public')))

const botName = 'Admin';

io.on('connection', socket => {
    // console.log('Connected')

    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);
        
        socket.join(user.room)

        socket.emit('message', formmatMessage(botName, 'Welcome'));

        socket.broadcast.to(user.room).emit('message', formmatMessage(botName, `A user ${ username } has connected`, 'connect'))

        let users = getRoomUsers(room);

        io.to(user.room).emit('roomUsersList', users)
    })

    

    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', formmatMessage(user.username, msg, 'msg'))
    })

    socket.on('roomUsers', room => {
        let users = getRoomUsers(room);

        socket.emit('roomUsersList', users)
    })

    socket.on('disconnect', () => {
        userLeave(socket.id)

        io.emit('message', formmatMessage(botName, 'A user has disconnected', 'leave'))
    })
})

server.listen(3000, () => {
    console.log('Server running')
})