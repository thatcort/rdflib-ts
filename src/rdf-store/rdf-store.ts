import { NQuad } from '../model/n-quad';
import { NTriple } from '../model/n-triple';
import { RdfFactory } from '../utils/rdf/rdf-factory';
import { IQuadQueryResult, ISparqlQueryResult } from '../model/sparql-query-result';

export abstract class RdfStore {
    storeName: string;
    storeSize: number;

    public constructor(storeName: string) {
        this.storeName = storeName;
        this.storeSize = 0;
    }

    public abstract queryAsync<TResult>(query: string): Promise<ISparqlQueryResult<TResult>>;

    public abstract importQuadsAsync(quads: NQuad[]): Promise<void>;

    public abstract exportQuadsAsync(): Promise<NQuad[]>;
}