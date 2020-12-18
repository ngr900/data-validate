const { expect } = require('chai');
const { validateData } = require('./../../src/data-validate.js');

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