import { InvalidOperationError } from '../errors/invalid-operation-error';
import { RdfUtils } from '../utils/rdf/rdf-utils';
import { ArgumentError } from '../errors/argument-error';
import { PlainLiteral } from './plain-literal';
import { ISparqlQueryResultBinding } from "./sparql-query-result";

export class LangLiteral extends PlainLiteral {
	private _language: string;

	public constructor(value: string | ISparqlQueryResultBinding, language?: string) {
		super(value);
		this.language = language || this.language || 'en';
	}
	
	public get language(): string {
		return this._language;
	}

	public set language(language: string) {
		if (!language) {
			throw new ArgumentError('Literal language can not be null, undefined or empty string');
		}

		this._language = language;
	}

	public get value(): string {
		return this._value;
	}

	public set value(value: string) {
		if (value == null) {
			throw new ArgumentError('Literal value can not be null or undefined');
		}

		let [plain, language] = value.split('"@');

		super.value = plain;
		if (language) {
			this.language = language;
		}
	}
	
	public toString(): string {
		return `${super.toString()}@${this.language}`;
	}

	protected resolveLiteralValue(value: string | ISparqlQueryResultBinding): string {
		if (RdfUtils.isSparqlResultBinding(value)) {
			if (value.type !== 'literal' || !!value.datatype || !value['xml:lang']) {
				throw new InvalidOperationError(`Can not create lang literal from sparql query result binding with type: '${value.type}' (lang: '${value['xml:lang']}, dataType: '${value.datatype}'`);
			}

			this.language = value['xml:lang'];
			return value.value;
		}

		return value;
	}
}