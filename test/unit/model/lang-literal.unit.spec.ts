import { LangLiteral } from '../../../src/model/lang-literal';
import { ArgumentError } from '../../../src/errors/argument-error';
import { InvalidOperationError } from '../../../src/errors/invalid-operation-error';

describe('LangLiteral - Unit', () => {
	let langLiteral = new LangLiteral('Literal');

	context('constructor', () => {
		it('should set literal value and language properties', () => {
			langLiteral = new LangLiteral('English lang literal', 'en');
			langLiteral.value.should.equal('English lang literal');
			langLiteral.language.should.equal('en');

			langLiteral = new LangLiteral('English lang literal', 'en-NZ');
			langLiteral.value.should.equal('English lang literal');
			langLiteral.language.should.equal('en-NZ');

			langLiteral = new LangLiteral('"English lang literal"@en-NZ');
			langLiteral.value.should.equal('English lang literal');
			langLiteral.language.should.equal('en-NZ');

			langLiteral = new LangLiteral({
				type: 'literal',
				value: 'German lang literal',
				'xml:lang': 'de'
			});
			langLiteral.value.should.equal('German lang literal');
			langLiteral.language.should.equal('de');

			langLiteral = new LangLiteral({
				type: 'literal',
				value: 'German lang literal',
				'xml:lang': 'de-NZ'
			});
			langLiteral.value.should.equal('German lang literal');
			langLiteral.language.should.equal('de-NZ');
		});

		it('should set English as default language', () => {
			langLiteral = new LangLiteral('Lang literal value');
			langLiteral.value.should.equal('Lang literal value');
			langLiteral.language.should.equal('en');
		});

		it('should throw InvalidOperationError if sparql query result binding provided and its type is literal without xml:lang or with datatype specified', () => {
			(() => new LangLiteral({ type: 'uri', value: 'b1' })).should.throw(
				InvalidOperationError
			);
			(() =>
				new LangLiteral({
					type: 'literal',
					value: 'b1',
					datatype: 'xsd:string'
				})).should.throw(InvalidOperationError);
			(() => new LangLiteral({ type: 'literal', value: 'b1' })).should.throw(
				InvalidOperationError
			);
		});
	});

	context('set language', () => {
		it('should throw ArgumentError if null, undefined or empty string provided', () => {
			(() => (langLiteral.language = null)).should.throw(ArgumentError);
			(() => (langLiteral.language = undefined)).should.throw(ArgumentError);
			(() => (langLiteral.language = '')).should.throw(ArgumentError);
		});

		it('should set language value', () => {
			langLiteral.language = 'de';
			langLiteral.language.should.equal('de');
		});
	});

	context('set value', () => {
		it('should throw ArgumentError if null or undefined provided', () => {
			(() => (langLiteral.value = null)).should.throw(ArgumentError);
			(() => (langLiteral.value = undefined)).should.throw(ArgumentError);
		});

		it('should set literal value', () => {
			langLiteral.value = 'literal';
			langLiteral.value.should.equal('literal');
		});

		it('should remove double quotes from beginning and end of plain literal value', () => {
			langLiteral.value = '"literal"';
			langLiteral.value.should.equal('literal');
		});

		it('should set language if provided implicitly', () => {
			langLiteral.value = '"literal"@de';
			langLiteral.value.should.equal('literal');
			langLiteral.language.should.equal('de');
		});
	});

	context('toString', () => {
		it('should return double quoted and escaped literal value with language tag', () => {
			langLiteral.value = '"^\\d{3}-\\d{2}-\\d{4}$"@de';
			langLiteral.toString().should.equal('"^\\\\d{3}-\\\\d{2}-\\\\d{4}$"@de');
		});
	});
});
