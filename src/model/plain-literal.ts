import { RdfUtils } from '../utils/rdf/rdf-utils';
import { ArgumentError } from '../errors/argument-error';
import { InvalidOperationError } from '../errors/invalid-operation-error';
import { SparqlQueryResultBinding } from './sparql-query-result';

export class PlainLiteral {
	protected _value: string;

	public constructor(value: string | SparqlQueryResultBinding) {
		this.value = this.resolveLiteralValue(value);
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

	protected resolveLiteralValue(value: string | SparqlQueryResultBinding): string {
		if (!value) {
			throw new ArgumentError('IRI value can not be null, undefined or empty string');
		}

		if (RdfUtils.isSparqlResultBinding(value)) {
			if (value.type !== 'literal' || !!value.datatype || !!value['xml:lang']) {
				throw new InvalidOperationError(
					`Can not create plain literal from sparql query result binding with type: '${value.type}' (lang: '${value['xml:lang']}, dataType: '${value.datatype}'`
				);
			}

			return value.value;
		}

		return value;
	}
}
