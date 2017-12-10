const utils = require('./utils');

/**
 * Represents a Polynomial. Polynomials should be created using a factory method.
 * @example
 * // Example 1: Summing x + x
 *
 * // Create first polynomial using the factory.
 * let p1 = pFactory.createClass([1, 0]);
 * // Create another polynomial.
 * let p2 = pFactory.createClass([1, 0]);
 * // Sum both polynomials
 * let sum = p1.add(p2);
 * // Get the coefficients from the sum.
 * let coefficients = sum.getCoefficients();
 * // Check everything went ok
 * assert.deepEqual(coefficients, [2, 0]);
 */
class Polynomial {

	/**
	 * Init the polynomial, this method should not be used, use {@link PolynomialFactory} instead.
	 * @param {array} coefficients - An array containing the polynomial coefficients, left is bigger.
	 * @param {object} field - The [field]{@link https://en.wikipedia.org/wiki/Field_(mathematics)} used in this polynomial.
	 */
	constructor(coefficients, field) {
		this.field = field;
		this.coefficients = utils.calculateCoefficents(coefficients);
		this.degree = this.coefficients.length - 1;
		return this;
	}

	/**
   * Build a monomial.
   * A monomial is, roughly speaking, a polynomial which has only one term.
   * @param {number} degree - The degree of the  monomial term.
   * @param {number} coefficient - The coefficient of the monomial term.
   * @param {object} field - The monomial's' [field]{@link https://en.wikipedia.org/wiki/Field_(mathematics)}.
   */
	static buildMonomial(degree, coefficient, field) {
		field = field || this.field;
		if (degree < 0) {
			throw new RangeError('Monomial degree can\'t be lower than zero');
		}
		if (coefficient === 0) {
			return this.field.zero;
		}
		let coefficients = utils.newZerosArray(degree + 1);
		coefficients[0] = coefficient;
		return _createPolynomial(coefficients, field);
	}

	/**
   * Build a monomial.
   * A monomial is, roughly speaking, a polynomial which has only one term.
   * @param {number} degree - The degree of the  monomial term.
   * @param {number} coefficient - The coefficient of the monomial term.
   * @param {object} field - The monomial's' [field]{@link https://en.wikipedia.org/wiki/Field_(mathematics)}.
   */
	buildMonomial(degree, coefficient, field) {
		return Polynomial.buildMonomial(degree, coefficient, field);
	}

	/**
	 * Return the degree of the polynomial.
	 */
	getDegree() {
		return this.degree;
	}

	/**
	 * Return the coefficients array of the polynomial.
	 */
	getCoefficients() {
		return this.coefficients;
	}

	/**
	 * Return the coefficient with the given degree of the polynomial.
	 * @param {number} degree - The degree of the desired coefficient.
	 */
	getCoefficient(degree) {
		return this.coefficients[this.coefficients.length - 1 - degree];
	}

	/**
	 * Check if a polynomial is zero.
	 * Notice that a polynomial is zero when all the coefficients are zero.
	 */
	isZero() {
		return this.coefficients.every(coefficient => coefficient === 0);
	}

	/**
	 * Evaluate the a polynomial at a point x using [Horner's method]{@link https://en.wikipedia.org/wiki/Horner's_method}.
	 *
	 * @param {number} x - The point where the polynomial is going to be evaluated.
	 */
	evaluate(x) {
		if (x === 0) {
			return this.getCoefficient(0);
		}
		if (x === 1) {
			return this.coefficients.reduce((acum, coefficient) => this.field.add(acum, coefficient), 0);
		}
		return this.coefficients.reduce((acum, coefficient) => this.field.add(this.field.mul(acum, x), coefficient), 0);
	}

	/**
	 * Multiply two polynomials or a polynomial and a scalar.
	 * @param {object} other - The other polynomial to multiply.
	 */
	multiply(other) {
		return (typeof other == 'number') ? this.multiplyScalar(other) : this.multiplyPolynomial(other);
	}

	/**
	 * Multiply a polynomial and a scalar.
	 * @param {number} scalar - The scalar to multiply.
	 */
	multiplyScalar(scalar) {
		if (scalar === 0) {
			return this.field.zero();
		}
		if (scalar === 1) {
			return this;
		}
		return _createPolynomial(this.coefficients.map(coefficient => this.field.mul(coefficient, scalar)), this.field);
	}

