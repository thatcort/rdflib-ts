import * as path from 'path';

import { NQuad } from '../../model/n-quad';
import { TurtleParser } from '../../parsers/turtle-parser';
import { JsonLDParser } from '../../parsers/jsonld-parser';
import { JsonLDSerializer } from '../../serializers/jsonld-serializer';
import { TurtleSerializer } from '../../serializers/turtle-serializer';
import { NotSupportedError } from '../../errors/not-supported-error';
import { ReadStream, WriteStream } from 'fs';
import { RdfDocumentParser } from '../../parsers/rdf-document-parser';
import { RdfDataSerializer } from '../../serializers/rdf-data-serializer';

export class RdfIOManager implements RdfDocumentParser, RdfDataSerializer {
	private supportedParsers: Map<string, RdfDocumentParser>;
	private supportedSerializers: Map<string, RdfDataSerializer>;

	public constructor() {
		this.supportedParsers = this.initializeDefaultParsers();
		this.supportedSerializers = this.initializeDefaultSerializers();
	}

	public async parseDocumentAsync(
		document: string | ReadStream,
		quadHandler?: (quad: NQuad) => void
	): Promise<NQuad[]> {
		// Get file extension
		const filePath = typeof document === 'string' ? document : (document.path as string);
		const fileExtension = path.extname(filePath);

		// Find appropriate parser that can handle extension
		const parser = this.supportedParsers.get(fileExtension);
		if (!parser) {
			throw new NotSupportedError(
				`Parsing '${filePath}' failed. File extension: '${fileExtension}' is not supported.`
			);
		}

		// Call resolved parser
		return parser.parseDocumentAsync(filePath, quadHandler);
	}

	public async serializeAsync(quads: NQuad[], output: string | WriteStream): Promise<void> {
		// Get file extension
		const filePath: string = typeof output === 'string' ? output : (output.path as string);
		const fileExtension = path.extname(filePath);

		// Find appropriate serializer that can handle extension
		const serializer = this.supportedSerializers.get(fileExtension);
		if (!serializer) {
			throw new NotSupportedError(
				`Serializing '${output}' failed. File extension: '${fileExtension}' is not supported.`
			);
		}

		// Call resolved serializer
		return serializer.serializeAsync(quads, output);
	}

	public registerParser(extension: string, parser: RdfDocumentParser): void {
		this.supportedParsers.set(extension, parser);
	}

	public registerSerializer(extension: string, serializer: RdfDataSerializer): void {
		this.supportedSerializers.set(extension, serializer);
	}

	private initializeDefaultParsers(): Map<string, RdfDocumentParser> {
		return new Map<string, RdfDocumentParser>([
			['.nt', new TurtleParser()],
			['.nq', new TurtleParser()],
			['.ttl', new TurtleParser()],
			['.trig', new TurtleParser()],
			['.json', new JsonLDParser()],
			['.jsonld', new JsonLDParser()]
		]);
	}

	private initializeDefaultSerializers(): Map<string, RdfDataSerializer> {
		return new Map<string, RdfDataSerializer>([
			['.nt', new TurtleSerializer()],
			['.nq', new TurtleSerializer()],
			['.ttl', new TurtleSerializer()],
			['.trig', new TurtleSerializer()],
			['.json', new JsonLDSerializer()],
			['.jsonld', new JsonLDSerializer()]
		]);
	}
}
