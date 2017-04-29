import * as fs from 'fs';
import * as n3 from 'n3';
import * as path from 'path';
import * as mkdirp from 'mkdirp';

import { IRI } from '../model/iri';
import { NQuad } from '../model/n-quad';
import { BlankNode } from '../model/blank-node';
import { RdfFactory } from '../utils/rdf/rdf-factory';
import { WriteStream } from 'fs';
import { RdfDataSerializer } from './rdf-data-serializer';
import { NamespaceManagerInstance } from '../utils/rdf/namespace-manager';

export class TurtleSerializer extends RdfDataSerializer {

	public async serializeAsync(quads: NQuad[], output: string | WriteStream): Promise<void> {
		await this.ensureDirectoryExistsAsync(output);

		// N3Writer works with stream, so create one if file path is specified
		if (typeof output === 'string') {
			output = fs.createWriteStream(output);
		}

		// Serialize quads to stream
		let context = this.buildContext(quads);
		let writer = n3.Writer(output, { prefixes: context });

		// Since object can be literal with optionally language or datatype tag
		// toString() must be called instead of value property to ensure proper
		// literal formatting in output
		quads.forEach(quad => writer.addTriple({
			subject: quad.subject.value,
			predicate: quad.predicate.value,
			object: quad.object instanceof IRI || quad.object instanceof BlankNode ? quad.object.value : quad.object.toString(),
			graph: quad.graph ? quad.graph.value : undefined
		}));

		writer.end();
	}
}