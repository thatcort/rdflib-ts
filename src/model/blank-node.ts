import { InvalidOperationError } from '../errors/invalid-operation-error';
import { ArgumentError } from '../errors/argument-error';
import { RdfUtils } from '../utils/rdf/rdf-utils';
import { FormatError } from '../errors/format-error';
import { ISparqlQueryResultBinding } from './sparql-query-result';

export class BlankNode {
	private static _blankNodeCounter: number = 0;
	private _value: string;

	public constructor(value?: string | ISparqlQueryResultBinding) {				
		this.value = this.resolveBlankNodeValue(value);
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

	private resolveBlankNodeValue(value?: string | ISparqlQueryResultBinding): string {
		if (!value) {
			return `b${BlankNode._blankNodeCounter++}`;
		} else if (RdfUtils.isSparqlResultBinding(value)) {
			if (value.type !== 'bnode') {
				throw new InvalidOperationError(`Can not create blank node from sparql result binding with type: '${value.type}'`);
			}

			return value.value;
		}

		return value;
	}
}