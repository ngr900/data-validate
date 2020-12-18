const { expect } = require('chai');
const { validateData } = require('./../../src/data-validate.js');

describe('inclusion validator', function () {
	it('validates inclusion', function () {
		expect(
			validateData(
				{
          isIncluded: 'foo',
          isNotIncluded: 'baz'
				},
				{
					isIncluded: {
						inclusion: {
							values: ['foo', 'bar'],
						},
					},
					isNotIncluded: {
						inclusion: {
							values: ['foo', 'bar'],
						},
					},
				}
			)
		).to.deep.equal({
			isNotIncluded: ['must be one of foo,bar']
		});
	});
	it('allows shorthand arguments', function () {
		expect(
			validateData(
				{
          isIncluded: 'foo',
          isNotIncluded: 'baz'
				},
				{
					isIncluded: {
						inclusion: ['foo', 'bar'],
					},
					isNotIncluded: {
						inclusion: ['foo', 'bar'],
					},
				}
			)
		).to.deep.equal({
			isNotIncluded: ['must be one of foo,bar']
		});
	});
});