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


	public constructor(storeName: string, endpointBaseAddress: string, queryEndpoint: string = 'sparql', updateEndpoint: string = 'update') {
		super(storeName);

		this.endpointBaseAddress = endpointBaseAddress;
		this.endpointQueryAddress = `${endpointBaseAddress}/${storeName}/${queryEndpoint}`;
		this.endpointUpdateAddress = `${endpointBaseAddress}/${storeName}/${updateEndpoint}`;

		this.sparqlClient = new SparqlClient(this.endpointQueryAddress, { updateEndpoint: this.endpointUpdateAddress });
	}

	public async importQuadsAsync(quads: NQuad[]): Promise<void> {
		let scheduledQueries = [];
		let graphMap = this.groupQuadsByGraph(quads);

		// Schedule update query for every graph independently
		for (let entry of graphMap.entries()) {
			let query = this.buildInsertQuery(entry[0], entry[1]);
			scheduledQueries.push(this.queryAsync<any>(query));
		}

		// Execute update queries in parallel
		await Promise.all(scheduledQueries);
		this.storeSize += quads.length;
	}

	public async exportQuadsAsync(): Promise<NQuad[]> {
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

		return queryResult.results.bindings.map(b => new NQuad(b.subject, b.predicate, b.object, b.graph));
	}

	public queryAsync<TResult>(query: string): Promise<ISparqlQueryResult<TResult>> {
		return this.sparqlClient.query(query).execute();
	}

	private groupQuadsByGraph(quads: NQuad[]): Map<string, NTriple[]> {
		let graphMap = new Map<string, NTriple[]>();

		for (let quad of quads) {
			// If graph is undefined, put it in default graph
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

		queryBuilder.push(`${triples.map(t => `${t.subject} ${t.predicate} ${t.object} .`).join('\n')}`);

		if (graph !== 'default') {
			queryBuilder.push('}');
		}

		queryBuilder.push('}');

		return queryBuilder.join('');
	}
}