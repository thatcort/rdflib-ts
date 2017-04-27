import { PlainLiteral } from '../../../src/model/plain-literal';
import { ArgumentError } from '../../../src/errors/argument-error';
import { InvalidOperationError } from '../../../src/errors/invalid-operation-error';
import { TypedLiteral } from '../../../src/model/typed-literal';
import { LangLiteral } from '../../../src/model/lang-literal';
import { IRI } from '../../../src/model/iri';
import { BlankNode } from '../../../src/model/blank-node';
import { NTriple } from '../../../src/model/n-triple';
import 'mocha';
import { expect } from 'chai';

describe('NTriple - Unit', () => {
	let triple = new NTriple('rdf:Alice', 'rdf:knows', 'rdf:Bob');

	context('constructor', () => {
		it('should set subject, predicate and object properties', () => {
			triple = new NTriple(new BlankNode(), 'rdf:knows', { type: 'literal', value: 'Literal', 'xml:lang': 'en' });
			expect(triple.subject).to.be.instanceof(BlankNode);
			expect(triple.predicate).to.be.instanceof(IRI);
			expect(triple.object).to.be.instanceof(LangLiteral);

			triple = new NTriple('_:b1', 'rdf:knows', { type: 'literal', value: 'Literal', 'xml:lang': 'en' });
			expect(triple.subject).to.be.instanceof(BlankNode);
			expect(triple.predicate).to.be.instanceof(IRI);
			expect(triple.object).to.be.instanceof(LangLiteral);

			triple = new NTriple({ type: 'bnode', value: 'b1' }, 'rdf:knows', { type: 'literal', value: 'Literal', 'xml:lang': 'en' });
			expect(triple.subject).to.be.instanceof(BlankNode);
			expect(triple.predicate).to.be.instanceof(IRI);
			expect(triple.object).to.be.instanceof(LangLiteral);

			triple = new NTriple({ type: 'uri', value: 'rdf:Alice' }, 'rdf:knows', { type: 'literal', value: 'Literal', 'xml:lang': 'en' });
			expect(triple.subject).to.be.instanceof(IRI);
			expect(triple.predicate).to.be.instanceof(IRI);
			expect(triple.object).to.be.instanceof(LangLiteral);

			triple = new NTriple({ type: 'uri', value: 'rdf:Alice' }, new IRI('rdf:knows'), { type: 'literal', value: 'Literal', 'xml:lang': 'en' });
			expect(triple.subject).to.be.instanceof(IRI);
			expect(triple.predicate).to.be.instanceof(IRI);
			expect(triple.object).to.be.instanceof(LangLiteral);

			triple = new NTriple({ type: 'uri', value: 'rdf:Alice' }, { type: 'uri', value: 'rdf:Alice' }, { type: 'literal', value: 'Literal', 'xml:lang': 'en' });
			expect(triple.subject).to.be.instanceof(IRI);
			expect(triple.predicate).to.be.instanceof(IRI);
			expect(triple.object).to.be.instanceof(LangLiteral);

			triple = new NTriple(new IRI('rdf:Alice'), 'rdf:knows', { type: 'literal', value: 'Literal', datatype: 'xsd:string' });
			expect(triple.subject).to.be.instanceof(IRI);
			expect(triple.predicate).to.be.instanceof(IRI);
			expect(triple.object).to.be.instanceof(TypedLiteral);

			triple = new NTriple(new BlankNode(), 'rdf:knows', { type: 'typed-literal', value: 'Literal', datatype: 'xsd:string' });
			expect(triple.subject).to.be.instanceof(BlankNode);
			expect(triple.predicate).to.be.instanceof(IRI);
			expect(triple.object).to.be.instanceof(TypedLiteral);

			triple = new NTriple(new BlankNode(), 'rdf:knows', { type: 'literal', value: 'Literal' });
			expect(triple.subject).to.be.instanceof(BlankNode);
			expect(triple.predicate).to.be.instanceof(IRI);
			expect(triple.object).to.be.instanceof(PlainLiteral);

			triple = new NTriple(new BlankNode(), 'rdf:knows', { type: 'uri', value: 'rdf:Bob' });
			expect(triple.subject).to.be.instanceof(BlankNode);
			expect(triple.predicate).to.be.instanceof(IRI);
			expect(triple.object).to.be.instanceof(IRI);

			triple = new NTriple(new BlankNode(), 'rdf:knows', { type: 'bnode', value: 'b1' });
			expect(triple.subject).to.be.instanceof(BlankNode);
			expect(triple.predicate).to.be.instanceof(IRI);
			expect(triple.object).to.be.instanceof(BlankNode);

			triple = new NTriple(new BlankNode(), 'rdf:knows', new BlankNode());
			expect(triple.subject).to.be.instanceof(BlankNode);
			expect(triple.predicate).to.be.instanceof(IRI);
			expect(triple.object).to.be.instanceof(BlankNode);

			triple = new NTriple(new BlankNode(), 'rdf:knows', '_:b3');
			expect(triple.subject).to.be.instanceof(BlankNode);
			expect(triple.predicate).to.be.instanceof(IRI);
			expect(triple.object).to.be.instanceof(BlankNode);

			triple = new NTriple(new BlankNode(), 'rdf:knows', '"plain"');
			expect(triple.subject).to.be.instanceof(BlankNode);
			expect(triple.predicate).to.be.instanceof(IRI);
			expect(triple.object).to.be.instanceof(PlainLiteral);

			triple = new NTriple(new BlankNode(), 'rdf:knows', '"typed"^^xsd:string');
			expect(triple.subject).to.be.instanceof(BlankNode);
			expect(triple.predicate).to.be.instanceof(IRI);
			expect(triple.object).to.be.instanceof(TypedLiteral);

			triple = new NTriple(new BlankNode(), 'rdf:knows', '"lang"@de');
			expect(triple.subject).to.be.instanceof(BlankNode);
			expect(triple.predicate).to.be.instanceof(IRI);
			expect(triple.object).to.be.instanceof(LangLiteral);
		});

		it('should throw InvalidOperation error if specified invalid subject, object, or predicate value', () => {
			expect(() => new NTriple('"literal"', '_:b1', { type: 'bnode', value: 'b2' })).to.throw(InvalidOperationError);
			expect(() => new NTriple(new BlankNode(), '_:b1', { type: 'bnode', value: 'b2' })).to.throw(InvalidOperationError);
			expect(() => new NTriple({ type: 'literal', value: 'Literal', datatype: 'xsd:string' }, '_:b1', { type: 'bnode', value: 'b2' })).to.throw(InvalidOperationError);
			expect(() => new NTriple({ type: 'typed-literal', value: 'Literal', datatype: 'xsd:string' }, '_:b1', { type: 'bnode', value: 'b2' })).to.throw(InvalidOperationError);
			expect(() => new NTriple(new BlankNode(), { type: 'bnode', value: 'b2' }, { type: 'bnode', value: 'b2' })).to.throw(InvalidOperationError);
		});
	});

	context('set subject', () => {
		it('should throw ArgumentError if null or undefined', () => {
			expect(() => triple.subject = null).to.throw(ArgumentError);
			expect(() => triple.subject = undefined).to.throw(ArgumentError);
		});

		it('should set subject value', () => {
			triple.subject = new BlankNode('b1');
			expect(triple.subject.value).to.equal('b1');
		});
	});

	context('set predicate', () => {
		it('should throw ArgumentError if null or undefined', () => {
			expect(() => triple.predicate = null).to.throw(ArgumentError);
			expect(() => triple.predicate = undefined).to.throw(ArgumentError);
		});

		it('should set predicate value', () => {
			triple.predicate = new IRI('rdf:Alice');
			expect(triple.predicate.relativeValue).to.equal('Alice');
		});
	});

	context('set object', () => {
		it('should throw ArgumentError if null or undefined', () => {
			expect(() => triple.object = null).to.throw(ArgumentError);
			expect(() => triple.object = undefined).to.throw(ArgumentError);
		});

		it('should set object value', () => {
			triple.object = new BlankNode('b1');
			expect(triple.object.value).to.equal('b1');
		});
	});

	context('skolemize', () => {
		it('should replace blank nodes with skolem iries', () => {
			triple = new NTriple('_:b1', 'rdf:knows', '_:b2');
			triple.skolemize();

			expect(triple.subject).to.be.instanceof(IRI);
			expect(triple.subject.value).to.equal(new IRI('skolem:b1').value);

			expect(triple.object).to.be.instanceof(IRI);
			expect(triple.object.value).to.equal(new IRI('skolem:b2').value);

			triple = new NTriple('http://example.org#Bob', 'http://example.org#knows', 'http://example.org#Alice');
			triple.skolemize();

			expect(triple.subject).to.be.instanceof(IRI);
			expect(triple.subject.value).to.equal('http://example.org#Bob');

			expect(triple.object).to.be.instanceof(IRI);
			expect(triple.object.value).to.equal('http://example.org#Alice');
		});
	});

	context('unskolemize', () => {
		it('should replace skolem iries with blank nodes', () => {
			triple = new NTriple('b1', 'rdf:knows', 'b2');
			triple.skolemize();
			triple.unskolemize();

			expect(triple.subject).to.be.instanceof(BlankNode);
			expect(triple.subject.value).to.equal('b1');

			expect(triple.object).to.be.instanceof(BlankNode);
			expect(triple.object.value).to.equal('b2');

			triple = new NTriple('http://example.org#Bob', 'http://example.org#knows', 'http://example.org#Alice');
			triple.skolemize();
			triple.unskolemize();

			expect(triple.subject).to.be.instanceof(IRI);
			expect(triple.subject.value).to.equal('http://example.org#Bob');

			expect(triple.object).to.be.instanceof(IRI);
			expect(triple.object.value).to.equal('http://example.org#Alice');
		});	
	});

	context('toString()', () => {
		it('should return space separated subject, predicate and object with dot at the and', () => {
			triple = new NTriple('b1', 'http://example.org#knows', 'b2');
			expect(triple.toString()).to.equal('_:b1 <http://example.org#knows> _:b2 .');
		});
	});
});