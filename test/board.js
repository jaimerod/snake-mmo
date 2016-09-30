var assert = require('chai').assert;
var Board = require('../server/board')();
var Symbols = require('../server/symbols');

describe('Board', function () {
	describe('init', function () {
		it('should initialize the grid', function () {
			assert.equal(Board.grid.length, 0);
			Board.init(5, 10);
			assert.equal(Board.grid.length, 5);
			assert.equal(Board.grid[0].length, 10);
			assert.equal(Board.height, 10);
			assert.equal(Board.width, 5);
		});
	});

	describe('setSymbol', function () {
		it('should set a value to a coordinate', function () {
			Board.setSymbol(1,1,1);
			assert.equal(Board.grid[1][1], 1);
		});
	});

	describe('getSymbol', function () {
		it('should get a value at a coordinate', function () {
			Board.grid[1][1] = 1;
			assert.equal(Board.getSymbol(1, 1), 1);
		});
	});

	describe('reset', function () {
		it('should reset to empty coordinates given in an array', function () {
			var reset = [
				{x: 1, y: 1},
				{x: 2, y: 2},
				{x: 3, y: 3}
			];

			Board.grid = [];
			Board.grid.push([Symbols.empty, Symbols.empty, Symbols.empty, Symbols.empty, Symbols.empty]);
			Board.grid.push([Symbols.empty, 1, Symbols.empty, Symbols.empty, Symbols.empty]);
			Board.grid.push([Symbols.empty, Symbols.empty, 1, Symbols.empty, Symbols.empty]);
			Board.grid.push([Symbols.empty, Symbols.empty, Symbols.empty, 1, Symbols.empty]);
			Board.grid.push([Symbols.empty, Symbols.empty, Symbols.empty, Symbols.empty, Symbols.empty]);

			Board.reset(reset);

			assert.equal(Board.grid[1][1], Symbols.empty);
			assert.equal(Board.grid[2][2], Symbols.empty);
			assert.equal(Board.grid[3][3], Symbols.empty);

		});

	});
});