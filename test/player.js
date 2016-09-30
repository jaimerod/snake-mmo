var assert = require('chai').assert;
var Player = require('../server/player')();
var Direction = require('../server/direction');

describe('Player', function () {
	describe('die', function () {
		Player.die();

		it('should reset the snake', function () {
			assert.equal(Player.data.length, 1);
		});

		it('should set a respawn timer', function () {
			assert.equal(Player.timeout, 5);
		});
	});

	describe('direction', function () {
		it('should be a value in direction.js', function () {
			for (var nsew in Direction) {
				if (Player.drection === nsew) {
					return true;
				}
			}

			return false;
		});
	});

	describe('getNext', function () {
		var coordinate = Player.getNext();

		it('should have access to a direction', function () {
			assert.isNumber(Player.direction);
		});

		it('should return a coordinate', function () {
			assert.isNumber(coordinate.x);
			assert.isNumber(coordinate.y);
		});

		it('should move up if the direction is up', function () {
			Player.data[0] = {x: 0, y:0};
			var coordinate = Player.getNext(Direction.up);
			assert.equal(coordinate.x, 0);
			assert.equal(coordinate.y, -1);
		});

		it('should move down if the direction is down', function () {
			Player.data[0] = {x: 0, y:0};
			var coordinate = Player.getNext(Direction.down);
			assert.equal(coordinate.x, 0);
			assert.equal(coordinate.y, 1);
		});

		it('should move left if the direction is left', function () {
			Player.data[0] = {x: 0, y:0};
			var coordinate = Player.getNext(Direction.left);
			assert.equal(coordinate.x, -1);
			assert.equal(coordinate.y, 0);
		});

		it('should move right if the direction is right', function () {
			Player.data[0] = {x: 0, y:0};
			var coordinate = Player.getNext(Direction.right);
			assert.equal(coordinate.x, 1);
			assert.equal(coordinate.y, 0);
		});
	});

	describe('init', function () {
		it('should have setup the data array', function () {
			Player.init(10, 10);
			assert.equal(Player.data.length, 1);
			assert.isNumber(Player.data[0].x);
			assert.isNumber(Player.data[0].y);
			assert
		});
	});
});