var app = require('express')();
var Direction = require('./direction.js');
var game = require('./game.js')();
var http = require('http').Server(app);
var io = require('socket.io')(8080);

// HTTP connection
app.get('/*', function(req, res){
    var uid = req.params.uid,
        path = req.params[0] ? req.params[0] : 'index.html';
    res.sendFile(path, {root: 'public'});
});

// Socket.io connection
http.listen(3000, function(){
  console.log('Listening on port 3000.');
});

// Initlalize the game and start loop
game.init(200, 170, function () {
  setInterval(function () {
    game.loop();
    io.sockets.emit('update', game.board.grid);
  }, 100);
});

 // When there is a connection
io.on('connection', function (socket) {
  // When a player joins, give them an id and the grid
  socket.emit('joined', function () {
    var startObject = {
      id: game.addPlayer(socket),
      grid: game.board.grid
    }

    console.log('Player ' + startObject.id + ' has joined.');

    return startObject;
  }());

  socket.on('disconnect', function () {
    var id = game.removePlayer(this);
    console.log('Player ' + id + ' disconnected');
  });

  socket.on('move-up', function () {
    game.movePlayer(this, Direction.up);
  });

  socket.on('move-down', function () {
    game.movePlayer(this, Direction.down);
  });

  socket.on('move-left', function () {
    game.movePlayer(this, Direction.left);
  });

  socket.on('move-right', function () {
    game.movePlayer(this, Direction.right);
  });
});