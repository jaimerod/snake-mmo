var Board = require('./board.js');
var Direction = require('./direction.js');
var Player = require('./player.js');
var Symbols = require('./symbols.js');

var Game = function () {
  return {
    /**
     * The game board
     * @type {Board}
     */
    board: new Board(),

    /**
     * The next available PlayerId
     * @type {Number}
     */
    nextId: 0,

    /**
     * The Players
     * @type {Object}
     */
    players: {},

    /**
     * Randomly add a cherry to the board
     */
    addCherry: function () {
      var x = Math.floor(Math.random() * this.board.width);
      var y = Math.floor(Math.random() * this.board.height);
      this.board.setSymbol(x, y, Symbols.cherry);
    },

    /**
     * Adds a new player to the game
     * @param {Socket} socket The players socket
     */
    addPlayer: function (socket) {
      var newPlayer = new Player();
      newPlayer.id = this.nextId++;
      newPlayer.socket = socket;
      newPlayer.init(this.board.width, this.board.height);
      this.board.setSymbol(newPlayer.data[0].x, newPlayer.data[0].y, newPlayer.id);
      this.players[socket.conn.id] = newPlayer;
      return newPlayer.id;
    },

    /**
     * Removes a player from the game
     * @param  {Socket} socket The players socket
     * @return {string}        The socket id that was removed
     */
    removePlayer: function (socket) {
      var id = this.players[socket.conn.id].id;

      this.board.reset(this.players[socket.conn.id].data);
      delete this.players[socket.conn.id];

      return id;
    },

    /**
     * Changes the players direction
     * @param  {Socket} socket     The players socket
     * @param  {Integer} direction The direction the player is now moving
     */
    movePlayer: function (socket, direction) {
      this.players[socket.conn.id].direction = direction;
    },

    /**
     * Starts the game loop
     * @param  {Integer} width  The width of the game
     * @param  {Integer} height The height of the game
     */
    init: function (width, height, cb) {
      this.board.init(width, height);

      // Add a bunch of cherries
      for (i = 0; i < this.board.width; i++) {
        var x = Math.floor(Math.random() * this.board.width);
        var y = Math.floor(Math.random() * this.board.height);
        this.board.setSymbol(x, y, Symbols.cherry);
      }

      if (typeof cb === "function") cb();
    },

    loop: function () {
      var player,
        id,
        nextCell,
        lastCell;

      for (id in this.players) {
        player = this.players[id];
        nextCell = player.getNext();

        // If they are still respawning, then do nothing
        if (player.timeout > 0) {
          player.timeout--;
          continue;
        }

        // Die if we are out of bounds
        if (nextCell.y < 0 || nextCell.y > this.board.height - 1 || nextCell.x < 0 || nextCell.x > this.board.width - 1) {
          this.board.reset(player.data);
          player.die(this.board.width, this.board.height);
          continue;
        }

        // Do something depending on what the next cell is
        switch (this.board.getSymbol(nextCell.x, nextCell.y)) {
          case Symbols.cherry:
            // move to the next cell
            this.board.setSymbol(nextCell.x, nextCell.y, player.id);
            // add next cell to the player (should have one more now)
            player.data.unshift(nextCell);
            // cherry is gone, so put another one
            this.addCherry();
            break;
          case Symbols.empty:
            // move to the next cell
            this.board.setSymbol(nextCell.x, nextCell.y, player.id);
            // remove the last piece
            lastCell = player.data.pop();
            // add one to the beginning
            player.data.unshift(nextCell);
            // empty the lastCell
            this.board.setSymbol(lastCell.x, lastCell.y, Symbols.empty);
            break;
          default:
            // Oops, we hit another player so we are dead
            this.board.reset(player.data);
            player.die(this.board.width, this.board.height);
        }
      }
    }
  };
};

module.exports = Game;