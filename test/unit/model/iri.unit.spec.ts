import 'mocha';
import { expect } from 'chai';

import { IRI } from '../../../src/model/iri';
import { ArgumentError } from '../../../src/errors/argument-error';
import { FormatError } from '../../../src/errors/format-error';
import { InvalidOperationError } from '../../../src/errors/invalid-operation-error';
import { NamespaceManager } from '../../../src/utils/rdf/namespace-manager';

describe('IRI - Unit', () => {
	let iri = new IRI('http://example.org#Alice');
	let manager = new NamespaceManager();

	context('constructor', () => {
		it('should set iri relative, absolute and namespace value', () => {
			let bob = new IRI('http://www.w3.org/1999/02/22-rdf-syntax-ns#Bob');
			expect(bob.namespace.prefix).to.equal('rdf');
			expect(bob.namespace.value).to.equal('http://www.w3.org/1999/02/22-rdf-syntax-ns#');
			expect(bob.relativeValue).to.equal('Bob');
			expect(bob.value).to.equal('http://www.w3.org/1999/02/22-rdf-syntax-ns#Bob');

			let john = new IRI('http://example.org/#John');
			expect(john.relativeValue).to.equal('#John');
			expect(john.value).to.equal('http://example.org/#John');

			let alice = new IRI('Alice', manager.getNamespaceByPrefix('rdf'));
			expect(alice.namespace.prefix).to.equal('rdf');
			expect(alice.namespace.value).to.equal('http://www.w3.org/1999/02/22-rdf-syntax-ns#');
			expect(alice.relativeValue).to.equal('Alice');
			expect(alice.value).to.equal('http://www.w3.org/1999/02/22-rdf-syntax-ns#Alice');
		});
	});

	context('set value', () => {
		it('should throw ArgumentError if null, undefined or empty string provided', () => {
			expect(() => iri.value = null).to.throw(ArgumentError);
			expect(() => iri.value = undefined).to.throw(ArgumentError);
			expect(() => iri.value = '').to.throw(ArgumentError);
		});

		it('should throw FormatError if invalid iri value provided', () => {
			expect(() => iri.value = 'invalid iri value').to.throw(FormatError);
		});

		it('should throw invalid operation error if can not resolve namespace for relative value', () => {
			expect(() => iri.value = 'un:Unknown').to.throw(InvalidOperationError);
		});

		it('should set iri value if format is correct', () => {
			iri.value = 'http://example.org#Alice';
			expect(iri.value).to.equal('http://example.org#Alice');

			iri.value = 'http://example.org/#Alice';
			expect(iri.value).to.equal('http://example.org/#Alice');

			iri.value = 'urn:ISSN:0167-6423';
			expect(iri.value).to.equal('urn:ISSN:0167-6423');

			iri.value = 'rdf:Alice';
			expect(iri.value).to.equal('http://www.w3.org/1999/02/22-rdf-syntax-ns#Alice');
		});

		it('should remove <> from beginning and end of value', () => {
			iri.value = '<http://example.org#>';
			expect(iri.value).to.equal('http://example.org#');

			iri.value = '<urn:ISSN:0167-6423>';
			expect(iri.value).to.equal('urn:ISSN:0167-6423');
		});
	});

	context('toString', () => {
		it('should append < at beginning of IRI value and > at end of it', () => {
			iri.value = 'http://example.org#Alice';
			expect(iri.toString()).to.equal('<http://example.org#Alice>');
		});
	});
});