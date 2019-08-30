import { IRI } from '../../../src/model/iri';
import { FormatError } from '../../../src/errors/format-error';
import { ArgumentError } from '../../../src/errors/argument-error';
import { NamespaceManager } from '../../../src/utils/rdf/namespace-manager';
import { InvalidOperationError } from '../../../src/errors/invalid-operation-error';

describe('IRI - Unit', () => {
	const iri = new IRI('http://example.org#Alice');
	const manager = new NamespaceManager();

	context('constructor', () => {
		it('should set iri relative, absolute and namespace value', () => {
			const bob = new IRI('http://www.w3.org/1999/02/22-rdf-syntax-ns#Bob');
			bob.namespace.prefix.should.equal('rdf');
			bob.namespace.value.should.equal('http://www.w3.org/1999/02/22-rdf-syntax-ns#');
			bob.relativeValue.should.equal('Bob');
			bob.value.should.equal('http://www.w3.org/1999/02/22-rdf-syntax-ns#Bob');

			const john = new IRI('http://example.org/#John');
			john.relativeValue.should.equal('#John');
			john.value.should.equal('http://example.org/#John');

			const josh = new IRI({
				type: 'uri',
				value: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#Josh'
			});
			josh.namespace.prefix.should.equal('rdf');
			josh.namespace.value.should.equal('http://www.w3.org/1999/02/22-rdf-syntax-ns#');
			josh.relativeValue.should.equal('Josh');
			josh.value.should.equal('http://www.w3.org/1999/02/22-rdf-syntax-ns#Josh');

			const alice = new IRI('Alice', manager.getNamespaceByPrefix('rdf'));
			alice.namespace.prefix.should.equal('rdf');
			alice.namespace.value.should.equal('http://www.w3.org/1999/02/22-rdf-syntax-ns#');
			alice.relativeValue.should.equal('Alice');
			alice.value.should.equal('http://www.w3.org/1999/02/22-rdf-syntax-ns#Alice');
		});

		it('should throw InvalidOperationError if sparql query result binding provided and its type is uri', () => {
			(() => new IRI({ type: 'bnode', value: 'b1' })).should.throw(InvalidOperationError);
		});
	});

	context('set value', () => {
		it('should throw ArgumentError if null, undefined or empty string provided', () => {
			(() => (iri.value = null)).should.throw(ArgumentError);
			(() => (iri.value = undefined)).should.throw(ArgumentError);
			(() => (iri.value = '')).should.throw(ArgumentError);
		});

		it('should throw FormatError if invalid iri value provided', () => {
			(() => (iri.value = 'invalid iri value')).should.throw(FormatError);
		});

		it('should throw invalid operation error if can not resolve namespace for relative value', () => {
			(() => (iri.value = 'un:Unknown')).should.throw(InvalidOperationError);
		});

		it('should set iri value if format is correct', () => {
			iri.value = 'http://example.org#Alice';
			iri.value.should.equal('http://example.org#Alice');

			iri.value = 'http://example.org/#Alice';
			iri.value.should.equal('http://example.org/#Alice');

			iri.value = 'urn:ISSN:0167-6423';
			iri.value.should.equal('urn:ISSN:0167-6423');

			iri.value = 'rdf:Alice';
			iri.value.should.equal('http://www.w3.org/1999/02/22-rdf-syntax-ns#Alice');
		});

		it('should remove <> from beginning and end of value', () => {
			iri.value = '<http://example.org#>';
			iri.value.should.equal('http://example.org#');

			iri.value = '<urn:ISSN:0167-6423>';
			iri.value.should.equal('urn:ISSN:0167-6423');
		});
	});

	context('toString', () => {
		it('should append < at beginning of IRI value and > at end of it', () => {
			iri.value = 'http://example.org#Alice';
			iri.toString().should.equal('<http://example.org#Alice>');
		});
	});
});
