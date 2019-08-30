import { Namespace } from '../../../src/model/namespace';
import { FormatError } from '../../../src/errors/format-error';
import { ArgumentError } from '../../../src/errors/argument-error';

describe('Namespace - Unit', () => {
	let namespace;

	context('constructor', () => {
		it('should set prefix and value properties', () => {
			namespace = new Namespace('ex', 'http://example.org#');

			namespace.prefix.should.equal('ex');
			namespace.value.should.equal('http://example.org#');
		});
	});

	context('set prefix', () => {
		it('should throw ArgumentError if null, undefined or empty string provided', () => {
			(() => (namespace.prefix = null)).should.throw(ArgumentError);
			(() => (namespace.prefix = undefined)).should.throw(ArgumentError);
			(() => (namespace.prefix = '')).should.throw(ArgumentError);
		});

		it('should set prefix', () => {
			namespace.prefix = 'ex';
			namespace.prefix.should.equal('ex');
		});
	});

	context('set value', () => {
		it('should throw ArgumentError if null, undefined or empty string provided', () => {
			(() => (namespace.value = null)).should.throw(ArgumentError);
			(() => (namespace.value = undefined)).should.throw(ArgumentError);
			(() => (namespace.value = '')).should.throw(ArgumentError);
		});

		it('should throw FormatError if invalid namespace value provided', () => {
			() => (namespace.value = 'invalid namespace value'.should.throw(FormatError));
		});

		it('should set namespace value if format is correct', () => {
			namespace.value = 'http://example.org#';
			namespace.value.should.equal('http://example.org#');
		});

		it('should append / to the end of namespace value if there is no # or /', () => {
			namespace.value = 'http://example.org';
			namespace.value.should.equal('http://example.org/');
		});
	});
});
