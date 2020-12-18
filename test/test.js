const { expect } = require('chai');
const { validateData } = require('./../src/data-validate.js');

describe('presence validator', function() {
	it('validates presence, absence and emptiness', function() {
		expect(validateData({
			presentWhenProhibited: 'value',
			presentButEmpty: ''
		}, {
			presentWhenProhibited: {
				presence: {
					present: false
				}
			},
			presentButEmpty: {
				presence: {
					present: true,
					notEmpty: true
				}
			},
			absentWhenRequired: {
				presence: {
					present: true
				}
			}
		})).to.deep.equal({
			presentWhenProhibited: [`must be blank`],
			presentButEmpty: [`must not be blank`],
			absentWhenRequired: [`must not be blank`]
		})
	})
	it('allows shorthand arguments', function() {
		expect(validateData({
			presentWhenProhibited: 'value'
		}, {
			presentWhenProhibited: {
				presence: false
			},
			absentWhenRequired: {
				presence: true
			}
		})).to.deep.equal({
			presentWhenProhibited: [`must be blank`],
			absentWhenRequired: [`must not be blank`]
		})
	})
})

describe('length validator', function () {
	it('validates min, max and equal length', function () {
		expect(
			validateData(
				{
					longEnough: 'passes min length',
					tooShort: 'fails min length',
					shortEnough: 'passes max length',
					tooLong: 'fails max length',
					justRight: 'passes equal length',
					justWrong: 'fails equal length',
					shortEnoughButTooLong: 'passes min, fails max'
				},
				{
					longEnough: {
						length: {
							min: 1,
						},
					},
					tooShort: {
						length: {
							min: 30,
						},
					},
					shortEnough: {
						length: {
							max: 30,
						},
					},
					tooLong: {
						length: {
							max: 1,
						},
					},
					justRight: {
						length: {
							equal: 19,
						},
					},
					justWrong: {
						length: {
							equal: 1,
						},
					},
					shortEnoughButTooLong: {
						length: {
							min: 1,
							max: 2
						}
					}
				}
			)
		).to.deep.equal({
			tooShort: ['is too short (minimum is 30 characters)'],
			tooLong: ['is too long (maximum is 1 characters)'],
			justWrong: ['is the wrong length (should be 1 characters)'],
			shortEnoughButTooLong: ['is too long (maximum is 2 characters)']
		});
	});
	it('allows shorthand arguments', function () {
		expect(
			validateData(
				{
					longEnough: 'passes min length',
					tooShort: 'fails min length',
					shortEnough: 'passes max length',
					tooLong: 'fails max length',
					justRight: 'passes equal length',
					justWrong: 'fails equal length',
					shortEnoughButTooLong: 'passes min, fails max'
				},
				{
					longEnough: {
						length: [1]
					},
					tooShort: {
						length: [30]
					},
					shortEnough: {
						length: [, 30]
					},
					tooLong: {
						length: [, 1]
					},
					justRight: {
						length: 19
					},
					justWrong: {
						length: 1
					},
					shortEnoughButTooLong: {
						length: [1,2]
					}
				}
			)
		).to.deep.equal({
			tooShort: ['is too short (minimum is 30 characters)'],
			tooLong: ['is too long (maximum is 1 characters)'],
			justWrong: ['is the wrong length (should be 1 characters)'],
			shortEnoughButTooLong: ['is too long (maximum is 2 characters)']
		});
	});
});

describe('type validator', function() {
	it('validates variable types', function() {
		expect(validateData({
			stringValue: 'hello',
			nonStringValue: 1
		}, {
			stringValue: {
				type: {
					type: 'string'
				}
			},
			nonStringValue: {
				type: {
					type: 'string'
				}
			},
		})).to.deep.equal({
			nonStringValue: [`is of the wrong type (should be string)`]
		})
	})
	it('allows shorthand arguments', function() {
		expect(validateData({
			stringValue: 'hello',
			nonStringValue: 1
		}, {
			stringValue: {
				type: 'string'
			},
			nonStringValue: {
				type: 'string'
			},
		})).to.deep.equal({
			nonStringValue: [`is of the wrong type (should be string)`]
		})
	})
})
