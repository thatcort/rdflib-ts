import { NQuad } from '../../model/n-quad';
import { RdfStore } from '../../rdf-store/rdf-store';
import { BlankNode } from '../../model/blank-node';
import { RdfIOManager } from '../../utils/io/rdf-io-manager';
import { ArgumentError } from '../../errors/argument-error';

export interface IRdfDataExporterOptions {
	unskolemize?: boolean;
	blankNodePrefix?: string;
}

export class RdfDataExporter {
	public options: IRdfDataExporterOptions;

	public constructor(options: IRdfDataExporterOptions = {}) {
		this.options = Object.assign({}, { unskolemize: false }, options);
	}

	public async exportRdfDataAsync(dataSource: RdfStore | NQuad[], outSource?: string | RdfStore): Promise<NQuad[]> {
		if (!dataSource) {
			throw new ArgumentError('Can not export null or undefined data source');
		}

		// If data source is rdf store, export quads from it
		// otherwise quads are data source itself 
		let quads: NQuad[] = dataSource instanceof RdfStore ? await dataSource.exportQuadsAsync() : dataSource;

		// Revert blank node replacement if specified in options
		if (this.options.unskolemize) {
			quads.forEach(quad => quad.unskolemize());
		}

		if (this.options.blankNodePrefix) {
			quads.forEach(quad => {
				if (quad.subject instanceof BlankNode) {
					quad.subject.value = `${this.options.blankNodePrefix}${quad.subject.value}`;
				}

				if (quad.object instanceof BlankNode) {
					quad.object.value = `${this.options.blankNodePrefix}${quad.object.value}`;
				}
			});
		}

		// if out source specified, it can be rdf store or file path
		// if it's rdf store import exported quads to target store
		// if it's file path serialize it to file, let rdf io manager deal with format and extension
		if (outSource instanceof RdfStore) {
			await outSource.importQuadsAsync(quads);
		} else if (typeof outSource === 'string') {
			let rdfIoManager = new RdfIOManager();
			await rdfIoManager.serializeAsync(quads, outSource);
		}

		return quads;
	}
}