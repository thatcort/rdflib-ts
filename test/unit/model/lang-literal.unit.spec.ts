import { InvalidOperationError } from '../../../src/errors/invalid-operation-error';
import { ArgumentError } from '../../../src/errors/argument-error';
import 'mocha';
import { expect } from 'chai';
import { LangLiteral } from '../../../src/model/lang-literal';

describe('LangLiteral - Unit', () => {
	let langLiteral = new LangLiteral('Literal');

	context('constructor', () => {
		it('should set literal value and language properties', () => {
			langLiteral = new LangLiteral('English lang literal', 'en');
			expect(langLiteral.value).to.equal('English lang literal');
			expect(langLiteral.language).to.equal('en');

			langLiteral = new LangLiteral({ type: 'literal' , value: 'German lang literal', 'xml:lang': 'de' });
			expect(langLiteral.value).to.equal('German lang literal');
			expect(langLiteral.language).to.equal('de');
		});

		it('should set English as default language', () => {
			langLiteral = new LangLiteral('Lang literal value');
			expect(langLiteral.value).to.equal('Lang literal value');
			expect(langLiteral.language).to.equal('en');
		});

		it('should throw InvalidOperationError if sparql query result binding provided and its type is literal without xml:lang or with datatype specified', () => {
			expect(() => new LangLiteral({ type: 'uri', value: 'b1' })).to.throw(InvalidOperationError);
			expect(() => new LangLiteral({ type: 'literal', value: 'b1', datatype: 'xsd:string' })).to.throw(InvalidOperationError);
			expect(() => new LangLiteral({ type: 'literal', value: 'b1' })).to.throw(InvalidOperationError);
		});
	});

	context('set language', () => {
		it('should throw ArgumentError if null, undefined or empty string provided', () => {
			expect(() => langLiteral.language = null).to.throw(ArgumentError);
			expect(() => langLiteral.language = undefined).to.throw(ArgumentError);
			expect(() => langLiteral.language = '').to.throw(ArgumentError);
		});

		it('should set language value', () => {
			langLiteral.language = 'de';
			expect(langLiteral.language).to.equal('de');
		});
	});

	context('set value', () => {
		it('should throw ArgumentError if null or undefined provided', () => {
			expect(() => langLiteral.value = null).to.throw(ArgumentError);
			expect(() => langLiteral.value = undefined).to.throw(ArgumentError);
		});

		it('should set literal value', () => {
			langLiteral.value = 'literal';
			expect(langLiteral.value).to.equal('literal');
		});

		it('should remove double quotes from beginning and end of plain literal value', () => {
			langLiteral.value = '"literal"';
			expect(langLiteral.value).to.equal('literal');
		});

		it('should set language if provided implicitly', () => {
			langLiteral.value = '"literal"@de';
			expect(langLiteral.value).to.equal('literal');
			expect(langLiteral.language).to.equal('de');
		});
	});

	context('toString', () => {
		it('should return double quoted and escaped literal value with language tag', () => {
			langLiteral.value = '"^\\d{3}-\\d{2}-\\d{4}$"@de';
			expect(langLiteral.toString()).to.equal('"^\\\\d{3}-\\\\d{2}-\\\\d{4}$"@de')
		});
	});
});