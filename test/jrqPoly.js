const assert = require('assert');
const jqrPoly = require('../src/jqrPoly.js');

describe('jqrPoly', () => {
	describe('create()', () => {
		it('should be defined', () => {
			assert(jqrPoly.create !== undefined);
		});
		it('should return an error when called with no coefficients', () => {
			assert.throws(() => {
				jqrPoly.create();
			});
		});
	});
	describe('Polynomial', () => {
		let Polynomial = jqrPoly.Polynomial;
		it('should be defined', () => {
			assert(Polynomial !== undefined);
		});
		it('should return a new Polynomial', () => {
			let poly = new Polynomial([1, 0]);
			assert(poly instanceof Polynomial);
			assert.deepEqual(poly.getCoefficients(), [1, 0]);
		});
		it('should\'n be called without new', () => {
			let Polynomial = jqrPoly.Polynomial;
			assert.throws(() => {
				Polynomial([1, 0]);
			});
		});
	});
});
