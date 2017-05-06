import { RdfUtils } from '../utils/rdf/rdf-utils';
import { FormatError } from '../errors/format-error';
import { ArgumentError } from '../errors/argument-error';

export class Namespace {
	private _prefix: string;
	private _value: string;

	public constructor(prefix: string, value: string) {
		this.prefix = prefix;
		this.value = value;
	}

	public get prefix(): string {
		return this._prefix;
	}

	public set prefix(prefix: string) {
		if (!prefix) {
			throw new ArgumentError('Namespace prefix can not be null, undefined or empty string');
		}

		this._prefix = prefix;
	}

	public get value(): string {
		return this._value;
	}

	public set value(value: string) {
		if (!value) {
			throw new ArgumentError('Namespace value can not be null, undefined or empty string');
		}

		if (value.startsWith('urn')) {
			this._value = value.endsWith(':') ? value : `${value}:`;
		} else if (RdfUtils.isUrl(value)) {
			this._value = !value.endsWith('#') && !value.endsWith('/') ? `${value}/` : value;
		} else {
			throw new FormatError(`'${value}' is not valid namespace value. It must be valid URN or URL`);
		}
	}
}