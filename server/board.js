var Symbols = require('./symbols.js');

var Board = function () {
  return {
    /**
     * A grid representing tiles for the game
     * @type {Array}
     */
    grid: [],

    /**
     * The height of the grid
     * @type {Integer}
     */
    height: 0,

    /**
     * The width of the grid
     * @type {Integer}
     */
    width: 0,

    /**
     * Initialize the board
     * @param  {Integer} width  The width of the board
     * @param  {Integer} height The height of the board
     */
    init: function (width, height) {
      var x, y;

      this.height = height;
      this.width = width;

      for (x = 0; x < width; x++) {
        this.grid.push([]);
        for (y = 0; y < height; y++) {
          this.grid[x][y] = Symbols.empty;
        }
      }
    },

    /**
     * Sets a value to an (x,y) coordinate
     * @param {Integer} x      The x coordinate
     * @param {Integer} y      The y coordinate
     * @param {Integer} symbol The value to store at {x,y}
     */
    setSymbol: function (x, y, symbol) {
      this.grid[x][y] = symbol;
    },

    /**
     * Gets the value stored at (x,y)
     * @param  {Integer} x The x coordinate
     * @param  {Integer} y The y coordinate
     */
    getSymbol: function (x, y) {
      return this.grid[x][y];
    },

    /**
     * Resets an array of coordinates back to Symbols.empty
     * @param  {Array} arr An array of {x,y} coordinates
     */
    reset: function (arr) {
      var i;

      for (i = 0; i < arr.length; i++) {
        this.setSymbol(arr[i].x, arr[i].y, Symbols.empty);
      }
    }
  };
};

module.exports = Board;