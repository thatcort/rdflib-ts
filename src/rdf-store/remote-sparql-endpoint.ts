import * as SparqlClient from 'sparql-client-2';

import { NQuad } from '../model/n-quad';
import { NTriple } from '../model/n-triple';
import { RdfStore } from '../rdf-store/rdf-store';
import { RdfFactory } from '../utils/rdf/rdf-factory';
import { IQuadQueryResult, ISparqlQueryResult } from '../model/sparql-query-result';

export class RemoteSparqlEndpoint extends RdfStore {
	private sparqlClient: any;
	public readonly endpointBaseAddress: string;
	public readonly endpointQueryAddress: string;
	public readonly endpointUpdateAddress: string;


	public constructor(storeName: string, endpointBaseAddress: string) {
		super(storeName);

		this.endpointBaseAddress = endpointBaseAddress;
		this.endpointQueryAddress = `${endpointBaseAddress}/${storeName}/sparql`;
		this.endpointUpdateAddress = `${endpointBaseAddress}/${storeName}/update`;

		this.sparqlClient = new SparqlClient(this.endpointQueryAddress, { updateEndpoint: this.endpointUpdateAddress });
	}

	public async importQuadsAsync(quads: NQuad[]): Promise<void> {
		return new Promise<void>(async (resolve, reject) => {
			try {
				let queries = [];
				let graphMap = this.groupQuadsByGraph(quads);

				for (let entry of graphMap.entries()) {
					let query = this.buildInsertQuery(entry[0], entry[1]);
					queries.push(this.queryAsync<any>(query));
				}

				await Promise.all(queries);
				this.storeSize += quads.length;
				resolve();
			} catch (err) {
				reject(err);
			}
		});
	}

	public async exportQuadsAsync(): Promise<NQuad[]> {
		return new Promise<NQuad[]>(async (resolve, reject) => {
			try {
				let queryResult = await this.queryAsync<IQuadQueryResult>(`
						SELECT *
						WHERE
						{
							{
								?subject ?predicate ?object
							}
							UNION
							{
								GRAPH ?graph
								{
									?subject ?predicate ?object
								}		
							}							
						}	
					`);

				let quads = queryResult.results.bindings.map(b => new NQuad(b.subject, b.predicate, b.object, b.graph));
				resolve(quads);
			} catch (err) {
				reject(err);
			}
		});
	}

	public async queryAsync<TResult>(query: string): Promise<ISparqlQueryResult<TResult>> {
		return new Promise<ISparqlQueryResult<TResult>>((resolve, reject) => {
			this.sparqlClient.query(query).execute().then(res => resolve(res)).catch(err => reject(err));
		});
	}

	private groupQuadsByGraph(quads: NQuad[]): Map<string, NTriple[]> {
        let graphMap = new Map<string, NTriple[]>();

        for (let quad of quads) {

            let graphName = quad.graph ? quad.graph.toString() : 'default';

            if (!graphMap.has(graphName)) {
                graphMap.set(graphName, []);
            }

            graphMap.get(graphName).push(quad);
        }

        return graphMap;
    }

	private buildInsertQuery(graph: string, triples: NTriple[]): string {
		let queryBuilder = [];

		queryBuilder.push('INSERT DATA {');

		if (graph !== 'default') {
			queryBuilder.push(`GRAPH ${graph} {`);
		}

		queryBuilder.push(`${triples.map(t => t.toString()).join('\n')}`);

		if (graph !== 'default') {
			queryBuilder.push('}');
		}

		queryBuilder.push('}');

		return queryBuilder.join('');
	}
}