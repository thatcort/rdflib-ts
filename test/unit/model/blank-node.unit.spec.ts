import { InvalidOperationError } from '../../../src/errors/invalid-operation-error';
import 'mocha';
import { expect } from 'chai';

import { BlankNode } from '../../../src/model/blank-node';
import { FormatError } from '../../../src/errors/format-error';
import { ArgumentError } from '../../../src/errors/argument-error';

describe('BlankNode - Unit', () => {
	let blankNode = new BlankNode();

	context('constructor', () => {
		it('should set blank node value', () => {
			blankNode = new BlankNode('b1');
			expect(blankNode.value).to.equal('b1');

			blankNode = new BlankNode({ type: 'bnode', value: 'b1' });
			expect(blankNode.value).to.equal('b1');
		});

		it('should generate value in form of b plus auto increment if not provided', () => {
			let blankNode1 = new BlankNode();
			let blankNode1Id = parseInt(blankNode1.value.replace('b', ''));

			let blankNode2 = new BlankNode();
			let blankNode2Id = parseInt(blankNode2.value.replace('b', ''));

			expect(blankNode1Id).to.equal(blankNode2Id - 1);
		});

		it('should throw InvalidOperationError if sparql query result binding provided and its type is not bnode', () => {
			expect(() => new BlankNode({ type: 'uri', value: 'b1' })).to.throw(InvalidOperationError);
		});
	});

	context('set value', () => {
		it('should throw ArgumentError if null, undefined or empty string provided', () => {
			expect(() => blankNode.value = null).to.throw(ArgumentError);
			expect(() => blankNode.value = undefined).to.throw(ArgumentError);
			expect(() => blankNode.value = '').to.throw(ArgumentError);
		});

		it('should throw FormatError if invalid blank node value provided', () => {
			expect(() => blankNode.value = 'invalid blank node value').to.throw(FormatError);
		});

		it('should set blank node value if format is correct', () => {
			blankNode.value = 'b1';
			expect(blankNode.value).to.equal('b1');
		});

		it('should remove _: from beginning of blank node value', () => {
			blankNode.value = '_:b1';
			expect(blankNode.value).to.equal('b1');
		});
	});

	context('toString', () => {
		it('should append _: at the beginning of blank node value', () => {
			blankNode.value = 'b1';
			expect(blankNode.toString()).to.equal('_:b1');
		});		
	});
});