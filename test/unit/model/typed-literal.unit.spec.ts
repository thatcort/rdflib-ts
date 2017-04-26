import { TypedLiteral } from '../../../src/model/typed-literal';
import { ArgumentError } from '../../../src/errors/argument-error';
import 'mocha';
import { expect } from 'chai';
import { LangLiteral } from '../../../src/model/lang-literal';
import { XsdStringIRI } from '../../../src/model/constants';

describe('LangLiteral - Unit', () => {
	let typedLiteral = new TypedLiteral('Literal');

	context('constructor', () => {
		it('should set literal value and datatype properties', () => {
			typedLiteral = new TypedLiteral('String typed literal', XsdStringIRI);
			expect(typedLiteral.value).to.equal('String typed literal');
			expect(typedLiteral.dataType.value).to.equal(XsdStringIRI.value);

			typedLiteral = new TypedLiteral('String typed literal', 'xsd:string');
			expect(typedLiteral.value).to.equal('String typed literal');
			expect(typedLiteral.dataType.value).to.equal(XsdStringIRI.value);
		});

		it('should set xsd:string as default datatype if not provided', () => {
			typedLiteral = new TypedLiteral('String typed literal');
			expect(typedLiteral.value).to.equal('String typed literal');
			expect(typedLiteral.dataType.value).to.equal(XsdStringIRI.value);
		})
	});

	context('set dataType', () => {
		it('should throw ArgumentError if null or undefined', () => {
			expect(() => typedLiteral.dataType = null).to.throw(ArgumentError);
			expect(() => typedLiteral.dataType = undefined).to.throw(ArgumentError);
		});

		it('should set datatype value', () => {
			typedLiteral.dataType = XsdStringIRI;
			expect(typedLiteral.dataType.value).to.equal(XsdStringIRI.value);
		});
	});

	context('set value', () => {
		it('should throw ArgumentError if null or undefined provided', () => {
			expect(() => typedLiteral.value = null).to.throw(ArgumentError);
			expect(() => typedLiteral.value = undefined).to.throw(ArgumentError);
		});

		it('should set literal value', () => {
			typedLiteral.value = 'literal';
			expect(typedLiteral.value).to.equal('literal');
		});

		it('should remove double quotes from beginning and end of plain literal value', () => {
			typedLiteral.value = '"literal"';
			expect(typedLiteral.value).to.equal('literal');
		});

		it('should set datatype if provided implicitly', () => {
			typedLiteral.value = '"literal"^^xsd:string';
			expect(typedLiteral.value).to.equal('literal');
			expect(typedLiteral.dataType.value).to.equal(XsdStringIRI.value);
		});
	});

	context('toString', () => {
		it('should return double quoted and escaped literal value with datatype tag', () => {
			typedLiteral.value = '"^\\d{3}-\\d{2}-\\d{4}$"^^xsd:string';
			expect(typedLiteral.toString()).to.equal('"^\\\\d{3}-\\\\d{2}-\\\\d{4}$"^^<http://www.w3.org/2001/XMLSchema#string>')
		});
	});
});