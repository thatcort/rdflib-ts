import 'mocha';
import * as chai from 'chai';

let should = chai.should();

import { IRI } from '../../../src/model/iri';
import { NTriple } from '../../../src/model/n-triple';
import { BlankNode } from '../../../src/model/blank-node';
import { LangLiteral } from '../../../src/model/lang-literal';
import { TypedLiteral } from '../../../src/model/typed-literal';
import { PlainLiteral } from '../../../src/model/plain-literal';
import { ArgumentError } from '../../../src/errors/argument-error';
import { InvalidOperationError } from '../../../src/errors/invalid-operation-error';

describe('NTriple - Unit', () => {
	let triple = new NTriple('rdf:Alice', 'rdf:knows', 'rdf:Bob');

	context('constructor', () => {
		it('should set subject, predicate and object properties', () => {
			triple = new NTriple(new BlankNode(), 'rdf:knows', { type: 'literal', value: 'Literal', 'xml:lang': 'en' });
			triple.subject.should.be.instanceof(BlankNode);
			triple.predicate.should.be.instanceof(IRI);
			triple.object.should.be.instanceof(LangLiteral);

			triple = new NTriple('_:b1', 'rdf:knows', { type: 'literal', value: 'Literal', 'xml:lang': 'en' });
			triple.subject.should.be.instanceof(BlankNode);
			triple.predicate.should.be.instanceof(IRI);
			triple.object.should.be.instanceof(LangLiteral);

			triple = new NTriple({ type: 'bnode', value: 'b1' }, 'rdf:knows', { type: 'literal', value: 'Literal', 'xml:lang': 'en' });
			triple.subject.should.be.instanceof(BlankNode);
			triple.predicate.should.be.instanceof(IRI);
			triple.object.should.be.instanceof(LangLiteral);

			triple = new NTriple({ type: 'uri', value: 'rdf:Alice' }, 'rdf:knows', { type: 'literal', value: 'Literal', 'xml:lang': 'en' });
			triple.subject.should.be.instanceof(IRI);
			triple.predicate.should.be.instanceof(IRI);
			triple.object.should.be.instanceof(LangLiteral);

			triple = new NTriple({ type: 'uri', value: 'rdf:Alice' }, new IRI('rdf:knows'), { type: 'literal', value: 'Literal', 'xml:lang': 'en' });
			triple.subject.should.be.instanceof(IRI);
			triple.predicate.should.be.instanceof(IRI);
			triple.object.should.be.instanceof(LangLiteral);

			triple = new NTriple({ type: 'uri', value: 'rdf:Alice' }, { type: 'uri', value: 'rdf:Alice' }, { type: 'literal', value: 'Literal', 'xml:lang': 'en' });
			triple.subject.should.be.instanceof(IRI);
			triple.predicate.should.be.instanceof(IRI);
			triple.object.should.be.instanceof(LangLiteral);

			triple = new NTriple(new IRI('rdf:Alice'), 'rdf:knows', { type: 'literal', value: 'Literal', datatype: 'xsd:string' });
			triple.subject.should.be.instanceof(IRI);
			triple.predicate.should.be.instanceof(IRI);
			triple.object.should.be.instanceof(TypedLiteral);

			triple = new NTriple(new BlankNode(), 'rdf:knows', { type: 'typed-literal', value: 'Literal', datatype: 'xsd:string' });
			triple.subject.should.be.instanceof(BlankNode);
			triple.predicate.should.be.instanceof(IRI);
			triple.object.should.be.instanceof(TypedLiteral);

			triple = new NTriple(new BlankNode(), 'rdf:knows', { type: 'literal', value: 'Literal' });
			triple.subject.should.be.instanceof(BlankNode);
			triple.predicate.should.be.instanceof(IRI);
			triple.object.should.be.instanceof(PlainLiteral);

			triple = new NTriple(new BlankNode(), 'rdf:knows', { type: 'uri', value: 'rdf:Bob' });
			triple.subject.should.be.instanceof(BlankNode);
			triple.predicate.should.be.instanceof(IRI);
			triple.object.should.be.instanceof(IRI);

			triple = new NTriple(new BlankNode(), 'rdf:knows', { type: 'bnode', value: 'b1' });
			triple.subject.should.be.instanceof(BlankNode);
			triple.predicate.should.be.instanceof(IRI);
			triple.object.should.be.instanceof(BlankNode);

			triple = new NTriple(new BlankNode(), 'rdf:knows', new BlankNode());
			triple.subject.should.be.instanceof(BlankNode);
			triple.predicate.should.be.instanceof(IRI);
			triple.object.should.be.instanceof(BlankNode);

			triple = new NTriple(new BlankNode(), 'rdf:knows', '_:b3');
			triple.subject.should.be.instanceof(BlankNode);
			triple.predicate.should.be.instanceof(IRI);
			triple.object.should.be.instanceof(BlankNode);

			triple = new NTriple(new BlankNode(), 'rdf:knows', '"plain"');
			triple.subject.should.be.instanceof(BlankNode);
			triple.predicate.should.be.instanceof(IRI);
			triple.object.should.be.instanceof(PlainLiteral);

			triple = new NTriple(new BlankNode(), 'rdf:knows', '"typed"^^xsd:string');
			triple.subject.should.be.instanceof(BlankNode);
			triple.predicate.should.be.instanceof(IRI);
			triple.object.should.be.instanceof(TypedLiteral);

			triple = new NTriple(new BlankNode(), 'rdf:knows', '"lang"@de');
			triple.subject.should.be.instanceof(BlankNode);
			triple.predicate.should.be.instanceof(IRI);
			triple.object.should.be.instanceof(LangLiteral);
		});

		it('should throw InvalidOperation error if specified invalid subject, object, or predicate value', () => {
			(() => new NTriple('"literal"', '_:b1', { type: 'bnode', value: 'b2' })).should.throw(InvalidOperationError);
			(() => new NTriple(new BlankNode(), '_:b1', { type: 'bnode', value: 'b2' })).should.throw(InvalidOperationError);
			(() => new NTriple({ type: 'literal', value: 'Literal', datatype: 'xsd:string' }, '_:b1', { type: 'bnode', value: 'b2' })).should.throw(InvalidOperationError);
			(() => new NTriple({ type: 'typed-literal', value: 'Literal', datatype: 'xsd:string' }, '_:b1', { type: 'bnode', value: 'b2' })).should.throw(InvalidOperationError);
			(() => new NTriple(new BlankNode(), { type: 'bnode', value: 'b2' }, { type: 'bnode', value: 'b2' })).should.throw(InvalidOperationError);
		});
	});

	context('set subject', () => {
		it('should throw ArgumentError if null or undefined', () => {
			(() => triple.subject = null).should.throw(ArgumentError);
			(() => triple.subject = undefined).should.throw(ArgumentError);
		});

		it('should set subject value', () => {
			triple.subject = new BlankNode('b1');
			triple.subject.value.should.equal('b1');
		});
	});

	context('set predicate', () => {
		it('should throw ArgumentError if null or undefined', () => {
			(() => triple.predicate = null).should.throw(ArgumentError);
			(() => triple.predicate = undefined).should.throw(ArgumentError);
		});

		it('should set predicate value', () => {
			triple.predicate = new IRI('rdf:Alice');
			triple.predicate.relativeValue.should.equal('Alice');
		});
	});

	context('set object', () => {
		it('should throw ArgumentError if null or undefined', () => {
			(() => triple.object = null).should.throw(ArgumentError);
			(() => triple.object = undefined).should.throw(ArgumentError);
		});

		it('should set object value', () => {
			triple.object = new BlankNode('b1');
			triple.object.value.should.equal('b1');
		});
	});

	context('skolemize', () => {
		it('should replace blank nodes with skolem iries', () => {
			triple = new NTriple('_:b1', 'rdf:knows', '_:b2');
			triple.skolemize();

			triple.subject.should.be.instanceof(IRI);
			triple.subject.value.should.equal(new IRI('skolem:b1').value);

			triple.object.should.be.instanceof(IRI);
			triple.object.value.should.equal(new IRI('skolem:b2').value);

			triple = new NTriple('http://example.org#Bob', 'http://example.org#knows', 'http://example.org#Alice');
			triple.skolemize();

			triple.subject.should.be.instanceof(IRI);
			triple.subject.value.should.equal('http://example.org#Bob');

			triple.object.should.be.instanceof(IRI);
			triple.object.value.should.equal('http://example.org#Alice');
		});
	});

	context('unskolemize', () => {
		it('should replace skolem iries with blank nodes', () => {
			triple = new NTriple('b1', 'rdf:knows', 'b2');
			triple.skolemize();
			triple.unskolemize();

			triple.subject.should.be.instanceof(BlankNode);
			triple.subject.value.should.equal('b1');

			triple.object.should.be.instanceof(BlankNode);
			triple.object.value.should.equal('b2');

			triple = new NTriple('http://example.org#Bob', 'http://example.org#knows', 'http://example.org#Alice');
			triple.skolemize();
			triple.unskolemize();

			triple.subject.should.be.instanceof(IRI);
			triple.subject.value.should.equal('http://example.org#Bob');

			triple.object.should.be.instanceof(IRI);
			triple.object.value.should.equal('http://example.org#Alice');
		});	
	});

	context('toString()', () => {
		it('should return space separated subject, predicate and object with dot at the and', () => {
			triple = new NTriple('b1', 'http://example.org#knows', 'b2');
			triple.toString().should.equal('_:b1 <http://example.org#knows> _:b2 .');
		});
	});
});