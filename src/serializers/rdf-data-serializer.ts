import '../utils/promises/promisified';

import * as fs from 'fs';
import * as path from 'path';
import * as mkdirp from 'mkdirp';

import { NQuad } from '../model/n-quad';
import { WriteStream } from 'fs';
import { ArgumentError } from '../errors/argument-error';
import { InvalidOperationError } from '../errors/invalid-operation-error';
import { NamespaceManagerInstance } from '../utils/rdf/namespace-manager';

export interface IRdfDataSerializer {
	serializeAsync(quads: NQuad[], output: string | WriteStream): Promise<void>;
}

export abstract class RdfDataSerializer implements IRdfDataSerializer {
	public abstract serializeAsync(quads: NQuad[], output: string | WriteStream): Promise<void>;

	protected buildContext(quads: NQuad[]): any {
		if (!quads) {
			throw new ArgumentError('Can not build serialization context from null or undefined quad array');
		}

		let context = {};
		let namespaces = NamespaceManagerInstance.getAllNamespaces();

		// Use all registered namespaces in namespace manager for JsonLD context
		// There can surplus namespaces, but for now they are serialized all as context
		// Checking if namespace prefix is used in any of quads can have 
		// huge performance impact for large datasets
		for (let namespace of namespaces.filter(n => n.prefix !== 'skolem')) {
			context[namespace.prefix] = namespace.value;
		}

		return context;
	}

	protected async ensureDirectoryExistsAsync(output: string | WriteStream): Promise<void> {
		if (!output) {
			throw new ArgumentError('Can not ensure null or undefined directory exists');
		}

		// Resolve target file path and it's directory
		let filePath = typeof output === 'string' ? output : <string>output.path;
		let dirname = path.dirname(filePath);

		// stats function will throw ENOENT error
		// if directory not exists, which is handled by creating directory
		// if any other error occurs, rethrow it as InvalidOperationError
		try {
			let stats = await fs.statAsync(dirname);
		} catch (err) {
			if (err.code === 'ENOENT') {
				await mkdirp.mkdirpAsync(dirname);
			} else {
				throw new InvalidOperationError(err);
			}
		}
	}
}