export abstract class CustomError extends Error {
	public readonly innerError: Error;
	public readonly originalMessage: string;

	public constructor(error?: string | Error, innerError?: Error) {
		super();

		if (error && error instanceof Error) {
			innerError = error;
		} else if (error && typeof error === 'string') {
			this.originalMessage = error;
		}

		this.innerError = innerError;
		this.setFullErrorMessage(error);
	}

	private setFullErrorMessage(error?: string | Error) {
		let errorMessageBuilder = [];

		if (error && typeof error === 'string') {
			errorMessageBuilder.push(error);
		}

		// Go through inner error chain and push 
		// error messages in string builder array
		// in form of "message (error name)"
		let currentError: any = this.innerError;
		while (currentError) {
			if (currentError.message) {
				let errName = currentError.constructor.name;
				let errMessage = currentError.originalMessage ? currentError.originalMessage : currentError.message;

				errorMessageBuilder.push(`${errMessage} (${errName})`);
			}

			currentError = currentError.innerError;
		}

		// Concatenate all found messages with dot and space
		let errorMessage = errorMessageBuilder.join('. ');
		if (errorMessage !== '') {
			this.message = `${this.constructor.name}: ${errorMessage}`;
		} else {
			this.message = this.constructor.name;
		}
	}
}
