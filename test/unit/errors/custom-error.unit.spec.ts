import 'mocha';
import { expect } from 'chai';

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
				expect(customError.originalMessage).not.to.be.ok;

				customError = Reflect.construct(errorConstructor, [new Error('Error message')]);
				expect(customError.originalMessage).not.to.be.ok;

				customError = Reflect.construct(errorConstructor, ['Error message']);
				expect(customError.originalMessage).to.equal('Error message');
			});

			it('should should set innerError property if provided implicitly or explicitly', () => {
				let customError = Reflect.construct(errorConstructor, []);
				expect(customError.innerError).not.to.be.ok;

				customError = Reflect.construct(errorConstructor, ['Error message']);
				expect(customError.innerError).not.to.be.ok;

				customError = Reflect.construct(errorConstructor, ['Error message', new Error('Explicit inner error')]);
				expect(customError.innerError.message).to.equal('Explicit inner error');

				customError = Reflect.construct(errorConstructor, [new Error('Implicit inner error')]);
				expect(customError.innerError.message).to.equal('Implicit inner error');
			});

			it('should resolve message based on message property and inner error chain', () => {
				let customError = Reflect.construct(errorConstructor, []);
				expect(customError.message).to.equal(errorConstructor.name);

				customError = Reflect.construct(errorConstructor, ['Error message']);
				expect(customError.message).to.equal(`${errorConstructor.name}: Error message`);

				customError = Reflect.construct(errorConstructor, [new Error('Implicit inner error')]);
				expect(customError.message).to.equal(`${errorConstructor.name}: Implicit inner error (Error)`);

				customError = Reflect.construct(errorConstructor, ['Error message', new Error('Inner error message')]);
				expect(customError.message).to.equal(`${errorConstructor.name}: Error message. Inner error message (Error)`);

				customError = Reflect.construct(errorConstructor, ['Error message', Reflect.construct(errorConstructor, ['Inner error 1', new Error()])]);
				expect(customError.message).to.equal(`${errorConstructor.name}: Error message. Inner error 1 (${errorConstructor.name})`);

				customError = Reflect.construct(errorConstructor, ['Error message', Reflect.construct(errorConstructor, ['Inner error 1', new Error('Inner error 2')])]);
				expect(customError.message).to.equal(`${errorConstructor.name}: Error message. Inner error 1 (${errorConstructor.name}). Inner error 2 (Error)`);
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