const { expect } = require('chai');
const { validateData } = require('./../../src/data-validate.js');

describe('presence validator', function() {
	it('validates presence and absence', function() {
		expect(validateData({
			presentWhenProhibited: 'value',
		}, {
			presentWhenProhibited: {
				presence: {
					present: false
				}
			},
			absentWhenRequired: {
				presence: {
					present: true
				}
			}
		})).to.deep.equal({
			presentWhenProhibited: [`must be blank`],
			absentWhenRequired: [`must not be blank`]
		})
	})
	context('emptiness', function() {
		it('validates emptiness of strings', function() {
			expect(validateData({
				emptyString: '',
				notEmptyString: 'foo'
			}, {
				emptyString: {
					presence: {
						notEmpty: true
					}
				},
				notEmptyString: {
					presence: {
						notEmpty: true
					}
				}
			})).to.deep.equal({
				emptyString: [`must not be blank`]
			})
		})
		it('validates emptiness of arrays', function() {
			expect(validateData({
				emptyArray: [],
				notEmptyArray: ['foo']
			}, {
				emptyArray: {
					presence: {
						notEmpty: true
					}
				},
				notEmptyArray: {
					presence: {
						notEmpty: true
					}
				}
			})).to.deep.equal({
				emptyArray: [`must not be blank`]
			})
		})
		it('validates emptiness of objects', function() {
			expect(validateData({
				emptyObject: {},
				notEmptyObject: {foo: 'bar'}
			}, {
				emptyObject: {
					presence: {
						notEmpty: true
					}
				},
				notEmptyObject: {
					presence: {
						notEmpty: true
					}
				}
			})).to.deep.equal({
				emptyObject: [`must not be blank`]
			})
		})
		it('treats other values as not empty', function() {
			expect(validateData({
				notEmptyValue: 1,
			}, {
				notEmptyValue: {
					presence: {
						notEmpty: true
					}
				}
			})).to.deep.equal({})
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