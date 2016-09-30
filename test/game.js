var assert = require('chai').assert;
var Direction = require('../server/direction');
var Game = require('../server/game')();
var Symbols = require('../server/symbols');

var Socket = {
	conn: {
		id: 'mock'
	}
};

describe("Game", function () {
	/*before(function () {
		Game.board.init(5, 5);
	});*/

	describe("init", function () {
		it("should initialize the board", function () {
			Game.init(5, 5);
			assert.equal(Game.board.width, 5);
			assert.equal(Game.board.height, 5);
		});

		it("should run the callback", function () {
			var ran = false;

			var callback = function () {
				ran = true;
				assert.equal(ran, true);
			}

			Game.init(5,5, callback);
		});
	});

	describe("addCherry", function () {
		it("should add a cherry", function () {
			var found = false;

			Game.addCherry(5, 5);

			for (var i = 0; i < Game.board.height; i++) {
				for (var j = 0; j < Game.board.width; j++) {
					if (Game.board.grid[i][j] == Symbols.cherry) {
						found = true;
						break;
					}
				}
			}

			assert.equal(found, true);
		});
	});

	describe("addPlayer", function () {
		it("should add a player", function () {
			Game.addPlayer(Socket);
			assert.equal(typeof Game.players[Socket.conn.id], "object");
		});
	})

	describe("removePlayer", function () {
		it("should add and remove players", function () {
			Game.removePlayer(Socket);
			assert.equal(typeof Game.players[Socket.conn.id], "undefined");
		});
	});

	describe("movePlayer", function () {
		it("should change a players direction", function () {
			Game.addPlayer(Socket);
			Game.movePlayer(Socket, Direction.down);
			assert.equal(Game.players[Socket.conn.id].direction, Direction.down);
		});
	});

	describe("loop", function () {
		beforeEach(function () {
			Game.init(5, 5);
			Game.addPlayer(Socket);
		});

		it("should skip a player if they are on timeout", function () {
			Game.players[Socket.conn.id].timeout = 1;
			Game.loop();
		});

		it("should advance players based on their direction", function () {
			Game.players[Socket.conn.id].data[0] = {x: 0, y: 1};
			Game.players[Socket.conn.id].direction = Direction.up;
			Game.loop();
			assert.equal(Game.players[Socket.conn.id].data[0].y, 0);
		});

		it("should lengthen player if they ate a cherry", function () {
			Game.players[Socket.conn.id].data[0] = {x: 1, y: 1};
			Game.players[Socket.conn.id].direction = Direction.up;
			Game.board.setSymbol(1, 0, Symbols.cherry);
			Game.loop();
			assert.equal(Game.players[Socket.conn.id].data.length, 2);
		});

		it("should kill an out of bounds player", function () {
			Game.players[Socket.conn.id].data[0] = {x: 2, y: 0};
			Game.players[Socket.conn.id].direction = Direction.up;
			Game.loop();
			assert.equal(Game.players[Socket.conn.id].timeout, 5);
		});

		it("should kill a player who crashes", function () {
			Game.players[Socket.conn.id].data[0] = {x: 3, y: 1};
			Game.players[Socket.conn.id].direction = Direction.up;
			Game.board.setSymbol(3, 0, 2);
			Game.loop();
			assert.equal(Game.players[Socket.conn.id].timeout, 5);
		});
	});
});