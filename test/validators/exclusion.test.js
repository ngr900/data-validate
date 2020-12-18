const { expect } = require('chai');
const { validateData } = require('./../../src/data-validate.js');

describe('exclusion validator', function () {
	it('validates exclusion', function () {
		expect(
			validateData(
				{
          isIncluded: 'foo',
          isNotIncluded: 'baz'
				},
				{
					isIncluded: {
						exclusion: {
							values: ['foo', 'bar'],
						},
					},
					isNotIncluded: {
						exclusion: {
							values: ['foo', 'bar'],
						},
					},
				}
			)
		).to.deep.equal({
			isIncluded: ['must not be one of foo,bar']
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
						exclusion: ['foo', 'bar'],
					},
					isNotIncluded: {
						exclusion: ['foo', 'bar'],
					},
				}
			)
		).to.deep.equal({
			isIncluded: ['must not be one of foo,bar']
		});
	});
});