import { PlainLiteral } from './plain-literal';
import { LangLiteral } from './lang-literal';
import { TypedLiteral } from './typed-literal';
import { InvalidOperationError } from '../errors/invalid-operation-error';
import { ArgumentError } from '../errors/argument-error';
import { RdfObject, RdfPredicate, RdfSubject, RdfTerm } from './rdf-core-types';
import { Namespace } from './namespace';
import { BlankNode } from './blank-node';
import { RdfUtils } from '../utils/rdf/rdf-utils';
import { IRI } from './iri';
import { ISparqlQueryResultBinding } from './sparql-query-result';

export class NTriple {
	protected _subject: RdfSubject;
	protected _predicate: RdfPredicate;
	protected _object: RdfObject;

	public constructor(subject: string | RdfSubject | ISparqlQueryResultBinding, predicate: string | RdfPredicate | ISparqlQueryResultBinding, object: string | RdfObject | ISparqlQueryResultBinding) {
		this.subject = this.resolveSubject(subject);
		this.predicate = this.resolvePredicate(predicate);
		this.object = this.resolveObject(object);
	}

	public get subject(): RdfSubject {
		return this._subject;
	}

	public set subject(value: RdfSubject) {
		if (!value) {
			throw new ArgumentError('Rdf subject value can not be null or undefined');
		}

		this._subject = value;
	}

	public get predicate(): RdfPredicate {
		return this._predicate;
	}

	public set predicate(value: RdfPredicate) {
		if (!value) {
			throw new ArgumentError('Rdf predicate value can not be null or undefined');
		}
		
		this._predicate = value;
	}

	public get object(): RdfObject {
		return this._object;
	}

	public set object(value: RdfObject) {
		if (!value) {
			throw new ArgumentError('Rdf object value can not be null or undefined');
		}
		
		this._object = value;
	}

	public skolemize(): void {
		if (this.subject instanceof BlankNode) {
			this.subject = new IRI(`skolem:${this.subject.value}`);
		}

		if (this.object instanceof BlankNode) {
			this.object = new IRI(`skolem:${this.object.value}`);
		}
	}

	public unskolemize(): void {
		if (RdfUtils.isSkolemIRI(this.subject.value)) {
			this.subject = new BlankNode((<IRI>this.subject).relativeValue);
		}

		if (RdfUtils.isSkolemIRI(this.object.value)) {
			this.object = new BlankNode((<IRI>this.object).relativeValue);
		}
	}

	public toString(): string {
		return `${this.subject} ${this.predicate} ${this.object} .`;
	}

	private resolveSubject(value: string | RdfSubject | ISparqlQueryResultBinding): RdfSubject {
		if (RdfUtils.isSparqlResultBinding(value)) {
			if (value.type === 'literal' || value.type === 'typed-literal') {
				throw new InvalidOperationError('Rdf subject can not be literal');
			}

			return value.type === 'uri' ? new IRI(value.value) : new BlankNode(value.value);
		}

		if (typeof value === 'string') {
			if (RdfUtils.isIRI(value)) {
				return new IRI(value);
			} else if (RdfUtils.isBlankNode(value)) {
				return new BlankNode(value);
			} else {
				throw new InvalidOperationError('Rdf subject can not be literal');
			} 
		}

		return value;
	}

	private resolvePredicate(value: string | RdfPredicate | ISparqlQueryResultBinding): RdfPredicate {
		if (RdfUtils.isSparqlResultBinding(value)) {
			if (value.type !== 'uri') {
				throw new InvalidOperationError('Rdf must be uri');
			}

			return new IRI(value.value);
		}

		if (typeof value === 'string') {
			if (RdfUtils.isIRI(value)) {
				return new IRI(value);
			} else {
				throw new InvalidOperationError('Rdf must be uri');
			} 
		}

		return value;
	}

	private resolveObject(value: string | RdfObject | ISparqlQueryResultBinding): RdfObject {
		if (RdfUtils.isSparqlResultBinding(value)) {
			if (value.type === 'literal' || value.type == 'typed-literal') {
				if (value.datatype) {
					return new TypedLiteral(value.value, value.datatype);
				} else if (value['xml:lang']) {
					return new LangLiteral(value.value, value['xml:lang']);
				} else {
					return new PlainLiteral(value.value);
				}
			}

			return value.type === 'uri' ? new IRI(value.value) : new BlankNode(value.value);
		}

		if (typeof value === 'string') {
			if (RdfUtils.isIRI(value)) {
				return new IRI(value);
			} else if (RdfUtils.isBlankNode(value)) {
				return new BlankNode(value);
			} else if (RdfUtils.isTypedLiteral(value)) {
				return new TypedLiteral(value);
			} else if (RdfUtils.isLangLiteral(value)) {
				return new LangLiteral(value);
			} else {
				return new PlainLiteral(value);
			} 
		}

		return value;
	}
}