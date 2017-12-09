/**
 * Default arimetic field
 */
module.exports = {
	add: (a, b) => a + b,
	sub: (a, b) => a - b,
	mul: (a, b) => a * b,
	div: (a, b) => a / b,
	inv: a => (1 / a),
	log: a => Math.log(a),
};
