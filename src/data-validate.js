const {
	extractDeepProperty,
	setDeepProperty,
} = require('@ngr900/deep-property');

const {
	interpolateStringTemplate,
} = require('@ngr900/simple-string-templates');

const {
	isFunction,
	isBoolean,
	isArray,
	isString,
	isPlainObject,
	isInteger,
	isUndefined,
} = require('@ngr900/type-check');

const { prettyJoin, isUndefinedOrNull } = require('./misc.js');

const ValidatorError = require('./errors/ValidatorError.js');
const ValidationError = require('./errors/ValidationError.js');

const validators = {};

validators.length = require('./validators/length.js');
validators.presence = require('./validators/presence.js');

const shorthands = {
	integer: isInteger,
	string: isString,
	array: isArray,
	boolean: isBoolean,
};

function parseShorthand(validatorObject, shorthandValue) {
	if (!isPlainObject(validatorObject.shorthand)) {
		throw new ValidatorError(
			`Validator ${validatorObject.name} does not allow shorthand arguments.`
		);
	}
	const validatorShorthands = Object.keys(validatorObject.shorthand);
	for (shorthandType of validatorShorthands) {
		if (isUndefined(shorthands[shorthandType])) {
			throw new ValidatorError(
				`Shorthand type ${shorthandType} is not supported.`
			);
		}
		if (shorthands[shorthandType](shorthandValue)) {
			return validatorObject.shorthand[shorthandType](shorthandValue);
		}
	}
	throw new ValidatorError(
		`Validator ${validatorObject.name} only accepts ${prettyJoin(
			validatorShorthands
		)} shorthands.`
	);
}

function executeValidator(
	validatorType,
	validatorArgs,
	propertyExists,
	propertyValue,
	propertyName,
	options
) {
	if (validatorType === 'custom') {
		// TODO
		return;
	}

	if (validators[validatorType] === undefined) {
		throw new ValidatorError(`Validator "${validatorType}" not found.`);
	}

	const validatorObject = validators[validatorType];
	const validateFunction = validatorObject.validate;

	if (!isPlainObject(validatorArgs)) {
		validatorArgs = parseShorthand(validatorObject, validatorArgs);
	}

	// if (options.validateArguments) {
	// 	if (validatorObject.arguments === undefined) {
	// 		throw new ValidatorError('')
	// 	}
	// }

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
	const validatorMessages = validatorObject.message;
	const customMessages = validatorArgs.message || {};
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
				throw new ValidatorError(
					`No error message template found for "${errorType}" in validator "${validatorType}".`
				);
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
					`Error template must be a string or a function, got ${typeof errorMessageTemplate} instead.`
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
	options = Object.assign(
		{
			validateArguments: true,
		},
		options
	);
	// allow for arrays to be validated
	if (isArray(dataObject)) {
		return dataObject.map((dataElement) =>
			validateData(dataElement, instructions, options)
		);
	}
	if (!isPlainObject(instructions)) {
		throw new ValidatorError('Instructions must be given as a plain object.');
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
			if (!isPlainObject(propertyValidators)) {
				throw new ValidatorError(
					'Property validators function must return a plain object.'
				);
			}
		} else if (!isPlainObject(propertyValidators)) {
			throw new ValidatorError(
				'Property validators must be given as an object or a function that returns a plain object.'
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
			if (isUndefinedOrNull(validatorArgs)) {
				throw new ValidatorError(
					'Validator arguments must not be undefined or null.'
				);
			}
			// execute validator and get errors
			const validatorErrors = executeValidator(
				validatorType,
				validatorArgs,
				propertyExists,
				propertyValue,
				propertyName,
				options
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
