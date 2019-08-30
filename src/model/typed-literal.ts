import { IRI } from './iri';
import { RdfUtils } from '../utils/rdf/rdf-utils';
import { XsdStringIRI } from './constants';
import { PlainLiteral } from './plain-literal';
import { ArgumentError } from '../errors/argument-error';
import { InvalidOperationError } from '../errors/invalid-operation-error';
import { SparqlQueryResultBinding } from './sparql-query-result';

export class TypedLiteral extends PlainLiteral {
	private _dataType: IRI;

	public constructor(value: string | SparqlQueryResultBinding, dataType?: string | IRI) {
		super(value);

		if (dataType && typeof dataType === 'string') {
			this.dataType = new IRI(dataType);
		} else {
			this.dataType = (dataType as IRI) || this.dataType || XsdStringIRI;
		}
	}

	public get dataType(): IRI {
		return this._dataType;
	}

	public set dataType(dataType: IRI) {
		if (!dataType) {
			throw new ArgumentError('Literal data type can not be null or undefined');
		}

		this._dataType = dataType;
	}

	public get value(): string {
		return this._value;
	}

	public set value(value: string) {
		if (value == null) {
			throw new ArgumentError('Literal value can not be null or undefined');
		}

		const [plain, dataType] = value.split('"^^');

		super.value = plain;
		if (dataType) {
			this.dataType = new IRI(dataType);
		}
	}

	public toString(): string {
		return `${super.toString()}^^${this.dataType.toString()}`;
	}

	protected resolveLiteralValue(value: string | SparqlQueryResultBinding): string {
		if (!value) {
			throw new ArgumentError('IRI value can not be null, undefined or empty string');
		}

		if (RdfUtils.isSparqlResultBinding(value)) {
			if (
				(value.type !== 'literal' && value.type !== 'typed-literal') ||
				!value.datatype ||
				!!value['xml:lang']
			) {
				throw new InvalidOperationError(
					`Can not create typed literal from sparql query result binding with type: '${value.type}' (lang: '${value['xml:lang']}, dataType: '${value.datatype}'`
				);
			}

			this.dataType = new IRI(value.datatype);
			return value.value;
		}

		return value;
	}
}
