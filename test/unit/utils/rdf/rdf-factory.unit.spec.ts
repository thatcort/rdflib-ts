import { FormatError } from '../../../../src/errors/format-error';
import { TypedLiteral } from '../../../../src/model/typed-literal';
import { LangLiteral } from '../../../../src/model/lang-literal';
import { PlainLiteral } from '../../../../src/model/plain-literal';
import { ArgumentError } from '../../../../src/errors/argument-error';
import { RdfFactory } from '../../../../src/utils/rdf/rdf-factory';
import 'mocha';
import { expect } from 'chai';

describe('RdfFactory - Unit', () => {
	context('createLiteral', () => {
		it('should throw ArgumentError if value is null or undefined', () => {
			expect(() => RdfFactory.createLiteral(null)).to.throw(ArgumentError);
			expect(() => RdfFactory.createLiteral(undefined)).to.throw(ArgumentError);
		});

		it('should create appropriate literal type if input is valid', () => {
			expect(RdfFactory.createLiteral('"plain literal"') instanceof PlainLiteral).to.be.true;
			expect(RdfFactory.createLiteral('"lang literal"@en') instanceof LangLiteral).to.be.true;
			expect(RdfFactory.createLiteral('lang literal', '@en') instanceof LangLiteral).to.be.true;
			expect(RdfFactory.createLiteral('"typed literal"^^xsd:boolean') instanceof TypedLiteral).to.be.true;
			expect(RdfFactory.createLiteral('typed literal', null, 'xsd:boolean') instanceof TypedLiteral).to.be.true;
		});
	});
});