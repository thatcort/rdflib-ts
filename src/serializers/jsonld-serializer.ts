import * as fs from 'fs';
import * as jsonld from 'jsonld';

import { NQuad } from '../model/n-quad';
import { WriteStream } from 'fs';
import { BaseRdfDataSerializer } from './rdf-data-serializer';

export class JsonLDSerializer extends BaseRdfDataSerializer {
	public async serializeAsync(quads: NQuad[], output: string | WriteStream): Promise<void> {
		// Parse and compact json ld content
		const context = this.buildContext(quads);
		const document = await jsonld.promises.fromRDF(quads.join('\n'));
		const compacted = await jsonld.promises.compact(document, context);

		// Write to file or stream based on output type
		await this.ensureDirectoryExistsAsync(output);

		if (typeof output === 'string') {
			await fs.writeFileAsync(output, JSON.stringify(compacted, null, 2));
		} else {
			await this.writeToStreamAsync(output, JSON.stringify(compacted, null, 2));
		}
	}
}
