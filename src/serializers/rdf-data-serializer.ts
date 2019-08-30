import '../utils/promises/promisified';

import * as fs from 'fs';
import * as path from 'path';
import * as mkdirp from 'mkdirp';

import { NQuad } from '../model/n-quad';
import { WriteStream } from 'fs';
import { ArgumentError } from '../errors/argument-error';
import { InvalidOperationError } from '../errors/invalid-operation-error';
import { NamespaceManagerInstance } from '../utils/rdf/namespace-manager';

export interface RdfDataSerializer {
	serializeAsync(quads: NQuad[], output: string | WriteStream): Promise<void>;
}

export interface RdfDataSerializerOptions {
	skipUnusedNamespaces?: boolean;
}

export abstract class BaseRdfDataSerializer implements RdfDataSerializer {
	public options: RdfDataSerializerOptions;

	public constructor(options: RdfDataSerializerOptions = {}) {
		this.options = Object.assign({}, { skipUnusedNamespaces: true }, options);
	}

	public abstract serializeAsync(quads: NQuad[], output: string | WriteStream): Promise<void>;

	protected buildContext(quads: NQuad[]): any {
		if (!quads) {
			throw new ArgumentError(
				'Can not build serialization context from null or undefined quad array'
			);
		}

		const context = {};
		let namespaces = NamespaceManagerInstance.getAllNamespaces();

		// Filter namespaces by value used in any of quads
		// This option can have impact on performance if dataset is large
		if (this.options.skipUnusedNamespaces) {
			namespaces = namespaces.filter(n =>
				quads.some(
					q =>
						q.subject.value.indexOf(n.value) != -1 ||
						q.predicate.value.indexOf(n.value) != -1 ||
						q.object.toString().indexOf(n.value) != -1 ||
						(q.graph && q.graph.value.indexOf(n.value) != -1)
				)
			);
		}

		for (const namespace of namespaces) {
			context[namespace.prefix] = namespace.value;
		}

		return context;
	}
	protected async ensureDirectoryExistsAsync(output: string | WriteStream): Promise<void> {
		if (!output) {
			throw new ArgumentError('Can not ensure null or undefined directory exists');
		}

		// Resolve target file path and it's directory
		const filePath = typeof output === 'string' ? output : (output.path as string);
		const dirname = path.dirname(filePath);

		// stats function will throw ENOENT error
		// if directory not exists, which is handled by creating directory
		// if any other error occurs, rethrow it as InvalidOperationError
		try {
			await fs.statAsync(dirname);
		} catch (err) {
			if (err.code === 'ENOENT') {
				await mkdirp.mkdirpAsync(dirname);
			} else {
				throw new InvalidOperationError(err);
			}
		}
	}

	protected writeToStreamAsync(stream: WriteStream, content: string): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			stream.on('finish', () => {
				return resolve();
			});

			stream.on('error', err => {
				return reject(err);
			});

			stream.write(content);
			stream.end();
		});
	}
}
