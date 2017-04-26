import { ArgumentError } from '../../../src/errors/argument-error';
import 'mocha';
import { expect } from 'chai';
import { PlainLiteral } from '../../../src/model/plain-literal';

describe('PlainLiteral - Unit', () => {
	let plainLiteral = new PlainLiteral('Literal');

	context('constructor', () => {
		it('should set literal value', () => {
			plainLiteral = new PlainLiteral('Plain literal value');
			expect(plainLiteral.value).to.equal('Plain literal value');
		});
	});

	context('set value', () => {
		it('should throw ArgumentError if null or undefined provided', () => {
			expect(() => plainLiteral.value = null).to.throw(ArgumentError);
			expect(() => plainLiteral.value = undefined).to.throw(ArgumentError);
		});

		it('should set plain literal value', () => {
			plainLiteral.value = 'literal';
			expect(plainLiteral.value).to.equal('literal');
		});

		it('should remove double quotes from beginning and end of plain literal value', () => {
			plainLiteral.value = '"literal"';
			expect(plainLiteral.value).to.equal('literal');
		});
	});

	context('toString', () => {
		it('should return double quoted and escaped literal value', () => {
			plainLiteral.value = '^\\d{3}-\\d{2}-\\d{4}$';
			expect(plainLiteral.toString()).to.equal('"^\\\\d{3}-\\\\d{2}-\\\\d{4}$"')
		});
	});
});