	/**
	 * Multiply two polynomials.
	 * This method runs a O(n^2) algorithm, maybe fast Fourier transform (FFT) can be used instead.
	 * @param {object} polynomial - The polynomial to multiply.
	 */
	multiplyPolynomial(polynomial) {
		if (this.isZero() || polynomial.isZero()) {
			return this.field.zero();
		}

		let newCoefficients = utils.newZerosArray(this.coefficients.length + polynomial.coefficients.length - 1);

		for (let i = 0; i < this.coefficients.length; i++) {
			for (let j = 0; j < polynomial.coefficients.length; j++) {
				let p1 = newCoefficients[i + j];
				let p2 = this.field.mul(this.coefficients[i], polynomial.coefficients[j]);
				newCoefficients[i + j] = this.field.add(p1, p2);
			}
		}

		return _createPolynomial(newCoefficients, this.field);
	}

	/**
	 * Multiply a polynomial by a monomial.
	 * This method builds the monomial "on the fly" so only the degree and the coefficients
	 * the field is assumed to be the same.
	 * of the monomial are required.
	 * @param {number} degree - The degree of the  monomial term.
	 * @param {number} coefficient - The coefficient of the monomial term.
	 */
	multiplyByMonomial(degree, coefficientParm) {
		if (degree < 0) {
			throw new RangeError('Monomial degree can\'t be lower than zero');
		}

		if (coefficientParm === 0) {
			return this.field.zero();
		}

		let newCoefficients = utils.newZerosArray(this.coefficients.length + degree);
		this.coefficients.forEach((element, i) => {
			newCoefficients[i] = this.field.mul(element, coefficientParm);
		});
		return _createPolynomial(newCoefficients, this.field);
	}

	/**
	 * Sum a polynomial
	 * of the monomial are required.
	 * @param {object} poly - Other polynomial to add.
	 */
	add(poly) {
		let smallerPoly = this;
		let higherPoly = poly;

		// Check which polynomial has lower degree
		if (this.getDegree() > poly.getDegree()) {
			smallerPoly = poly;
			higherPoly = this;
		}

		// Set same size in coefficients
		let diff = higherPoly.getDegree() - smallerPoly.getDegree();
		let tmpCoefficients = utils.newZerosArray(diff).concat(smallerPoly.coefficients);

		// Sum coefficient by coefficient.
		let newCoefficients = utils.newZerosArray(higherPoly.coefficients.length);
		for (var i = 0; i < tmpCoefficients.length; i++) {
			newCoefficients[i] = this.field.add(tmpCoefficients[i], higherPoly.coefficients[i]);
		}

		return _createPolynomial(newCoefficients, this.field);
	}

	/**
	 * Polynomial substraction.
	 * @param {object} poly - Other polynomial to substract.
	 */
	sub(other) {
		let newDegree = Math.max(this.getDegree(), other.getDegree()) + 1;

		let a = utils.newZerosArray(newDegree);
		let b = utils.newZerosArray(newDegree);
		let result = utils.newZerosArray(newDegree);


		let offset = newDegree - this.coefficients.length;
		for (let i = 0; i < this.coefficients.length; i++) {
			a[offset + i] = this.coefficients[i];
		}

		offset = newDegree - other.coefficients.length;
		for (let i = 0; i < other.coefficients.length; i++) {
			b[offset + i] = other.coefficients[i];
		}

		for (var i = 0; i < result.length; i++) {
			result[i] = this.field.sub(a[i], b[i]);
		}

		return _createPolynomial(result, this.field);
	}

	/**
	 * Polynomial division.
	 * Note: The algorithm is explained [here]{@link https://en.wikipedia.org/wiki/Polynomial_long_division}.
	 * @param {object} poly - Other polynomial to substract.
	 */
	divide(other) {
		if (this.field != other.field) {
			throw 'GF256Polys do not have same GF256 field';
		}
		if (other.isZero()) {
			throw 'Divide by 0';
		}

		var quotient = this.field.zero();
		var remainder = this;

		while (!remainder.isZero() && (remainder.getDegree() >= other.getDegree())) {
			let termLiteral = remainder.getDegree() - other.getDegree();
			let termCoeff = this.field.div(remainder.getCoefficient(remainder.getDegree()), other.getCoefficient(other.getDegree()));
			let term = this.buildMonomial(termLiteral, termCoeff, this.field);
			quotient = quotient.add(term);
			remainder = remainder.sub(term.multiply(other));
		}
		return [quotient, remainder];
	}
}

function _createPolynomial(coefficients, field) {
	return new Polynomial(coefficients, field);
}

module.exports = Polynomial;
