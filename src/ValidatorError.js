
class ValidatorError extends Error {
	constructor(message) {
		super(message);
		this.name = 'ValidatorError';
	}
}

module.exports = ValidatorError;