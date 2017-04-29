import '../utils/promises/promisified';

import * as fs from 'fs';
import * as http from 'superagent';
import * as jsonld from 'jsonld';
import * as streamToString from 'stream-to-string';

import { NQuad } from '../model/n-quad';
import { RdfFactory } from '../utils/rdf/rdf-factory';
import { ReadStream } from 'fs';
import { RdfDocumentParser } from './rdf-document-parser';
import { NamespaceManagerInstance } from '../utils/rdf/namespace-manager';


export class JsonLDParser extends RdfDocumentParser {

	public async parseStringAsync(document: string, quadHandler?: (quad: NQuad) => void): Promise<NQuad[]> {
		return this.convertToNQuads(JSON.parse(document), quadHandler);
	}

	public async parseReadableStreamAsync(document: ReadStream, quadHandler?: (quad: NQuad) => void): Promise<NQuad[]> {
		let documentContent = await streamToString(<ReadStream>document);
		return this.parseStringAsync(documentContent, quadHandler);
	}

	public async parseLocalFileAsync(document: string, quadHandler?: (quad: NQuad) => void): Promise<NQuad[]> {
		let documentContent = await fs.readFileAsync(document, 'utf-8');
		return this.parseStringAsync(documentContent, quadHandler);
	}

	public async parseRemoteFileAsync(document: string, quadHandler?: (quad: NQuad) => void): Promise<NQuad[]> {
		let response = await http.get(document);
		return this.convertToNQuads(response.body);
	}

	private async convertToNQuads(jsonldObject: any, quadHandler?: (quad: NQuad) => void): Promise<NQuad[]> {
		let parsedQuads: NQuad[] = [];
		let context = jsonldObject['@context'];

		// If there is @context property in json object, register namespaces
		// listed there withing namespace manager instance
		if (context) {
			for (let prefix in context) {
				NamespaceManagerInstance.registerNamespace(prefix, context[prefix]);
			}
		}

		// Parse json ld document and crate n quads
		let dataset = await jsonld.promises.toRDF(jsonldObject);

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

		return parsedQuads;
	}
}