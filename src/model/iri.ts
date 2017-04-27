import { ArgumentError } from '../errors/argument-error';

import { RdfUtils } from '../utils/rdf/rdf-utils';
import { Namespace } from './namespace';
import { FormatError } from '../errors/format-error';
import { InvalidOperationError } from '../errors/invalid-operation-error';
import { NamespaceManagerInstance } from '../utils/rdf/namespace-manager';
import { ISparqlQueryResultBinding } from "./sparql-query-result";

export class IRI {
	private _value: string;
	private _relativeValue: string;
	private _namespace: Namespace;

	public constructor(value: string | ISparqlQueryResultBinding, namespace?: Namespace) {
		this.value = this.resolveAbsoluteValue(value, namespace);
	}

	public get value(): string {
		return this._value;
	}

	public set value(value: string) {
		if (!value) {
			throw new ArgumentError('IRI value can not be null, undefined or empty string');
		}

		if (RdfUtils.isRelativeIRI(value)) {
			let [namespacePrefix, relativeValue] = value.split(':');
			let namespace = NamespaceManagerInstance.getNamespaceByPrefix(namespacePrefix);

			if (!namespace) {
				throw new InvalidOperationError(`Can not find namespace with prefix: '${namespacePrefix}'`);
			}

			this._value = `${namespace.value}${relativeValue}`;
			this._relativeValue = relativeValue;
			this._namespace = namespace;
		} else if (RdfUtils.isAbsoluteIRI(value)) {
			this._value = value.replace(/(^<|>$)/g, '');
			this.resolveRelativeValue();
			this.resolveNamespace();
		} else {
			throw new FormatError(`'${value}' is not valid IRI value`);
		}
	}

	public get relativeValue(): string {
		return this._relativeValue;
	}

	public get namespace(): Namespace {
		return this._namespace;
	}

	public toString(): string {
		return `<${this.value}>`;
	}

	private resolveNamespace(): void {
		if (!this._namespace) {
			let namespaceValue = this.value.match(/.*(\/#|#|\/)/g)[0].replace(/\/#$/g, '/');
			this._namespace = NamespaceManagerInstance.getNamespaceByValue(namespaceValue) || NamespaceManagerInstance.generateNamespace(namespaceValue);
		}
	}

	private resolveRelativeValue(): void {
		if (!this._relativeValue) {
			let relativeValue = this.value.match(/(?!.*(\/#|#|\/)).+/g)[0];
			this._relativeValue = /\/#/g.test(this.value) ? `#${relativeValue}` : relativeValue;
		}
	}

	private resolveAbsoluteValue(value: string | ISparqlQueryResultBinding, namespace?: Namespace): string {
		if (RdfUtils.isSparqlResultBinding(value)) {
			if (value.type !== 'uri') {
				throw new InvalidOperationError(`Can not create IRI from sparql query result binding of type: '${value.type}'`);
			}

			return value.value;
		}
		
		if (namespace) {
			this._relativeValue = value;
			this._namespace = namespace;
			return `${namespace.value}${value}`;
		}

		return value;
	}
}