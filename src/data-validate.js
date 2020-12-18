const {
	extractDeepProperty,
	setDeepProperty,
	DeepPropertyError,
} = require('@ngr900/deep-property');

const {
	interpolateStringTemplate,
} = require('@ngr900/simple-string-templates');

const {
	registerValidator,
	getValidatorFunction,
} = require('./validator-registry.js');

class ValidatorError extends Error {
	constructor(message) {
		super(message);
		this.name = 'ValidatorError';
	}
}

function isFunction(value) {
	return typeof value === 'function';
}

function isObject(value) {
	return typeof value === 'object' && value !== null;
}

function isArray(value) {
	return Array.isArray(value);
}

function isString(value) {
	return typeof value === 'string';
}

const validators = {};

validators.length = {
	validate(validatorArguments, propertyExists, propertyValue) {
		if (!propertyExists) return;
		if (propertyValue.length === undefined) return 'notValid';
		const { min, max, equal } = validatorArguments;
		if (equal !== undefined && propertyValue.length !== equal)
			return 'wrongLength';
		if (min !== undefined && propertyValue.length < min) return 'tooShort';
		if (max !== undefined && propertyValue.length > max) return 'tooLong';
	},
	messages: {
		notValid: 'is not valid',
		wrongLength: 'is the wrong length (should be ${equal} characters)',
		tooLong: 'is too long (maximum is ${max} characters)',
		tooShort: 'is too short (minimum is ${min} characters)',
	},
};

function getValidator(validatorType) {
	if (validators[validatorType] === undefined) {
		throw new ValidatorError(`Validator type ${validatorType} not found.`);
	} else {
		return validators[validatorType];
	}
}

function executeValidator(
	validatorType,
	validatorArgs,
	propertyExists,
	propertyValue,
	propertyName
	// dataObject,
	// propertyErrors,
	// allErrors
) {
	if (validatorType === 'custom') {
		// TODO
		return;
	}

	const validatorObject = getValidator(validatorType);
	const validateFunction = validatorObject.validate;

	// execute the actual validation
	let errors = validateFunction(validatorArgs, propertyExists, propertyValue);
	// validators may return single errors, put them into an array
	if (errors === undefined) {
		errors = [];
	} else if (!isArray(errors)) {
		errors = [errors];
	}
	// fill templates, choose message etc.

	// prepare error message templates
	const validatorMessages = validatorObject.messages;
	const customMessages = validatorArgs.messages || {};
	return errors
		.map((errorType) => {
			// TODO this needs work
			if (customMessages[errorType]) {
				return customMessages[errorType];
			} else if (typeof customMessages === 'string') {
				return customMessages;
			} else if (validatorMessages[errorType]) {
				return validatorMessages[errorType];
			} else {
				console.warn(
					`No error message template found for error "${errorType}" in validator "${validatorType}"`
				);
				return 'is not valid (no specific message available)';
			}
		})
		.map((errorMessageTemplate) => {
			if (isFunction(errorMessageTemplate)) {
				errorMessageTemplate = errorMessageTemplate(
					propertyExists,
					propertyValue,
					propertyName,
					validatorArgs,
					validatorType
				);
				if (!isString(errorMessageTemplate)) {
					throw new ValidatorError(
						`Error template function must return a string, got ${typeof errorMessageTemplate} instead.`
					);
				}
			} else if (!isString(errorMessageTemplate)) {
				throw new ValidatorError(
					'Error template must be a string or a function.'
				);
			}
			return interpolateStringTemplate(errorMessageTemplate, {
				propExists: propertyExists,
				propValue: propertyValue,
				propName: propertyName,
				...validatorArgs,
			});
		});
}

function validateData(dataObject, instructions, options = {}) {
	// allow for arrays to be validated
	if (isArray(dataObject)) {
		return dataObject.map((dataElement) =>
			validateData(dataElement, instructions, options)
		);
	}
	if (!isObject(instructions)) {
		throw new ValidatorError('Instructions must be given as an object.');
	}
	const allErrors = {};
	for (let [propertyName, propertyValidators] of Object.entries(instructions)) {
		// extract property existance and value
		const [propertyExists, propertyValue] = extractDeepProperty(
			dataObject,
			propertyName
		);
		// allow for dynamic validators
		if (isFunction(propertyValidators)) {
			propertyValidators = propertyValidators(
				propertyExists,
				propertyValue,
				propertyName,
				dataObject,
				allErrors
			);
			if (!isObject(propertyValidators)) {
				throw new ValidatorError(
					'Property validators function must return an object.'
				);
			}
		} else if (!isObject(propertyValidators)) {
			throw new ValidatorError(
				'Property validators must be given as an object or a function that returns an object.'
			);
		}
		const propertyErrors = [];
		// if at and validate, do that and continue
		for (let [validatorType, validatorArgs] of Object.entries(
			propertyValidators
		)) {
			// allow for single dynamic validators
			if (isFunction(validatorArgs)) {
				validatorArgs = validatorArgs(
					propertyExists,
					propertyValue,
					propertyName,
					dataObject,
					allErrors,
					propertyErrors
				);
			}
			// execute validator and get errors
			const validatorErrors = executeValidator(
				validatorType,
				validatorArgs,
				propertyExists,
				propertyValue,
				propertyName,
				dataObject,
				propertyErrors,
				allErrors
			);

			propertyErrors.push(...validatorErrors);
		}
		if (propertyErrors.length > 0) {
			setDeepProperty(allErrors, propertyName, propertyErrors);
		}
	}
	return allErrors;
}

module.exports = { validateData };
