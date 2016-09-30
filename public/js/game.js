var game = (function () {
      var canvas;
      var ctx;
      var height;
      var width;

      // Capture arrow keys
      document.onkeydown = function(e) {
        e = e || window.event;
        switch(e.which || e.keyCode) {
              case 37:
                socket.emit("move-left");
                break;
              case 38:
                socket.emit("move-up");
                break;
              case 39:
                socket.emit("move-right");
                break;
              case 40:
                socket.emit("move-down");
                break;
              default: return;
          }
          e.preventDefault();
      };

      return {
        /**
         * Our Players ID
         * @type {Number}
         */
        id: null,

        /**
         * The grid of tiles
         * @type {Array}
         */
        grid: [],

        /**
         * Setups the game
         * @return void
         */
        start: function () {
          canvas = document.createElement("canvas");
          width = this.grid.length;
          height = this.grid[0].length;
          canvas.width = width * 5;
          canvas.height = height * 5;
          ctx = canvas.getContext('2d');
          document.body.appendChild(canvas);
        },

        /**
         * Iterates through the game
         * @return void
         */
        tick: function () {
          if (this.id == null) return;

          var tileWidth = canvas.width / width;
          var tileHeight = canvas.height / height;

          for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {
              switch (this.grid[x][y]) {
                case -1: // empty
                  ctx.fillStyle = " #fff";
                  break;
                case -2: // cherry
                  ctx.fillStyle = "#faa";
                  break;
                case this.id: // me
                  ctx.fillStyle = "#050";
                  break;
                default: // other people
                  ctx.fillStyle = "#aaf";
                  break;
              }

              // Place the tile
              ctx.fillRect (x * tileWidth, y * tileHeight, tileWidth, tileHeight);
            }
          }
        }
      }
    }());

    // Connect to the game server
    socket = io.connect( "http://localhost:8080");

    // Get our id
    socket.on('joined', function (start) {
      game.id = start.id;
      game.grid = start.grid;
      game.start();
    });

    // We receive updates of the grid here
    socket.on('update', function (grid) {
      game.grid = grid;
      game.tick();
    });