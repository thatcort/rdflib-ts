import * as fs from 'fs';
import * as n3 from 'n3';

import { IRI } from '../model/iri';
import { NQuad } from '../model/n-quad';

import { WriteStream } from 'fs';
import { BaseRdfDataSerializer } from './rdf-data-serializer';

export class TurtleSerializer extends BaseRdfDataSerializer {
	public async serializeAsync(quads: NQuad[], output: string | WriteStream): Promise<void> {
		await this.ensureDirectoryExistsAsync(output);

		// N3Writer works with stream, so create one if file path is specified
		if (typeof output === 'string') {
			output = fs.createWriteStream(output);
		}

		const turtleString = await this.quadsToTurtleStringAsync(quads, output);
		await this.writeToStreamAsync(output, turtleString);
	}

	private quadsToTurtleStringAsync(quads: NQuad[], output: WriteStream): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			// Serialize quads to stream
			const context = this.buildContext(quads);
			const writer = new n3.Writer({ prefixes: context });

			// Since object can be literal with optionally language or datatype tag
			// toString() must be called instead of value property to ensure proper
			// literal formatting in output
			quads.forEach(quad =>
				writer.addTriple({
					subject:
						quad.subject instanceof IRI ? quad.subject.value : quad.subject.toString(),
					predicate: quad.predicate.value,
					object: quad.object instanceof IRI ? quad.object.value : quad.object.toString(),
					graph: quad.graph ? quad.graph.value : undefined
				})
			);

			writer.end((err, res) => {
				// Again workaround for n3 library bug (appends <> to datatype iries in literals)
				return err
					? reject(err)
					: resolve(res.replace(/"\^\^<</g, '"^^<').replace(/>>/g, '>'));
			});
		});
	}
}
