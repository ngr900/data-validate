module.exports = {
	name: 'inclusion',
	validate(validatorArgs, propertyValue) {
    const allowedValues = validatorArgs.values;
    if (!allowedValues.includes(propertyValue)) {
      return 'notIncluded'
    }
	},
	message: {
		notIncluded: 'must be one of ${values}',
	},
	shorthand: {
		array: values => ({ values }),
	},
	arguments: {
		values: {
			type: 'array'
		}
  }
};
