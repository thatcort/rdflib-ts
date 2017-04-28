import { ReadStream, WriteStream } from 'fs';
import * as fs from 'fs';
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

export class RdfIOManager implements IRdfDocumentParser, IRdfDataSerializer {
	private supportedParsers: Map<string, IRdfDocumentParser>;
	private supportedSerializers: Map<string, IRdfDataSerializer>;

	public constructor() {
		this.supportedParsers = new Map<string, IRdfDocumentParser>();
		this.supportedSerializers = new Map<string, IRdfDataSerializer>();

		this.registerParser('.nt', new TurtleParser());
		this.registerParser('.nq', new TurtleParser());
		this.registerParser('.ttl', new TurtleParser());
		this.registerParser('.trig', new TurtleParser());
		this.registerParser('.json', new JsonLDParser());
		this.registerParser('.jsonld', new JsonLDParser());

		this.registerSerializer('.nt', new TurtleSerializer());
		this.registerSerializer('.nq', new TurtleSerializer());
		this.registerSerializer('.ttl', new TurtleSerializer());
		this.registerSerializer('.trig', new TurtleSerializer());
		this.registerSerializer('.json', new JsonLDSerializer());
		this.registerSerializer('.jsonld', new JsonLDSerializer());
	}

	public parseStringAsync(document: string, quadHandler?: (quad: NQuad) => void): Promise<NQuad[]> {
		return this.parseDocumentAsync(document, quadHandler);
	}

	public parseReadableStreamAsync(document: ReadStream, quadHandler?: (quad: NQuad) => void): Promise<NQuad[]> {
		return this.parseDocumentAsync(document, quadHandler);
	}

	public parseLocalFileAsync(document: string, quadHandler?: (quad: NQuad) => void): Promise<NQuad[]> {
		return this.parseDocumentAsync(document, quadHandler);
	}

	public parseRemoteFileAsync(document: string, quadHandler?: (quad: NQuad) => void): Promise<NQuad[]> {
		return this.parseDocumentAsync(document, quadHandler);
	}

	public parseDocumentAsync(document: string | ReadStream, quadHandler?: (quad: NQuad) => void): Promise<NQuad[]> {
		return new Promise<NQuad[]>(async (resolve, reject) => {
			try {
				let filePath: string = typeof document === 'string' ? document : <string>document.path;			
				let fileExtension = path.extname(filePath);
				let parser = this.supportedParsers.get(fileExtension);

				if (!parser) {
					reject(new NotSupportedError(`Parsing '${filePath}' failed. File extension: '${fileExtension}' is not supported.`));
				}

				let quads: NQuad[] = await parser.parseDocumentAsync(filePath, quadHandler);
				resolve(quads);
			} catch (error) {
				reject(error);
			}
		});
	}

    public serializeAsync(quads: NQuad[], output: string | WriteStream): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
			try {
				let filePath: string = typeof output === 'string' ? output : <string>output.path;				
				let fileExtension = path.extname(filePath);
				let serializer = this.supportedSerializers.get(fileExtension);

				if (!serializer) {
					reject(new NotSupportedError(`Serializing '${output}' failed. File extension: '${fileExtension}' is not supported.`));
				}

				await serializer.serializeAsync(quads, output);
				resolve();
			} catch (error) {
				reject(error);
			}
		});
    }

	public registerParser(extension: string, parser: IRdfDocumentParser): void {
		this.supportedParsers.set(extension, parser);
	}

	public registerSerializer(extension: string, serializer: IRdfDataSerializer): void {
		this.supportedSerializers.set(extension, serializer);
	}
}