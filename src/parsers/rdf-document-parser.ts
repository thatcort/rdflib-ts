import { NQuad } from '../model/n-quad';
import { RdfUtils } from '../utils/rdf/rdf-utils';
import { ReadStream } from 'fs';
import { ArgumentError } from '../errors/argument-error';

export interface IRdfDocumentParser {
	parseStringAsync?(document: string, quadHandler?: (quad: NQuad) => void): Promise<NQuad[]>;

	parseReadableStreamAsync?(document: ReadStream, quadHandler?: (quad: NQuad) => void): Promise<NQuad[]>;

	parseLocalFileAsync?(document: string, quadHandler?: (quad: NQuad) => void): Promise<NQuad[]>;

	parseRemoteFileAsync?(document: string, quadHandler?: (quad: NQuad) => void): Promise<NQuad[]>;

	parseDocumentAsync(document: string | ReadStream, quadHandler?: (quad: NQuad) => void): Promise<NQuad[]>;
}

export abstract class RdfDocumentParser implements IRdfDocumentParser {
	public abstract parseStringAsync(document: string, quadHandler?: (quad: NQuad) => void): Promise<NQuad[]>;

	public abstract parseReadableStreamAsync(document: ReadStream, quadHandler?: (quad: NQuad) => void): Promise<NQuad[]>;

	public abstract parseLocalFileAsync(document: string, quadHandler?: (quad: NQuad) => void): Promise<NQuad[]>;

	public abstract parseRemoteFileAsync(document: string, quadHandler?: (quad: NQuad) => void): Promise<NQuad[]>;

	public async parseDocumentAsync(document: string | ReadStream, quadHandler?: (quad: NQuad) => void): Promise<NQuad[]> {
		if (!document) {
			throw new ArgumentError('Document can not be null, undefined or empty string');
		} 
		
		if (typeof document !== 'string') {
			return this.parseReadableStreamAsync(document, quadHandler);
		} else if (document.startsWith('http://')) {
			return this.parseRemoteFileAsync(document, quadHandler);
		} else if (RdfUtils.isLocalFilePath(document)) {
			return this.parseLocalFileAsync(document, quadHandler);
		} else {
			return this.parseStringAsync(document, quadHandler);
		}
	}
}