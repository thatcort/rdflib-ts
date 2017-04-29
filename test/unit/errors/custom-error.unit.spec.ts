import 'mocha';
import * as chai from 'chai';

let should = chai.should();

import { FormatError } from '../../../src/errors/format-error';
import { CustomError } from '../../../src/errors/custom-error';
import { NetworkError } from '../../../src/errors/network-error';
import { ArgumentError } from '../../../src/errors/argument-error';
import { NotSupportedError } from '../../../src/errors/not-supported-error';
import { NotImplementedError } from '../../../src/errors/not-implemented-error';
import { InvalidOperationError } from '../../../src/errors/invalid-operation-error';

let testCustomError = (errorConstructor: Function) => {
	describe(`${errorConstructor.name} - Unit`, () => {
		context('constructor', () => {
			it('should set originalMessage property', () => {
				let customError = Reflect.construct(errorConstructor, []);
				customError.should.not.haveOwnProperty('originalMessage');

				customError = Reflect.construct(errorConstructor, [new Error('Error message')]);
				customError.should.not.haveOwnProperty('originalMessage');

				customError = Reflect.construct(errorConstructor, ['Error message']);
				customError.originalMessage.should.equal('Error message');
			});

			it('should should set innerError property if provided implicitly or explicitly', () => {
				let customError = Reflect.construct(errorConstructor, []);
				should.not.exist(customError.innerError);

				customError = Reflect.construct(errorConstructor, ['Error message']);
				should.not.exist(customError.innerError);

				customError = Reflect.construct(errorConstructor, ['Error message', new Error('Explicit inner error')]);
				customError.innerError.message.should.equal('Explicit inner error');

				customError = Reflect.construct(errorConstructor, [new Error('Implicit inner error')]);
				customError.innerError.message.should.equal('Implicit inner error');
			});

			it('should resolve message based on message property and inner error chain', () => {
				let customError = Reflect.construct(errorConstructor, []);
				customError.message.should.equal(errorConstructor.name);

				customError = Reflect.construct(errorConstructor, ['Error message']);
				customError.message.should.equal(`${errorConstructor.name}: Error message`);

				customError = Reflect.construct(errorConstructor, [new Error('Implicit inner error')]);
				customError.message.should.equal(`${errorConstructor.name}: Implicit inner error (Error)`);

				customError = Reflect.construct(errorConstructor, ['Error message', new Error('Inner error message')]);
				customError.message.should.equal(`${errorConstructor.name}: Error message. Inner error message (Error)`);

				customError = Reflect.construct(errorConstructor, ['Error message', Reflect.construct(errorConstructor, ['Inner error 1', new Error()])]);
				customError.message.should.equal(`${errorConstructor.name}: Error message. Inner error 1 (${errorConstructor.name})`);

				customError = Reflect.construct(errorConstructor, ['Error message', Reflect.construct(errorConstructor, ['Inner error 1', new Error('Inner error 2')])]);
				customError.message.should.equal(`${errorConstructor.name}: Error message. Inner error 1 (${errorConstructor.name}). Inner error 2 (Error)`);
			});
		});
	});
};

testCustomError(ArgumentError);
testCustomError(FormatError);
testCustomError(InvalidOperationError);
testCustomError(NetworkError);
testCustomError(NotImplementedError);
testCustomError(NotSupportedError);