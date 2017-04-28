import { InvalidOperationError } from '../../../src/errors/invalid-operation-error';

import { IRI } from '../../../src/model/iri';
import { LangLiteral } from '../../../src/model/lang-literal';
import { BlankNode } from '../../../src/model/blank-node';
import { NQuad } from '../../../src/model/n-quad';
import 'mocha';
import { expect } from 'chai';

describe('NQuad - Unit', ()  => {
	context('constructor', () => {
		it('should set subject, predicate and object properties', () => {
			let quad = new NQuad(new BlankNode(), 'rdf:knows', { type: 'literal', value: 'Literal', 'xml:lang': 'en' });
			expect(quad.subject).to.be.instanceof(BlankNode);
			expect(quad.predicate).to.be.instanceof(IRI);
			expect(quad.object).to.be.instanceof(LangLiteral);
			expect(quad.graph).not.to.be.ok;

			quad = new NQuad(new BlankNode(), 'rdf:knows', { type: 'literal', value: 'Literal', 'xml:lang': 'en' }, 'rdf:graph');
			expect(quad.subject).to.be.instanceof(BlankNode);
			expect(quad.predicate).to.be.instanceof(IRI);
			expect(quad.object).to.be.instanceof(LangLiteral);
			expect(quad.graph).to.be.instanceof(IRI);

			quad = new NQuad(new BlankNode(), 'rdf:knows', { type: 'literal', value: 'Literal', 'xml:lang': 'en' }, new IRI('rdf:graph'));
			expect(quad.subject).to.be.instanceof(BlankNode);
			expect(quad.predicate).to.be.instanceof(IRI);
			expect(quad.object).to.be.instanceof(LangLiteral);
			expect(quad.graph).to.be.instanceof(IRI);

			quad = new NQuad(new BlankNode(), 'rdf:knows', { type: 'literal', value: 'Literal', 'xml:lang': 'en' }, { type: 'uri', value: 'rdf:graph' });
			expect(quad.subject).to.be.instanceof(BlankNode);
			expect(quad.predicate).to.be.instanceof(IRI);
			expect(quad.object).to.be.instanceof(LangLiteral);
			expect(quad.graph).to.be.instanceof(IRI);
		});

		it('should throw InvalidOperation error if specified invalid graph value', () => {
			expect(() => new NQuad(new BlankNode(), { type: 'uri', value: 'rdf:knows' }, { type: 'bnode', value: 'b2' }, '_:b3')).to.throw(InvalidOperationError);
			expect(() => new NQuad(new BlankNode(), { type: 'uri', value: 'rdf:knows' }, { type: 'bnode', value: 'b2' }, 'plain literal')).to.throw(InvalidOperationError);
			expect(() => new NQuad(new BlankNode(), { type: 'uri', value: 'rdf:knows' }, { type: 'bnode', value: 'b2' }, '"typed literal"^^xsd:string')).to.throw(InvalidOperationError);
			expect(() => new NQuad(new BlankNode(), { type: 'uri', value: 'rdf:knows' }, { type: 'bnode', value: 'b2' }, '"lang literal"@de')).to.throw(InvalidOperationError);

			expect(() => new NQuad(new BlankNode(), { type: 'uri', value: 'rdf:knows' }, { type: 'bnode', value: 'b2' }, { type: 'bnode', value: 'b3' })).to.throw(InvalidOperationError);
			expect(() => new NQuad(new BlankNode(), { type: 'uri', value: 'rdf:knows' }, { type: 'bnode', value: 'b2' }, { type: 'literal', value: 'b3' })).to.throw(InvalidOperationError);
			expect(() => new NQuad(new BlankNode(), { type: 'uri', value: 'rdf:knows' }, { type: 'bnode', value: 'b2' }, { type: 'literal', value: 'b3', 'xml:lang': 'en' })).to.throw(InvalidOperationError);
			expect(() => new NQuad(new BlankNode(), { type: 'uri', value: 'rdf:knows' }, { type: 'bnode', value: 'b2' }, { type: 'literal', value: 'b3', datatype: 'xsd:string' })).to.throw(InvalidOperationError);
			expect(() => new NQuad(new BlankNode(), { type: 'uri', value: 'rdf:knows' }, { type: 'bnode', value: 'b2' }, { type: 'typed-literal', value: 'b3', datatype: 'xsd:string' })).to.throw(InvalidOperationError);
		});
	});

	context('toString', () => {
		it('should return space separated subject, predicate and object and optionally graph with dot at the and', () => {
			let quad = new NQuad('b1', 'http://example.org#knows', 'b2');
			expect(quad.toString()).to.equal('_:b1 <http://example.org#knows> _:b2 .');

			quad = new NQuad('b1', 'http://example.org#knows', 'b2', 'http://example.org#graph');
			expect(quad.toString()).to.equal('_:b1 <http://example.org#knows> _:b2 <http://example.org#graph> .');
		})
	});
});