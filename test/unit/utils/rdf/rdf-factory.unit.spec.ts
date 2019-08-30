import { BlankNode } from '../../../../src/model/blank-node';

import { IRI } from '../../../../src/model/iri';

import { RdfFactory } from '../../../../src/utils/rdf/rdf-factory';
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
			RdfFactory.createLiteral('"typed literal"^^xsd:boolean').should.be.instanceof(
				TypedLiteral
			);
			RdfFactory.createLiteral('typed literal', null, 'xsd:boolean').should.be.instanceof(
				TypedLiteral
			);
		});
	});

	context('createRdfTermFromSparqlResultBinding', () => {
		it('should create appropriate rdf term instance based on input sparql result binding', () => {
			RdfFactory.createRdfTermFromSparqlResultBinding({
				type: 'uri',
				value: 'http://example.org#Alice'
			}).should.be.instanceof(IRI);
			RdfFactory.createRdfTermFromSparqlResultBinding({
				type: 'bnode',
				value: '_:b1'
			}).should.be.instanceof(BlankNode);
			RdfFactory.createRdfTermFromSparqlResultBinding({
				type: 'literal',
				value: 'plain literal'
			}).should.be.instanceof(PlainLiteral);
			RdfFactory.createRdfTermFromSparqlResultBinding({
				type: 'literal',
				value: '"lang literal"@en'
			}).should.be.instanceof(LangLiteral);
			RdfFactory.createRdfTermFromSparqlResultBinding({
				type: 'literal',
				value: 'lang literal',
				'xml:lang': 'de'
			}).should.be.instanceof(LangLiteral);
			RdfFactory.createRdfTermFromSparqlResultBinding({
				type: 'literal',
				value: '"typed literal"^^xsd:string'
			}).should.be.instanceof(TypedLiteral);
			RdfFactory.createRdfTermFromSparqlResultBinding({
				type: 'literal',
				value: 'typed literal',
				datatype: 'xsd:string'
			}).should.be.instanceof(TypedLiteral);
			RdfFactory.createRdfTermFromSparqlResultBinding({
				type: 'typed-literal',
				value: '"typed literal"^^xsd:string'
			}).should.be.instanceof(TypedLiteral);
			RdfFactory.createRdfTermFromSparqlResultBinding({
				type: 'typed-literal',
				value: 'typed literal',
				datatype: 'xsd:string'
			}).should.be.instanceof(TypedLiteral);
		});
	});
});
