import { BlankNode } from '../../../src/model/blank-node';
import { FormatError } from '../../../src/errors/format-error';
import { ArgumentError } from '../../../src/errors/argument-error';
import { InvalidOperationError } from '../../../src/errors/invalid-operation-error';

describe('BlankNode - Unit', () => {
	let blankNode = new BlankNode();

	context('constructor', () => {
		it('should set blank node value', () => {
			blankNode = new BlankNode('b1');
			blankNode.value.should.equal('b1');

			blankNode = new BlankNode({ type: 'bnode', value: 'b1' });
			blankNode.value.should.equal('b1');
		});

		it('should generate value in form of b plus auto increment if not provided', () => {
			const blankNode1 = new BlankNode();
			const blankNode1Id = parseInt(blankNode1.value.replace('b', ''));

			const blankNode2 = new BlankNode();
			const blankNode2Id = parseInt(blankNode2.value.replace('b', ''));

			blankNode1Id.should.equal(blankNode2Id - 1);
		});

		it('should throw InvalidOperationError if sparql query result binding provided and its type is not bnode', () => {
			() => new BlankNode({ type: 'uri', value: 'b1' }).should.throw(InvalidOperationError);
		});
	});

	context('set value', () => {
		it('should throw ArgumentError if null, undefined or empty string provided', () => {
			(() => (blankNode.value = null)).should.throw(ArgumentError);
			(() => (blankNode.value = undefined)).should.throw(ArgumentError);
			(() => (blankNode.value = '')).should.throw(ArgumentError);
		});

		it('should throw FormatError if invalid blank node value provided', () => {
			(() => (blankNode.value = 'invalid blank node value')).should.throw(FormatError);
		});

		it('should set blank node value if format is correct', () => {
			blankNode.value = 'b1';
			blankNode.value.should.equal('b1');
		});

		it('should remove _: from beginning of blank node value', () => {
			blankNode.value = '_:b1';
			blankNode.value.should.equal('b1');
		});
	});

	context('toString', () => {
		it('should append _: at the beginning of blank node value', () => {
			blankNode.value = 'b1';
			blankNode.toString().should.equal('_:b1');
		});
	});
});
