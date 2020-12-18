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
	name: 'presence',
	validate(validatorArgs, propertyExists, propertyValue) {
		const expectedState = getExpectedState(validatorArgs);
		const stateCheck = propertyExists === expectedState;
		const emptyCheck = !validatorArgs.notEmpty || !isEmpty(propertyValue);

		const presentWhenProhibited = !stateCheck && expectedState === false;
		const absentWhenRequired = (!stateCheck && expectedState === true) || (stateCheck && !emptyCheck);

		if (presentWhenProhibited) {
			return 'presentWhenProhibited';
		} else if (absentWhenRequired) {
			return 'absentWhenRequired';
		}
	},
	message: {
		presentWhenProhibited: 'must be blank',
		absentWhenRequired: 'must not be blank',
	},
	shorthand: {
		boolean: present => ({present})
	}
};
