export interface ISparqlQueryResultHead {
    link?: string[],
    vars?: string[]
}

export interface ISparqlQueryResultBinding {
    type: 'uri' | 'bnode' | 'literal' | 'typed-literal',
    value: string,
    datatype?: string,
    'xml:lang'?: string
}

export interface ISparqlQueryResults<TResult> {
    bindings: TResult[]
}

export interface ISparqlQueryResult<TResult> {
    head?: ISparqlQueryResultHead,
    boolean?: boolean,
    results?: ISparqlQueryResults<TResult>
}

export interface ITripleQueryResult {
    subject?: ISparqlQueryResultBinding,
    predicate?: ISparqlQueryResultBinding,
    object?: ISparqlQueryResultBinding
}

export interface IQuadQueryResult extends ITripleQueryResult {
    graph?: ISparqlQueryResultBinding
}

