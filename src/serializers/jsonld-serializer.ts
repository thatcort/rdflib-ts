import * as path from 'path';
import { WriteStream } from 'fs';
import * as fs from 'fs';
import * as jsonld from 'jsonld';

import { NQuad } from '../model/n-quad';
import { RdfFactory } from '../utils/rdf/rdf-factory';
import { IRdfDataSerializer } from './rdf-data-serializer';
import { NamespaceManagerInstance } from '../utils/rdf/namespace-manager';

export class JsonLDSerializer implements IRdfDataSerializer {

	public async serializeAsync(quads: NQuad[], output: string | WriteStream): Promise<void> {
		return new Promise<void>(async (resolve, reject) => {
			try {
				let context = {};
				let namespaces = NamespaceManagerInstance.getAllNamespaces();

				for (let namespace of namespaces.filter(n => n.prefix !== 'skolem')) {
					context[namespace.prefix] = namespace.value;
				}

				let document = await jsonld.promises.fromRDF(quads.join('\n'));
				let compacted = await jsonld.promises.compact(document, context);

				if (typeof output === 'string') {
					let dirname = path.dirname(output);
					fs.exists(dirname, exists => {
						if (!exists) {
							fs.mkdir(dirname, err => {
								if (err) {
									return reject(err);
								}

								fs.writeFile(output, JSON.stringify(compacted, null, 2), (err, res) => {
									err ? reject(err) : resolve(res);
								});
							});
						} else {
							fs.writeFile(output, JSON.stringify(compacted, null, 2), (err, res) => {
								err ? reject(err) : resolve(res);
							});
						}
					});

				} else {
					output.write(compacted);
					output.end();
					resolve();
				}
			} catch (err) {
				reject(err);
			}
		});
	}
}