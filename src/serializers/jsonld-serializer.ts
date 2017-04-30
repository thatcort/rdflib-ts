import * as fs from 'fs';
import * as path from 'path';
import * as jsonld from 'jsonld';
import * as mkdirp from 'mkdirp';

import { NQuad } from '../model/n-quad';
import { RdfFactory } from '../utils/rdf/rdf-factory';
import { WriteStream } from 'fs';
import { RdfDataSerializer } from './rdf-data-serializer';
import { NamespaceManagerInstance } from '../utils/rdf/namespace-manager';

export class JsonLDSerializer extends RdfDataSerializer {
	public async serializeAsync(quads: NQuad[], output: string | WriteStream): Promise<void> {
		// Parse and compact json ld content
		let context = this.buildContext(quads);
		let document = await jsonld.promises.fromRDF(quads.join('\n'));
		let compacted = await jsonld.promises.compact(document, context);

		// Write to file or stream based on output type
		await this.ensureDirectoryExistsAsync(output);
		
		if (typeof output === 'string') {
			await fs.writeFileAsync(output, JSON.stringify(compacted, null, 2));
		} else {
			await this.writeToStreamAsync(output, JSON.stringify(compacted, null, 2));
		}
	}
}