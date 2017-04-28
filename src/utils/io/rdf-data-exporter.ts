import { NQuad } from '../../model/n-quad';
import { RdfStore } from '../../rdf-store/rdf-store';
import { RdfIOManager } from '../../utils/io/rdf-io-manager';

export interface IRdfDataExporterOptions {
	unskolemize?: boolean;
}

export class RdfDataExporter {
	public options: IRdfDataExporterOptions;


	public constructor(options?: IRdfDataExporterOptions) {
		this.options = options || {};
		this.options.unskolemize = this.options.unskolemize || true;
	}

	public exportRdfDataAsync(dataSource: RdfStore | NQuad[], outSource?: string | RdfStore): Promise<NQuad[]> {
		return new Promise<NQuad[]>(async (resolve, reject) => {
			let quads: NQuad[] = [];

			try {
				if (Array.isArray(dataSource)) {
					quads = dataSource;
				} else {
					quads = await dataSource.exportQuadsAsync();
				}

				if (this.options.unskolemize) {
					quads.forEach(quad => quad.unskolemize());
				}

				if (outSource) {
					if (outSource instanceof RdfStore) {
						await outSource.importQuadsAsync(quads);
					} else {
						let rdfIoManager = new RdfIOManager();
						await rdfIoManager.serializeAsync(quads, outSource);
					}
				}

				resolve(quads);
			} catch (err) {
				reject(err);
			}
		});
	}
}