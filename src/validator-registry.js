const validatorRegistry = {};

class ValidatorRegistryError extends Error {
	constructor(message) {
		super(message);
		this.name = 'ValidatorRegistryError';
	}
}

function registerValidator(name, validator) {
	if (validatorRegistry[name] !== undefined) {
		throw new ValidatorRegistryError(
			`Can not register validator with under the name "${name}", another validator with that name already exists.`
		);
	} else {
		validatorRegistry[name] = validator;
	}
}

function getValidatorFunction(name) {
	if (validatorRegistry[name] === undefined) {
		throw new ValidatorRegistryError(`There is no validator registered under the name "${name}"`);
	} else {
		return validatorRegistry[name];
	}
}

module.exports = { registerValidator, getValidatorFunction };
