import { CustomError } from './custom-error';

export class InvalidOperationError extends CustomError {
	public constructor(error?: string | Error, innerError?: Error) {
		super(error, innerError);
	}
}