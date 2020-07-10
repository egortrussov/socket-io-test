var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

// const app = express();

app.get('/', (req, res) => {
  res.json({
    msg: 'hello'
  })
})

// const httpServer = http.createServer(app);

// const io = socketIO(httpServer);

io.on('conection', (socket) => {

})

http.listen(5000, () => {
  console.log('Server running on PORT 5000')
})