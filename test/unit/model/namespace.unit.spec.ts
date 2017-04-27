import 'mocha';
import { expect } from 'chai';

import { Namespace } from '../../../src/model/namespace';
import { FormatError } from '../../../src/errors/format-error';
import { ArgumentError } from '../../../src/errors/argument-error';

describe('Namespace - Unit', () => {
	let namespace;

	context('constructor', () => {
		it('should set prefix and value properties', () => {	
			namespace = new Namespace('ex', 'http://example.org#');

			expect(namespace.prefix).to.equal('ex');
			expect(namespace.value).to.equal('http://example.org#');
		});
	});

	context('set prefix', () => {
		it('should throw ArgumentError if null, undefined or empty string provided', () => {
			expect(() => namespace.prefix = null).to.throw(ArgumentError);
			expect(() => namespace.prefix = undefined).to.throw(ArgumentError);
			expect(() => namespace.prefix = '').to.throw(ArgumentError);
		});

		it('should set prefix', () => {
			namespace.prefix = 'ex';
			expect(namespace.prefix).to.equal('ex');
		});
	});

	context('set value', () => {
		it('should throw ArgumentError if null, undefined or empty string provided', () => {
			expect(() => namespace.value = null).to.throw(ArgumentError);
			expect(() => namespace.value = undefined).to.throw(ArgumentError);
			expect(() => namespace.value = '').to.throw(ArgumentError);
		});

		it('should throw FormatError if invalid namespace value provided', () => {
			expect(() => namespace.value = 'invalid namespace value').to.throw(FormatError);
		});

		it('should set namespace value if format is correct', () => {
			namespace.value = 'http://example.org#';
			expect(namespace.value).to.equal('http://example.org#');
		});

		it('should append / to the end of namespace value if there is no # or /', () => {
			namespace.value = 'http://example.org';
			expect(namespace.value).to.equal('http://example.org/');
		});
	});
});