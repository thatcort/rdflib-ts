import { RdfFactory } from '../utils/rdf/rdf-factory';
import { RdfUtils } from '../utils/rdf/rdf-utils';
import { PlainLiteral } from '../model/plain-literal';
import { TypedLiteral } from '../model/typed-literal';
import { LangLiteral } from '../model/lang-literal';
import { ReadStream } from 'fs';
import { InvalidOperationError } from '../errors/invalid-operation-error';
import * as fs from 'fs';
import * as jsonld from 'jsonld';
import * as streamToStream from 'stream-to-string';
import * as http from 'superagent';

import { NQuad } from '../model/n-quad';
import { RdfDocumentParser, RdfDocumentOriginType } from './rdf-document-parser';
import { NamespaceManagerInstance } from '../utils/rdf/namespace-manager';

export class JsonLDParser extends RdfDocumentParser {

	public parseDocumentAsync(document: string | ReadStream, quadHandler?: (quad: NQuad) => void): Promise<NQuad[]> {
		return new Promise<NQuad[]>(async (resolve, reject) => {
			let parsedQuads: NQuad[] = [];
						
			try {
				let originType = this.resolveOriginType(document);
				let jsonldDocument: any = await this.resolveDocumentContentAsync(document, originType);

				let context = jsonldDocument['@context'];

				if (context) {
					for (let prefix in context) {
						NamespaceManagerInstance.registerNamespace(prefix, context[prefix]);
					}
				}

				let dataset = await jsonld.promises.toRDF(jsonldDocument);

				for (let graph in dataset) {
					let triples = dataset[graph];

					for (let triple of triples) {
						let object = triple.object.type === 'literal' ? RdfFactory.createLiteral(triple.object.value, triple.object.language,  triple.object.datatype) : triple.object.value;
						let nQuad = new NQuad(triple.subject.value, triple.predicate.value, object, graph !== '@default' ? graph : undefined);

						parsedQuads.push(nQuad);
						if (quadHandler) {
							quadHandler(nQuad);
						}
					}
				}

				resolve(parsedQuads);
			} catch (err) {
				reject(err);
			}
		});
	}

	private resolveDocumentContentAsync(document: string | ReadStream, documentOriginType?: RdfDocumentOriginType): Promise<any> {
		return new Promise<string>((resolve, reject) => {
			try {
				switch (documentOriginType.valueOf()) {
					case RdfDocumentOriginType.LocalFile: {
						fs.readFile(<string>document, 'utf-8', (err, documentContent) => {
							return err ? reject(err) : resolve(JSON.parse(documentContent));
						});

						break;
					}
					case RdfDocumentOriginType.ReadableStream: {
						streamToStream(<ReadStream>document, (err, documentContent) => {
							return err ? reject(err) : resolve(JSON.parse(documentContent));
						});

						break;
					}
					case RdfDocumentOriginType.RemoteFile: {
						http.get(<string>document, (err, response) => {
							return err ? reject(err) : resolve(response.body);
						});

						break;
					}
					case RdfDocumentOriginType.String: {
						return resolve(JSON.parse(<string>document));
					}
				}
			} catch (error) {
				reject(error);
			}
		});
	}
}