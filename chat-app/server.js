const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const formmatMessage = require('./utils/messages')
const { userJoin, getCurrentUser, getRoomUsers, userLeave, getUsersNum } = require('./utils/users')

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(path.join(__dirname, 'public')))

const botName = 'Admin';

const commands = ['allUsers', 'globalMessage'];

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

        if (msg.trim() === '/commands') {
            let message = 'Here are all the commands: <br>';

            commands.forEach(command => message += '/command ' + command + '<br>');
            
            socket.emit('message', formmatMessage(botName, message, 'admin'));
            
            return;
        }

        if (msg[0] === '/') {
            let words = msg.split(' ');

            if (words[1] === 'allUsers') {
                let message = `There are ${ getUsersNum() } users online`;
                
                socket.emit('message', formmatMessage(botName, message, 'admin'));
            }

            if (words[1] === 'globalMessage') {
                let message = `${ user.username } says: "`;

                for (let i = 2; i < words.length; i++) {
                    message += words[i] + ' ';
                }

                message += '"';
                
                io.emit('message', formmatMessage(botName, message, 'global'));
            }
 
            return;
        }

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