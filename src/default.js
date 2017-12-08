/**
 * Default arimetic field
 */
module.exports = {
	add: (a, b) => a + b,
	sub: (a, b) => a - b,
	multiply: (a, b) => a * b,
	divide: (a, b) => a / b,
	inverse: a => (1 / a),
	log: a => Math.log(a),
};
