var Direction = require('./direction.js');

var Player = function () {
  return {
    /**
     * The Players ID
     * @type {Integer}
     */
    id: 0,

    /**
     * The Queue for the snake
     * @type {Array}
     */
    data: [],

    /**
     * The direction the snake is traveling in
     * @type {Integer}
     */
    direction: Direction.up,

    /**
     * The players socket
     * @type {Socket}
     */
    socket: null,

    /**
     * After death, this keeps track of their time to respawn
     * @type {Number}
     */
    timeout: 0,

    /**
     * The player died, let's get ready to respawn
     * @param  {Integer} width  [description]
     * @param  {Integer} height [description]
     */
    die: function (width, height) {
      this.init(width, height);
      this.timeout = 5;
    },

    /**
     * Initialize the Player
     * @param  {Integer} width  The width of the board
     * @param  {Integer} height The height of the board
     */
    init: function (width, height) {
      this.data = [];
      var x = Math.floor(Math.random() * width);
      var y = Math.floor(Math.random() * height);

      if (x < width / 2) {
        this.direction = Direction.right;
      } else {
        this.direction = Direction.left;
      }

      this.data[0] = {'x': x, 'y': y};
    },

    /**
     * Gets the next coordinate based on the direction
     * @return {Object} The next coordinate
     */
    getNext: function (direction) {
      var x, y;

      if (typeof direction === "undefined") {
        direction = this.direction;
      }

      switch (direction) {
        case Direction.up:
          x = this.data[0].x;
          y = this.data[0].y - 1;
          break;
        case Direction.down:
          x = this.data[0].x;
          y = this.data[0].y + 1;
          break;
        case Direction.left:
          x = this.data[0].x - 1;
          y = this.data[0].y;
          break;
        case Direction.right:
          x = this.data[0].x + 1;
          y = this.data[0].y;
          break;
      }

      return {'x': x, 'y': y};
    }
  };
};

module.exports = Player;