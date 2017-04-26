import { ArgumentError } from '../errors/argument-error';
import { RdfUtils } from '../utils/rdf/rdf-utils';
import { FormatError } from '../errors/format-error';

export class BlankNode {
	private static _blankNodeCounter: number = 0;
	private _value: string;

	public constructor(value?: string) {
		value = value || `b${BlankNode._blankNodeCounter++}`;
		this.value = value;
	}

	public get value(): string {
		return this._value;
	}

	public set value(value: string) {
		if (!value)	{
			throw new ArgumentError('Blank node value can not be null, undefined or empty string');
		}	

		if (!RdfUtils.isBlankNode(value)) {
			throw new FormatError(`'${value} is not valid blank node value'`);
		}

		this._value = value.replace('_:', '');
	}

	public toString(): string {
		return `_:${this.value}`;
	}
}