var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/html/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
      console.log('a user disconnected')
  })

  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    io.emit('chat newMessage', {
      ...msg,
      type: 'message'
    })
  });

  socket.on('chat login', (username) => {
    io.emit('chat newMessage', {
      username,
      type: 'login'
    })
  })

  socket.on('user timer', () => {
    let seconds = 0;
    setInterval(() => {
      socket.emit('timer', seconds);
      seconds++;
    }, 1000)
  })
});


http.listen(5000, () => {
  console.log('listening on *:5000');
});