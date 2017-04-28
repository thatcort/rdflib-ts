import { NQuad } from '../../model/n-quad';
import { IRI } from '../../model/iri';
import { RdfStore } from '../../rdf-store/rdf-store';
import { RdfUtils } from '../../utils/rdf/rdf-utils';
import { Namespace } from '../../model/namespace';
import { ReadStream } from 'fs';
import { RdfIOManager } from '../../utils/io/rdf-io-manager';

export interface IRdfDataImporterOptions {
	importChunkSize?: number;
	defaultGraph?: IRI;
	skolemize?: boolean;
}

export class RdfDataImporter {

	public options: IRdfDataImporterOptions;

	public constructor(options?: IRdfDataImporterOptions) {
		this.options = options || {};
		this.options.importChunkSize = this.options.importChunkSize || 500;
		this.options.skolemize = this.options.skolemize || true;
	}

	public importRdfDataAsync(dataSource: string | NQuad[], store: RdfStore): Promise<void> {
		return new Promise<void>(async (resolve, reject) => {
			try {
				let quads = [];
				let importedQuads = 0;
				let imports = [];

				if (Array.isArray(dataSource)) {
					for (let i = 0; i < dataSource.length; i += this.options.importChunkSize) {
						let quadsLeft = dataSource.length - i;
						let sliceSize = this.options.importChunkSize > quadsLeft ? quadsLeft : this.options.importChunkSize;
						quads = dataSource.slice(i, sliceSize);
						imports.push(store.importQuadsAsync(quads));
						importedQuads += quads.length;
					}
				} else {
					let rdfIoManager = new RdfIOManager();
					await rdfIoManager.parseDocumentAsync(dataSource, (quad) => {
						if (quads.length === this.options.importChunkSize) {
							imports.push(store.importQuadsAsync(quads));
							importedQuads += quads.length;

							quads = [];
						}

						if (this.options.skolemize) {
							quad.skolemize();
						}

						quads.push(quad);
					});

					if (quads.length > 0) {
						imports.push(store.importQuadsAsync(quads));
						importedQuads += quads.length;
						quads = [];
					}

				}

				await Promise.all(imports);
				resolve();
			} catch (error) {
				reject(error);
			}
		});
	}
}