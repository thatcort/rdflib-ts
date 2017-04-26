import { ArgumentError } from '../errors/argument-error';
import { RdfUtils } from '../utils/rdf/rdf-utils';

export class PlainLiteral {
	protected _value: string;

	public constructor(value: string) {
		this.value = value;
	}

	public get value(): string {
		return this._value;
	}	
	
	public set value(value: string) {
		if (value == null) {
			throw new ArgumentError('Literal value can not be null or undefined');
		}

		this._value = value.replace(/(^"|"$)/g, '');
	}

	public toString(): string {
		return `"${RdfUtils.escapeLiteral(this.value)}"`;
	}
}