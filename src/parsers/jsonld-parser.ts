import { ArgumentError } from '../errors/argument-error';
import { RdfFactory } from '../utils/rdf/rdf-factory';
import { RdfUtils } from '../utils/rdf/rdf-utils';
import { PlainLiteral } from '../model/plain-literal';
import { TypedLiteral } from '../model/typed-literal';
import { LangLiteral } from '../model/lang-literal';
import { ReadStream } from 'fs';
import { InvalidOperationError } from '../errors/invalid-operation-error';
import * as fs from 'fs';
import * as jsonld from 'jsonld';
import * as streamToString from 'stream-to-string';
import * as http from 'superagent';

import { NQuad } from '../model/n-quad';
import { RdfDocumentParser } from './rdf-document-parser';
import { NamespaceManagerInstance } from '../utils/rdf/namespace-manager';

export class JsonLDParser extends RdfDocumentParser {

	public parseStringAsync(document: string, quadHandler?: (quad: NQuad) => void): Promise<NQuad[]> {
		return new Promise<NQuad[]>(async (resolve, reject) => {
			let parsedQuads: NQuad[] = [];

			try {
				let jsonldDocument: any = JSON.parse(document);
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
						let object = triple.object.type === 'literal' ? RdfFactory.createLiteral(triple.object.value, triple.object.language, triple.object.datatype) : triple.object.value;
						let nQuad = new NQuad(triple.subject.value, triple.predicate.value, object, graph !== '@default' ? graph : undefined);

						parsedQuads.push(nQuad);
						if (quadHandler) {
							quadHandler(nQuad);
						}
					}
				}

				resolve(parsedQuads);
			} catch (error) {
				reject(error);
			}
		});
	}

	public parseReadableStreamAsync(document: ReadStream, quadHandler?: (quad: NQuad) => void): Promise<NQuad[]> {
		return new Promise<NQuad[]>(async (resolve, reject) => {
			try {
				let documentContent = await streamToString(<ReadStream>document);
				let quads = this.parseStringAsync(documentContent, quadHandler);
				resolve(quads);
			} catch (error) {
				reject(error);
			}
		});
	}

	public parseLocalFileAsync(document: string, quadHandler?: (quad: NQuad) => void): Promise<NQuad[]> {
		return new Promise<NQuad[]>(async (resolve, reject) => {
			fs.readFile(document, 'utf-8', async (err, documentContent) => {
				if (err) {
					return reject(err);
				}

				let quads = await this.parseStringAsync(documentContent, quadHandler);
				resolve(quads);
			});
		});
	}

	public parseRemoteFileAsync(document: string, quadHandler?: (quad: NQuad) => void): Promise<NQuad[]> {
		return new Promise<NQuad[]>(async (resolve, reject) => {
			http.get(document, async (err, response) => {
				if (err) {
					return reject(err);
				}

				let quads = await this.parseStringAsync(JSON.stringify(response.body), quadHandler);
				resolve(quads);
			});
		});
	}
}