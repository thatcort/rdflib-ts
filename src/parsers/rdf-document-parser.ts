import { PlainLiteral } from '../model/plain-literal';
import { LangLiteral } from '../model/lang-literal';
import { TypedLiteral } from '../model/typed-literal';
import { ArgumentError } from '../errors/argument-error';
import { Literal } from '../model/rdf-core-types';
import * as path from 'path';
import * as fs from 'fs';
import { RdfUtils } from '../utils/rdf/rdf-utils';
import { ReadStream } from 'fs';
import { NQuad } from '../model/n-quad';

export enum RdfDocumentOriginType {
	LocalFile,
	RemoteFile,
	ReadableStream,
	String
}

export interface IRdfDocumentParser {
	parseDocumentAsync(document: string | ReadStream, quadHandler?: (quad: NQuad) => void): Promise<NQuad[]>;
}

export abstract class RdfDocumentParser implements IRdfDocumentParser {
	public abstract parseDocumentAsync(document: string | ReadStream, quadHandler?: (quad: NQuad) => void): Promise<NQuad[]>;

	protected resolveOriginType(document: string | ReadStream): RdfDocumentOriginType {
		if (typeof document !== 'string') {
			return RdfDocumentOriginType.ReadableStream;
		} else if (RdfUtils.isUrl(document)) {
			return RdfDocumentOriginType.RemoteFile;
		} else if (RdfUtils.isLocalFilePath(document)) {
			return RdfDocumentOriginType.LocalFile;
		} else {
			return RdfDocumentOriginType.String;
		}
	}
}