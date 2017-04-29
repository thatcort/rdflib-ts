import 'mocha';
import * as chai from 'chai';

let should = chai.should();

import { RdfFactory } from '../../../../src/utils/rdf/rdf-factory';
import { FormatError } from '../../../../src/errors/format-error';
import { LangLiteral } from '../../../../src/model/lang-literal';
import { TypedLiteral } from '../../../../src/model/typed-literal';
import { PlainLiteral } from '../../../../src/model/plain-literal';
import { ArgumentError } from '../../../../src/errors/argument-error';

describe('RdfFactory - Unit', () => {
	context('createLiteral', () => {
		it('should throw ArgumentError if value is null or undefined', () => {
			(() => RdfFactory.createLiteral(null)).should.throw(ArgumentError);
			(() => RdfFactory.createLiteral(undefined)).should.throw(ArgumentError);
		});

		it('should create appropriate literal type if input is valid', () => {
			RdfFactory.createLiteral('"plain literal"').should.be.instanceof(PlainLiteral);
			RdfFactory.createLiteral('"lang literal"@en').should.be.instanceof(LangLiteral);
			RdfFactory.createLiteral('lang literal', '@en').should.be.instanceof(LangLiteral);
			RdfFactory.createLiteral('"typed literal"^^xsd:boolean').should.be.instanceof(TypedLiteral);
			RdfFactory.createLiteral('typed literal', null, 'xsd:boolean').should.be.instanceof(TypedLiteral);
		});
	});
});