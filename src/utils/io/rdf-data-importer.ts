import { IRI } from '../../model/iri';
import { NQuad } from '../../model/n-quad';
import { RdfStore } from '../../rdf-store/rdf-store';
import { BlankNode } from '../../model/blank-node';
import { RdfIOManager } from './rdf-io-manager';
import { ArgumentError } from '../../errors/argument-error';

export interface RdfDataImporterOptions {
	importChunkSize?: number;
	defaultGraph?: IRI;
	skolemize?: boolean;
	blankNodePrefix?: string;
}

export class RdfDataImporter {
	public options: RdfDataImporterOptions;

	public constructor(options: RdfDataImporterOptions = {}) {
		this.options = Object.assign({}, { importChunkSize: 1000, skolemize: false }, options);
	}

	public async importRdfDataAsync(
		dataSource: string | NQuad[],
		targetStore: RdfStore
	): Promise<void> {
		if (!dataSource || !targetStore) {
			throw new ArgumentError('Data source and target store can not be null or undefined');
		}

		// If it's string source, let io manager find appropriate parser
		if (typeof dataSource === 'string') {
			const rdfIoManager = new RdfIOManager();
			dataSource = await rdfIoManager.parseDocumentAsync(dataSource);
		}

		if (this.options.blankNodePrefix) {
			dataSource.forEach(quad => {
				if (quad.subject instanceof BlankNode) {
					quad.subject.value = `${this.options.blankNodePrefix}${quad.subject.value}`;
				}

				if (quad.object instanceof BlankNode) {
					quad.object.value = `${this.options.blankNodePrefix}${quad.object.value}`;
				}
			});
		}

		// Replace blank nodes with skolem iries
		if (this.options.skolemize) {
			dataSource.forEach(quad => quad.skolemize());
		}

		const scheduledImports: Promise<void>[] = [];

		// Chunk array and schedule import for every chunk
		for (let i = 0; i < dataSource.length; i += this.options.importChunkSize) {
			const chunkForImport = dataSource.slice(i, i + this.options.importChunkSize);
			scheduledImports.push(targetStore.importQuadsAsync(chunkForImport));
		}

		// Initialize import in parallel
		await Promise.all(scheduledImports);
	}
}
