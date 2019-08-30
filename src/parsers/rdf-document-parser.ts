import { NotSupportedError } from '../errors/not-supported-error';
import '../utils/promises/promisified';

import * as fs from 'fs';
import * as http from 'superagent';
import * as streamToString from 'stream-to-string';

import { NQuad } from '../model/n-quad';
import { RdfUtils } from '../utils/rdf/rdf-utils';
import { ReadStream } from 'fs';
import { ArgumentError } from '../errors/argument-error';

export interface RdfDocumentParser {
	parseStringAsync?(document: string, quadHandler?: (quad: NQuad) => void): Promise<NQuad[]>;

	parseReadableStreamAsync?(
		document: ReadStream,
		quadHandler?: (quad: NQuad) => void
	): Promise<NQuad[]>;

	parseLocalFileAsync?(document: string, quadHandler?: (quad: NQuad) => void): Promise<NQuad[]>;

	parseRemoteFileAsync?(document: string, quadHandler?: (quad: NQuad) => void): Promise<NQuad[]>;

	parseDocumentAsync(
		document: string | ReadStream,
		quadHandler?: (quad: NQuad) => void
	): Promise<NQuad[]>;
}

export class BaseRdfDocumentParser implements RdfDocumentParser {
	public async parseStringAsync(
		document: string,
		quadHandler?: (quad: NQuad) => void
	): Promise<NQuad[]> {
		return [];
	}

	public async parseReadableStreamAsync(
		document: ReadStream,
		quadHandler?: (quad: NQuad) => void
	): Promise<NQuad[]> {
		const documentContent = await streamToString(document);
		return this.parseStringAsync(documentContent, quadHandler);
	}

	public async parseLocalFileAsync(
		document: string,
		quadHandler?: (quad: NQuad) => void
	): Promise<NQuad[]> {
		const documentContent = await fs.readFileAsync(document, 'utf-8');
		return this.parseStringAsync(documentContent, quadHandler);
	}

	public async parseRemoteFileAsync(
		document: string,
		quadHandler?: (quad: NQuad) => void
	): Promise<NQuad[]> {
		const response = await http.get(document).buffer();

		let documentContent: string;
		if (response.type.startsWith('text/')) {
			documentContent = response.text;
		} else if (response.type === 'application/octet-stream') {
			documentContent = String.fromCharCode.apply(null, response.body);
		} else if (response.type === 'application/json') {
			documentContent = JSON.stringify(response.body);
		} else {
			throw new NotSupportedError(
				`Content type: '${response.type}' is not supported for remote documents`
			);
		}

		return this.parseStringAsync(documentContent, quadHandler);
	}

	public async parseDocumentAsync(
		document: string | ReadStream,
		quadHandler?: (quad: NQuad) => void
	): Promise<NQuad[]> {
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
