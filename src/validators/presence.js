const { isObject, isArray, isString, isBoolean } = require('@ngr900/type-check');

module.exports = {
	name: 'presence',
	validate(validatorArgs, propertyValue, propertyExists) {
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
	},
	validatesPresence: true
};

function isEmpty(value) {
	if (isObject(value)) {
		return Object.keys(value).length === 0;
	} else if (isArray(value)) {
		return value.length === 0;
	} else if (isString(value)) {
		return value.trim().length === 0;
	} else {
		return false;
	}
}

function getExpectedState(validatorArgs) {
	if (isBoolean(validatorArgs.present)) {
		return validatorArgs.present;
	} else if (!validatorArgs) {
		return false;
	} else {
		return true;
	}
}