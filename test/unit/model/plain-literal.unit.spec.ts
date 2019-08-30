import { PlainLiteral } from '../../../src/model/plain-literal';
import { ArgumentError } from '../../../src/errors/argument-error';
import { InvalidOperationError } from '../../../src/errors/invalid-operation-error';

describe('PlainLiteral - Unit', () => {
	let plainLiteral = new PlainLiteral('Literal');

	context('constructor', () => {
		it('should set literal value', () => {
			plainLiteral = new PlainLiteral('Plain literal value');
			plainLiteral.value.should.equal('Plain literal value');

			plainLiteral = new PlainLiteral({ type: 'literal', value: 'Plain literal value' });
			plainLiteral.value.should.equal('Plain literal value');
		});

		it('should throw InvalidOperationError if sparql query result binding provided and its type is literal with xml:lang and datatype specified', () => {
			() =>
				new PlainLiteral({ type: 'uri', value: 'b1' }).should.throw(InvalidOperationError);
			() =>
				new PlainLiteral({
					type: 'literal',
					value: 'b1',
					datatype: 'xsd:string'
				}).should.throw(InvalidOperationError);
			() =>
				new PlainLiteral({ type: 'literal', value: 'b1', 'xml:lang': 'en' }).should.throw(
					InvalidOperationError
				);
		});
	});

	context('set value', () => {
		it('should throw ArgumentError if null or undefined provided', () => {
			(() => (plainLiteral.value = null)).should.throw(ArgumentError);
			(() => (plainLiteral.value = undefined)).should.throw(ArgumentError);
		});

		it('should set plain literal value', () => {
			plainLiteral.value = 'literal';
			plainLiteral.value.should.equal('literal');
		});

		it('should remove double quotes from beginning and end of plain literal value', () => {
			plainLiteral.value = '"literal"';
			plainLiteral.value.should.equal('literal');
		});
	});

	context('toString', () => {
		it('should return double quoted and escaped literal value', () => {
			plainLiteral.value = '^\\d{3}-\\d{2}-\\d{4}$';
			plainLiteral.toString().should.equal('"^\\\\d{3}-\\\\d{2}-\\\\d{4}$"');
		});
	});
});
