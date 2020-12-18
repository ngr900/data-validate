const { expect } = require('chai');
const { validateData } = require('./../../src/data-validate.js');

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