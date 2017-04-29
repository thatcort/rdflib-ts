import 'mocha';
import * as chai from 'chai';

let should = chai.should();

import { IRI } from '../../../src/model/iri';
import { NQuad } from '../../../src/model/n-quad';
import { BlankNode } from '../../../src/model/blank-node';
import { LangLiteral } from '../../../src/model/lang-literal';
import { InvalidOperationError } from '../../../src/errors/invalid-operation-error';

describe('NQuad - Unit', ()  => {
	context('constructor', () => {
		it('should set subject, predicate and object properties', () => {
			let quad = new NQuad(new BlankNode(), 'rdf:knows', { type: 'literal', value: 'Literal', 'xml:lang': 'en' });
			quad.subject.should.be.instanceof(BlankNode);
			quad.predicate.should.be.instanceof(IRI);
			quad.object.should.be.instanceof(LangLiteral);
			should.not.exist(quad.graph);

			quad = new NQuad(new BlankNode(), 'rdf:knows', { type: 'literal', value: 'Literal', 'xml:lang': 'en' }, 'rdf:graph');
			quad.subject.should.be.instanceof(BlankNode);
			quad.predicate.should.be.instanceof(IRI);
			quad.object.should.be.instanceof(LangLiteral);
			quad.graph.should.be.instanceof(IRI);

			quad = new NQuad(new BlankNode(), 'rdf:knows', { type: 'literal', value: 'Literal', 'xml:lang': 'en' }, new IRI('rdf:graph'));
			quad.subject.should.be.instanceof(BlankNode);
			quad.predicate.should.be.instanceof(IRI);
			quad.object.should.be.instanceof(LangLiteral);
			quad.graph.should.be.instanceof(IRI);

			quad = new NQuad(new BlankNode(), 'rdf:knows', { type: 'literal', value: 'Literal', 'xml:lang': 'en' }, { type: 'uri', value: 'rdf:graph' });
			quad.subject.should.be.instanceof(BlankNode);
			quad.predicate.should.be.instanceof(IRI);
			quad.object.should.be.instanceof(LangLiteral);
			quad.graph.should.be.instanceof(IRI);
		});

		it('should throw InvalidOperation error if specified invalid graph value', () => {
			(() => new NQuad(new BlankNode(), { type: 'uri', value: 'rdf:knows' }, { type: 'bnode', value: 'b2' }, '_:b3')).should.throw(InvalidOperationError);
			(() => new NQuad(new BlankNode(), { type: 'uri', value: 'rdf:knows' }, { type: 'bnode', value: 'b2' }, 'plain literal')).should.throw(InvalidOperationError);
			(() => new NQuad(new BlankNode(), { type: 'uri', value: 'rdf:knows' }, { type: 'bnode', value: 'b2' }, '"typed literal"^^xsd:string')).should.throw(InvalidOperationError);
			(() => new NQuad(new BlankNode(), { type: 'uri', value: 'rdf:knows' }, { type: 'bnode', value: 'b2' }, '"lang literal"@de')).should.throw(InvalidOperationError);

			(() => new NQuad(new BlankNode(), { type: 'uri', value: 'rdf:knows' }, { type: 'bnode', value: 'b2' }, { type: 'bnode', value: 'b3' })).should.throw(InvalidOperationError);
			(() => new NQuad(new BlankNode(), { type: 'uri', value: 'rdf:knows' }, { type: 'bnode', value: 'b2' }, { type: 'literal', value: 'b3' })).should.throw(InvalidOperationError);
			(() => new NQuad(new BlankNode(), { type: 'uri', value: 'rdf:knows' }, { type: 'bnode', value: 'b2' }, { type: 'literal', value: 'b3', 'xml:lang': 'en' })).should.throw(InvalidOperationError);
			(() => new NQuad(new BlankNode(), { type: 'uri', value: 'rdf:knows' }, { type: 'bnode', value: 'b2' }, { type: 'literal', value: 'b3', datatype: 'xsd:string' })).should.throw(InvalidOperationError);
			(() => new NQuad(new BlankNode(), { type: 'uri', value: 'rdf:knows' }, { type: 'bnode', value: 'b2' }, { type: 'typed-literal', value: 'b3', datatype: 'xsd:string' })).should.throw(InvalidOperationError);
		});
	});

	context('toString', () => {
		it('should return space separated subject, predicate and object and optionally graph with dot at the and', () => {
			let quad = new NQuad('b1', 'http://example.org#knows', 'b2');
			quad.toString().should.equal('_:b1 <http://example.org#knows> _:b2 .');

			quad = new NQuad('b1', 'http://example.org#knows', 'b2', 'http://example.org#graph');
			quad.toString().should.equal('_:b1 <http://example.org#knows> _:b2 <http://example.org#graph> .');
		})
	});
});