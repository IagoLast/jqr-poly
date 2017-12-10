const jqrPoly = require('../src/index.js');
const assert = require('assert');


describe('polynomial', () => {
	describe('isZero()', () => {
		it('isZero(1X^2 + 3x^1 + 2x^0) --> false', () => {
			let poly = jqrPoly.create([1, 3, 2]);
			assert.equal(poly.isZero(), false);
		});
		it('isZero(0x^0) --> true', () => {
			let poly = jqrPoly.create([0]);
			assert.equal(poly.isZero(), true);
		});
		it('isZero(0X^2 + 0x^1 + 0x^0) --> true', () => {
			let poly = jqrPoly.create([0, 0, 0]);
			assert.equal(poly.isZero(), true);
		});
	});

	describe('evaluate()', () => {
		it('1X^2 + 1x^0 evaluate(0) --> 1', () => {
			let poly = jqrPoly.create([2, 0, 1]);
			assert.equal(poly.evaluate(0), 1);
		});
		it('1X^2 + 3x^1 + 2x^0 evaluate(0) --> 2', () => {
			let poly = jqrPoly.create([1, 3, 2]);
			assert.equal(poly.evaluate(0), 2);
		});
		it('1X^2 + 0X^1 + 1x^0 evaluate(1) --> 2', () => {
			let poly = jqrPoly.create([1, 0, 1]);
			assert.equal(poly.evaluate(1), 2);
		});
		it('1X^2 + 3x^1 + 2x^0 evaluate(1) --> 6', () => {
			let poly = jqrPoly.create([1, 3, 2]);
			assert.equal(poly.evaluate(1), 6);
		});
		it('1X^2 + 0X^1 + 1x^0 evaluate(2) --> 5', () => {
			let poly = jqrPoly.create([1, 0, 1]);
			assert.equal(poly.evaluate(2), 5);
		});
		it('1X^2 + 3x^1 + 2x^0 evaluate(2) --> 12', () => {
			let poly = jqrPoly.create([1, 3, 2]);
			assert.equal(poly.evaluate(2), 12);
		});
		it('1X^4 + 2X^3 + 2X^2 + 1x^1 + 0x^0 evaluate(2) --> 42', () => {
			let poly = jqrPoly.create([1, 2, 2, 1, 0]);
			assert.equal(poly.evaluate(2), 42);
		});
	});

	describe('multiplyScalar()', () => {
		it('should be called when parameter is a number', () => {
			let called = false;
			let multiplyScalarSpy = () => {
				called = true;
			};
			let poly = jqrPoly.create([1, 2, 2, 1, 0]);
			poly.multiplyScalar = multiplyScalarSpy;
			poly.multiply(0);
			assert(called, 'multiplyScalar() was not called');
		});
		it('should return zero when parameter is zero', () => {
			let poly = jqrPoly.create([1, 0, 2]);
			assert.deepEqual(poly.multiply(0), poly.field.zero());
		});
		it('should return the polynomial when parameter is one', () => {
			let poly = jqrPoly.create([1, 0, 2]);
			assert.deepEqual(poly.multiply(1), poly);
		});

		describe('should return a new polynomial whose each coefficient was multiplied by the scalar', () => {
			it('3 * (0x^2 + 0x^1 + 0x^0) = 0x^2 + 0x^1 + 0x^0', () => {
				let poly = jqrPoly.create([0, 0, 0]);
				assert.deepEqual(poly.multiply(3).getCoefficients(), [0]);
			});
			it('2 * (1x^2 + 0x^1 + 2x^0) = 2x^2 + 0x^1 + 4x^0', () => {
				let poly = jqrPoly.create([1, 0, 2]);
				assert.deepEqual(poly.multiply(2).getCoefficients(), [2, 0, 4]);
			});
			it('2 * (1x^2 +3x^1 + 2x^0) = 2x^2 + 6x^1 + 4x^0', () => {
				let poly = jqrPoly.create([1, 3, 2]);
				assert.deepEqual(poly.multiply(2).getCoefficients(), [2, 6, 4]);
			});
		});
	});

	describe('multiplyPolynomial()', () => {
		it('Should return zero when multiplying by zero', () => {
			let p1 = jqrPoly.create([1, 3, 2]);
			let p2 = jqrPoly.create([0]);
			assert.deepEqual(p1.multiplyPolynomial(p2), p1.field.zero());
		});
		it('(x) * (x+1) = (x^2 + x)', () => {
			let p1 = jqrPoly.create([1, 0]);
			let p2 = jqrPoly.create([1, 1]);
			assert.deepEqual(p1.multiplyPolynomial(p2).getCoefficients(), [1, 1, 0]);
		});
		it('(2x^2 + 1x^1 + 1x^0) * (1x^1 + 1x^0) = 2x^3 + 3x^2 + 2x^1 + 1x^0', () => {
			let p1 = jqrPoly.create([2, 1, 1]);
			let p2 = jqrPoly.create([1, 1]);
			assert.deepEqual(p1.multiplyPolynomial(p2).getCoefficients(), [2, 3, 2, 1]);
		});
	});

	describe('multiplyByMonomial()', () => {
		it('Should return zero when multiplying by zero', () => {
			let p1 = jqrPoly.create([1, 3, 2]);
			assert.deepEqual(p1.multiplyByMonomial(1, 0), p1.field.zero()); // 0x
		});
		it('(x) * (x+1) = (x^2 + x)', () => {
			let p1 = jqrPoly.create([1, 1]);
			assert.deepEqual(p1.multiplyByMonomial(1, 1).getCoefficients(), [1, 1, 0]);
		});
		it('(2x^2 + 1x^1 + 1x^0) * 2x^2 = 4x^4 + 2x^3 + 2x^2', () => {
			let p1 = jqrPoly.create([2, 1, 1]);
			assert.deepEqual(p1.multiplyByMonomial(2, 2).getCoefficients(), [4, 2, 2, 0, 0]);
		});
	});

	describe('add()', () => {
		it('x + x = 2x', () => {
			let p1 = jqrPoly.create([1, 0]);
			let p2 = jqrPoly.create([1, 0]);
			assert.deepEqual(p1.add(p2).getCoefficients(), [2, 0]);
		});
		it('(3x^3) + (x^2 + 1) = 3x^3 + 2x2 + 1', () => {
			let p1 = jqrPoly.create([3, 0, 0, 0]);
			let p2 = jqrPoly.create([1, 0, 1]);
			assert.deepEqual(p1.add(p2).getCoefficients(), [3, 1, 0, 1]);
		});
		it('(3x^3 + x^2) + (x^2 + 1) = 3x^3 + 2x2 + 1', () => {
			let p1 = jqrPoly.create([3, 1, 0, 0]);
			let p2 = jqrPoly.create([1, 0, 1]);
			assert.deepEqual(p1.add(p2).getCoefficients(), [3, 2, 0, 1]);
		});
	});

	describe('sub()', () => {
		it('1x - 1x = 0x', () => {
			let p1 = jqrPoly.create([1, 0]);
			let p2 = jqrPoly.create([1, 0]);
			assert(p1.sub(p2).isZero());
		});
		it('(3x^3) - (x^2 + 1) = 3x^3 - x^2 - 1', () => {
			let p1 = jqrPoly.create([3, 0, 0, 0]);
			let p2 = jqrPoly.create([1, 0, 1]);
			assert.deepEqual(p1.sub(p2).getCoefficients(), [3, -1, 0, -1]);
		});
		it('(3x^3 + x^2) - (x^2 + 1) = 3x^3 + 0x2 - 1', () => {
			let p1 = jqrPoly.create([3, 1, 0, 0]);
			let p2 = jqrPoly.create([1, 0, 1]);
			assert.deepEqual(p1.sub(p2).getCoefficients(), [3, 0, 0, -1]);
		});
	});

	describe('divide()', () => {
		it('(x^2 + x) / (0) -> error', () => {
			let p1 = jqrPoly.create([1, 1, 0]);
			let p2 = jqrPoly.create([0]);
			assert.throws(() => {
				p1.divide(p2);
			});
		});
		it('(x^3 - 2x^2 -4) / (x -3) = (x^2 + x + 3 | 5)', () => {
			let p1 = jqrPoly.create([1, -2, 0, -4]);
			let p2 = jqrPoly.create([1, -3]);
			let [quotient, remainder] = p1.divide(p2);
			assert.deepEqual(quotient.getCoefficients(), [1, 1, 3]);
			assert.deepEqual(remainder.getCoefficients(), [5]);
		});
		it('(x^5 + 2x^3 − x − 8) / (x^2 − 2^x + 1) = (x^3 + 2x^2 + 5^x + 8 | 10x − 16)', () => {
			let p1 = jqrPoly.create([1, 0, 2, 0, -1, -8]);
			let p2 = jqrPoly.create([1, -2, 1]);
			let [quotient, remainder] = p1.divide(p2);
			assert.deepEqual(quotient.getCoefficients(), [1, 2, 5, 8]);
			assert.deepEqual(remainder.getCoefficients(), [10, -16]);
		});
	});
});
