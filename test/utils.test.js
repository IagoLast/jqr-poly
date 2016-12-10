const assert = require('assert');
const utils = require('../src/utils.js');

describe('utils', () => {
	let calculateCoefficents = utils.calculateCoefficents;
	describe('calculateCoefficents()', () => {
		it('0x^0  -->  [0]', () => {
			assert.deepEqual(calculateCoefficents([0]), [0]);
		});
		it('0x^2 +0x^1 + 0x^0  -->  [0]', () => {
			assert.deepEqual(calculateCoefficents([0, 0, 0]), [0]);
		});
		it('3x^2 +0x^1 + 1x^0  -->  [3,0,1]', () => {
			assert.deepEqual(calculateCoefficents([3, 0, 1]), [3, 0, 1]);
		});
		it('2x^2 +1x^1 + 0x^0  -->  [2 1 0]', () => {
			assert.deepEqual(calculateCoefficents([2, 1, 0]), [2, 1, 0]);
		});
		it('2x^2 +0x^1 + 0x^0  -->  [2 0 0]', () => {
			assert.deepEqual(calculateCoefficents([2, 0, 0]), [2, 0, 0]);
		});
		it('0x^2 +1x^1 + 0x^0  -->  [0 1 0]', () => {
			assert.deepEqual(calculateCoefficents([0, 1, 0]), [1, 0]);
		});
	});
});
