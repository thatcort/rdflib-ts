import { NQuad } from '../model/n-quad';
import { SparqlQueryResult } from '../model/sparql-query-result';

export abstract class RdfStore {
	storeName: string;
	storeSize: number;

	public constructor(storeName: string) {
		this.storeName = storeName;
		this.storeSize = 0;
	}

	public abstract queryAsync<TResult>(query: string): Promise<SparqlQueryResult<TResult>>;

	public abstract importQuadsAsync(quads: NQuad[]): Promise<void>;

	public abstract exportQuadsAsync(): Promise<NQuad[]>;
}
