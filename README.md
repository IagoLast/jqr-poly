# jqr-poly

Polynomial arithmetics in node

## Install

	npm install jqr-poly

## Usage

See the full docs [here](https://iagolast.github.io/jqr-poly/Polynomial.html)

#### Create a Polynomial

```javascript
const jqrPoly = require('jqr-poly');
// 2x^2 + 1
let coefficients = [2, 0, 1];
let poly = jqrPoly.create(coefficients);
```

#### Add two Polynomials

```javascript
const jqrPoly = require('jqr-poly');
// Create p1 & p2
let p1 = jqrPoly.create([1, 0]);
let p2 = jqrPoly.create([1, 0]);
// Add p1 + p2
p1.add(p2)
```


