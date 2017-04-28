import { WriteStream } from 'fs';
import * as n3 from 'n3';
import * as fs from 'fs';
import * as path from 'path';
import * as mkdirp from 'mkdirp';

import { NQuad } from '../model/n-quad';
import { RdfFactory } from '../utils/rdf/rdf-factory';
import { IRdfDataSerializer } from './rdf-data-serializer';
import { NamespaceManagerInstance } from '../utils/rdf/namespace-manager';

export class TurtleSerializer implements IRdfDataSerializer {

	public async serializeAsync(quads: NQuad[], output: string | WriteStream): Promise<void> {
		return new Promise<void>(async (resolve, reject) => {
			try {
				let context = {};
				let namespaces = NamespaceManagerInstance.getAllNamespaces();

				for (let namespace of namespaces.filter(n => n.prefix !== 'skolem')) {
					context[namespace.prefix] = namespace.value;
				}

				let filePath = typeof output === 'string' ? output : <string>output.path;
				let dirname = path.dirname(filePath);
				fs.exists(dirname, exists => {
					if (!exists) {
						mkdirp(dirname, err => {
							if (err) {
								return reject(err);
							}

							if (typeof output === 'string') {
								output = fs.createWriteStream(output);
							}

							let writer = n3.Writer(output, { prefixes: context });
							quads.forEach(quad => writer.addTriple({
								subject: quad.subject.toString().replace(/(^<|\^\^<|>$)/g, ''),
								predicate: quad.predicate.toString().replace(/(^<|\^\^<|>$)/g, ''),
								object: quad.object.toString().replace(/(^<|\^\^<|>$)/g, ''),
								graph: quad.graph ? quad.graph.toString().replace(/(^<|\^\^<|>$)/g, '') : undefined
							}));

							writer.end((err, result) => {
								err ? reject(err) : resolve(result);
							});
						});
					} else {
						if (typeof output === 'string') {
							output = fs.createWriteStream(output);
						}

						let writer = n3.Writer(output, { prefixes: context });
						quads.forEach(quad => writer.addTriple({
							subject: quad.subject.toString().replace(/(^<|\^\^<|>$)/g, ''),
							predicate: quad.predicate.toString().replace(/(^<|\^\^<|>$)/g, ''),
							object: quad.object.toString().replace(/(^<|\^\^<|>$)/g, ''),
							graph: quad.graph ? quad.graph.toString().replace(/(^<|\^\^<|>$)/g, '') : undefined
						}));

						writer.end((err, result) => {
							err ? reject(err) : resolve(result);
						});
					}
				});

			} catch (err) {
				reject(err);
			}
		});
	}
}