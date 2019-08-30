import { TypedLiteral } from '../../../src/model/typed-literal';
import { XsdStringIRI } from '../../../src/model/constants';
import { ArgumentError } from '../../../src/errors/argument-error';
import { InvalidOperationError } from '../../../src/errors/invalid-operation-error';

describe('TypedLiteral - Unit', () => {
	let typedLiteral = new TypedLiteral('Literal');

	context('constructor', () => {
		it('should set literal value and datatype properties', () => {
			typedLiteral = new TypedLiteral('String typed literal', XsdStringIRI);
			typedLiteral.value.should.equal('String typed literal');
			typedLiteral.dataType.value.should.equal(XsdStringIRI.value);

			typedLiteral = new TypedLiteral('String typed literal', 'xsd:string');
			typedLiteral.value.should.equal('String typed literal');
			typedLiteral.dataType.value.should.equal(XsdStringIRI.value);

			typedLiteral = new TypedLiteral({
				type: 'literal',
				value: 'String typed literal',
				datatype: 'xsd:string'
			});
			typedLiteral.value.should.equal('String typed literal');
			typedLiteral.dataType.value.should.equal(XsdStringIRI.value);

			typedLiteral = new TypedLiteral({
				type: 'typed-literal',
				value: 'String typed literal',
				datatype: 'xsd:string'
			});
			typedLiteral.value.should.equal('String typed literal');
			typedLiteral.dataType.value.should.equal(XsdStringIRI.value);
		});

		it('should set xsd:string as default datatype if not provided', () => {
			typedLiteral = new TypedLiteral('String typed literal');
			typedLiteral.value.should.equal('String typed literal');
			typedLiteral.dataType.value.should.equal(XsdStringIRI.value);
		});

		it('should throw InvalidOperationError if sparql query result binding provided and its type is literal without datatype or with xml:lang specified', () => {
			(() => new TypedLiteral({ type: 'uri', value: 'b1' })).should.throw(
				InvalidOperationError
			);
			(() =>
				new TypedLiteral({ type: 'literal', value: 'b1', 'xml:lang': 'en' })).should.throw(
				InvalidOperationError
			);
			(() => new TypedLiteral({ type: 'literal', value: 'b1' })).should.throw(
				InvalidOperationError
			);
		});
	});

	context('set dataType', () => {
		it('should throw ArgumentError if null or undefined', () => {
			(() => (typedLiteral.dataType = null)).should.throw(ArgumentError);
			(() => (typedLiteral.dataType = undefined)).should.throw(ArgumentError);
		});

		it('should set datatype value', () => {
			typedLiteral.dataType = XsdStringIRI;
			typedLiteral.dataType.value.should.equal(XsdStringIRI.value);
		});
	});

	context('set value', () => {
		it('should throw ArgumentError if null or undefined provided', () => {
			(() => (typedLiteral.value = null)).should.throw(ArgumentError);
			(() => (typedLiteral.value = undefined)).should.throw(ArgumentError);
		});

		it('should set literal value', () => {
			typedLiteral.value = 'literal';
			typedLiteral.value.should.equal('literal');
		});

		it('should remove double quotes from beginning and end of plain literal value', () => {
			typedLiteral.value = '"literal"';
			typedLiteral.value.should.equal('literal');
		});

		it('should set datatype if provided implicitly', () => {
			typedLiteral.value = '"literal"^^xsd:string';
			typedLiteral.value.should.equal('literal');
			typedLiteral.dataType.value.should.equal(XsdStringIRI.value);
		});
	});

	context('toString', () => {
		it('should return double quoted and escaped literal value with datatype tag', () => {
			typedLiteral.value = '"^\\d{3}-\\d{2}-\\d{4}$"^^xsd:string';
			typedLiteral
				.toString()
				.should.equal(
					'"^\\\\d{3}-\\\\d{2}-\\\\d{4}$"^^<http://www.w3.org/2001/XMLSchema#string>'
				);
		});
	});
});
