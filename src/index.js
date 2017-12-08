const PolynomialClass = require('./Polynomial');
const defaultField = require('./default');

/**
 * @module jqr-poly
 *
 * @description
 * This module provides the polynomial arithmetics required in the Reed-Solomon decoder
 * used in the QR decoding/encoding process.
 * <br>
 * This is part of a port of the Zxing project, from java to modern and tested javascript.
 */
module.exports = {
	create: create,
	/**
	 * [Polynomial class]{@link Polynomial}.
	 * @example
	 * const Polynomial = require('jqr-poly').Polynomial;
	 * let poly = new Polynomial(coefficients, field); // Not recommended
	 */
	Polynomial: PolynomialClass,
};

/**
 * Factory method to create instances of Polynomials.
 * @param {array} coefficients - An array containing the polynomial coefficients, left is bigger.
 * @param {object} field - The [field]{@link https://en.wikipedia.org/wiki/Field_(mathematics)} used in this polynomial.
 * @example
 * const jqrPoly = require('jqr-poly');
 * let poly = jqrPoly.create(coefficients, field);
 */
function create(coefficients, field) {
	if (!coefficients) {
		throw RangeError('Can\'t create a polynomial without coefficients');
	}
	field = field || defaultField;
	return new PolynomialClass(coefficients, field);
}

defaultField.zero = create([0], defaultField);
