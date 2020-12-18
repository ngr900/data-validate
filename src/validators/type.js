module.exports = {
	validate(validatorArgs, propertyExists, propertyValue) {
		if (!propertyExists) return;
		const expectedType = (validatorArgs.type || validatorArgs) + '';
	},
	message: {
		notValid: 'is not valid',
		wrongLength: 'is the wrong length (should be ${equal} characters)',
		tooLong: 'is too long (maximum is ${max} characters)',
		tooShort: 'is too short (minimum is ${min} characters)',
	},
};