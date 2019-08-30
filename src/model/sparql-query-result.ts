export interface SparqlQueryResultHead {
	link?: string[];
	vars?: string[];
}

export interface SparqlQueryResultBinding {
	type: 'uri' | 'bnode' | 'literal' | 'typed-literal';
	value: string;
	datatype?: string;
	'xml:lang'?: string;
}

export interface SparqlQueryResults<TResult> {
	bindings: TResult[];
}

export interface SparqlQueryResult<TResult> {
	head?: SparqlQueryResultHead;
	boolean?: boolean;
	results?: SparqlQueryResults<TResult>;
}

export interface TripleQueryResult {
	subject?: SparqlQueryResultBinding;
	predicate?: SparqlQueryResultBinding;
	object?: SparqlQueryResultBinding;
}

export interface QuadQueryResult extends TripleQueryResult {
	graph?: SparqlQueryResultBinding;
}
