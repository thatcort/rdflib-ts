import * as jsonld from 'jsonld';

import { NQuad } from '../model/n-quad';
import { RdfFactory } from '../utils/rdf/rdf-factory';
import { BaseRdfDocumentParser } from './rdf-document-parser';
import { NamespaceManagerInstance } from '../utils/rdf/namespace-manager';

export class JsonLDParser extends BaseRdfDocumentParser {
	public async parseStringAsync(
		document: string,
		quadHandler?: (quad: NQuad) => void
	): Promise<NQuad[]> {
		const parsedQuads: NQuad[] = [];
		const jsonldObject = JSON.parse(document);
		const context = jsonldObject['@context'];

		// If there is @context property in json object, register namespaces
		// listed there withing namespace manager instance
		if (context) {
			for (const prefix in context) {
				NamespaceManagerInstance.registerNamespace(prefix, context[prefix]);
			}
		}

		// Parse json ld document and crate n quads
		const dataset = await jsonld.promises.toRDF(jsonldObject);

		for (const graph in dataset) {
			const triples = dataset[graph];

			for (const triple of triples) {
				const object =
					triple.object.type === 'literal'
						? RdfFactory.createLiteral(
								triple.object.value,
								triple.object.language,
								triple.object.datatype
						  )
						: triple.object.value;
				const nQuad = new NQuad(
					triple.subject.value,
					triple.predicate.value,
					object,
					graph !== '@default' ? graph : undefined
				);

				parsedQuads.push(nQuad);
				if (quadHandler) {
					quadHandler(nQuad);
				}
			}
		}

		return parsedQuads;
	}
}
