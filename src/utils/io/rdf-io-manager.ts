import * as path from 'path';

import { NQuad } from '../../model/n-quad';
import { RdfStore } from '../../rdf-store/rdf-store';
import { TurtleParser } from '../../parsers/turtle-parser';
import { JsonLDParser } from '../../parsers/jsonld-parser';
import { JsonLDSerializer } from '../../serializers/jsonld-serializer';
import { TurtleSerializer } from '../../serializers/turtle-serializer';
import { NotSupportedError } from '../../errors/not-supported-error';
import { IRdfDataSerializer } from '../../serializers/rdf-data-serializer';
import { IRdfDocumentParser } from '../../parsers/rdf-document-parser';
import { ReadStream, WriteStream } from 'fs';

export class RdfIOManager implements IRdfDocumentParser, IRdfDataSerializer {
	private supportedParsers: Map<string, IRdfDocumentParser>;
	private supportedSerializers: Map<string, IRdfDataSerializer>;

	public constructor() {
		this.supportedParsers = this.initializeDefaultParsers();
		this.supportedSerializers = this.initializeDefaultSerializers();
	}

	public async parseDocumentAsync(document: string | ReadStream, quadHandler?: (quad: NQuad) => void): Promise<NQuad[]> {
		// Get file extension
		let filePath: string = typeof document === 'string' ? document : <string>document.path;
		let fileExtension = path.extname(filePath);

		// Find appropriate parser that can handle extension
		let parser = this.supportedParsers.get(fileExtension);
		if (!parser) {
			throw new NotSupportedError(`Parsing '${filePath}' failed. File extension: '${fileExtension}' is not supported.`);
		}

		// Call resolved parser
		return parser.parseDocumentAsync(filePath, quadHandler);
	}

	public async serializeAsync(quads: NQuad[], output: string | WriteStream): Promise<void> {
		// Get file extension
		let filePath: string = typeof output === 'string' ? output : <string>output.path;
		let fileExtension = path.extname(filePath);

		// Find appropriate serializer that can handle extension
		let serializer = this.supportedSerializers.get(fileExtension);
		if (!serializer) {
			throw new NotSupportedError(`Serializing '${output}' failed. File extension: '${fileExtension}' is not supported.`);
		}

		// Call resolved serializer
		return serializer.serializeAsync(quads, output);
	}

	public registerParser(extension: string, parser: IRdfDocumentParser): void {
		this.supportedParsers.set(extension, parser);
	}

	public registerSerializer(extension: string, serializer: IRdfDataSerializer): void {
		this.supportedSerializers.set(extension, serializer);
	}

	private initializeDefaultParsers(): Map<string, IRdfDocumentParser> {
		return new Map<string, IRdfDocumentParser>([
			['.nt', new TurtleParser()],
			['.nq', new TurtleParser()],
			['.ttl', new TurtleParser()],
			['.trig', new TurtleParser()],
			['.json', new JsonLDParser()],
			['.jsonld', new JsonLDParser()]
		]);
	}

	private initializeDefaultSerializers(): Map<string, IRdfDataSerializer> {
		return new Map<string, IRdfDataSerializer>([
			['.nt', new TurtleSerializer()],
			['.nq', new TurtleSerializer()],
			['.ttl', new TurtleSerializer()],
			['.trig', new TurtleSerializer()],
			['.json', new JsonLDSerializer()],
			['.jsonld', new JsonLDSerializer()]
		]);
	}
}