module.exports = {
	name: 'length',
	validate(validatorArgs, propertyValue) {
		if (propertyValue.length === undefined) return 'notValid';
		const { min, max, equal } = validatorArgs;
		if (equal !== undefined && propertyValue.length !== equal)
			return 'wrongLength';
		if (min !== undefined && propertyValue.length < min) return 'tooShort';
		if (max !== undefined && propertyValue.length > max) return 'tooLong';
	},
	message: {
		notValid: 'is not valid',
		wrongLength: 'is the wrong length (should be ${equal} characters)',
		tooLong: 'is too long (maximum is ${max} characters)',
		tooShort: 'is too short (minimum is ${min} characters)',
	},
	shorthand: {
		integer: (equal) => ({ equal }),
		array: ([min, max]) => ({ min, max }),
	},
	arguments: {
		min: {
			type: 'integer'
		},
		max: {
			type: 'integer'
		},
		equal: {
			type: 'integer'
		},
	}
};
