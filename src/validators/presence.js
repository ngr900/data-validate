const { isBoolean, isEmpty } = require('./../helpers.js');

function getExpectedState(validatorArgs) {
	if (isBoolean(validatorArgs.present)) {
		return validatorArgs.present;
	} else if (!validatorArgs) {
		return false;
	} else {
		return true;
	}
}

module.exports = {
	validate(validatorArgs, propertyExists, propertyValue) {
		const expectedState = getExpectedState(validatorArgs);
		const stateCheck = propertyExists === expectedState;
		const emptyCheck = !validatorArgs.notEmpty || !isEmpty(propertyValue);
		if (!stateCheck && expectedState === false) {
			return 'presentWhenProhibited';
		} else if (!stateCheck && expectedState === true) {
			return 'absentWhenRequired';
		} else if (stateCheck && !emptyCheck) {
			return 'absentWhenRequired';
		}
	},
	message: {
		presentWhenProhibited: `must be blank`,
		absentWhenRequired: `can't be blank`,
	},
};
