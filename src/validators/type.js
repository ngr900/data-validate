const typeMap = {
	...require('@ngr900/type-check').map,
	date: (value) => value instanceof Date,
};

module.exports = {
	name: 'type',
	validate(validatorArgs, propertyValue) {
		const expectedType = validatorArgs.type;
		const isExpectedType = typeMap[expectedType](propertyValue) === true;
		if (!isExpectedType) return 'wrongType'
	},
	message: {
		wrongType: 'is of the wrong type (should be ${type})'
	},
	shorthand: {
		string: (type) => ({ type }),
	},
};
