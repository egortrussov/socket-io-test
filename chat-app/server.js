const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const formmatMessage = require('./utils/messages')
const { userJoin, getCurrentUser } = require('./utils/users')

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

        socket.broadcast.to(user.room).emit('message', formmatMessage(botName, `A user ${ username } has connected`))
    })

    

    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);

        socket.to(user.room).emit('message', formmatMessage(user.username, msg))
    })

    socket.on('disconnect', () => {
        io.emit('message', formmatMessage(botName, 'A user has disconnected'))
    })
})

server.listen(3000, () => {
    console.log('Server running')
})