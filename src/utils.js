function newZerosArray(length) {
	return new Array(length).fill(0);
}

function calculateCoefficents(coefficientsArray) {
	let firstNonZero = coefficientsArray.findIndex(coefficient => coefficient !== 0);
	return coefficientsArray.slice(firstNonZero, coefficientsArray.length);
}

module.exports = {
	newZerosArray: newZerosArray,
	calculateCoefficents: calculateCoefficents,
};
