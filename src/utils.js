function newZerosArray(length) {
	let array = new Array(length);
	for (let i = 0; i < array.length; i++) {
		array[i] = 0;
	}
	return array;
}

function calculateCoefficents(coefficientsArray) {
	let firstNonZero = coefficientsArray.findIndex(coefficient => coefficient !== 0);
	return coefficientsArray.slice(firstNonZero, coefficientsArray.length);
}

module.exports = {
	newZerosArray: newZerosArray,
	calculateCoefficents: calculateCoefficents,
};
