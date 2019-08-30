import { CustomError } from './custom-error';

export class NotSupportedError extends CustomError {
	public constructor(error?: string | Error, innerError?: Error) {
		super(error, innerError);
	}
}
