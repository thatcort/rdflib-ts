import { IRI } from './iri';
import { NTriple } from './n-triple';
import { InvalidOperationError } from '../errors/invalid-operation-error';
import { SparqlQueryResultBinding } from './sparql-query-result';
import { RdfObject, RdfPredicate, RdfSubject } from './rdf-core-types';
import { RdfUtils } from '../utils/rdf/rdf-utils';

export class NQuad extends NTriple {
	public graph: IRI;

	public constructor(
		subject: string | RdfSubject | SparqlQueryResultBinding,
		predicate: string | RdfPredicate | SparqlQueryResultBinding,
		object: string | RdfObject | SparqlQueryResultBinding,
		graph?: string | IRI | SparqlQueryResultBinding
	) {
		super(subject, predicate, object);

		if (graph) {
			this.graph = this.resolveGraphValue(graph);
		}
	}

	public toString(): string {
		return this.graph ? super.toString().replace(/\.$/, `${this.graph} .`) : super.toString();
	}

	private resolveGraphValue(value: string | IRI | SparqlQueryResultBinding): IRI {
		if (RdfUtils.isSparqlResultBinding(value)) {
			if (value.type !== 'uri') {
				throw new InvalidOperationError('Rdf graph must be uri');
			}

			return new IRI(value.value);
		}

		if (typeof value === 'string') {
			if (RdfUtils.isIRI(value)) {
				return new IRI(value);
			} else {
				throw new InvalidOperationError('Rdf graph must be uri');
			}
		}

		return value;
	}
}
