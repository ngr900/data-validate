module.exports = {
	name: 'exclusion',
	validate(validatorArgs, propertyValue) {
    const allowedValues = validatorArgs.values;
    if (allowedValues.includes(propertyValue)) {
      return 'isIncluded'
    }
	},
	message: {
		isIncluded: 'must not be one of ${values}',
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
