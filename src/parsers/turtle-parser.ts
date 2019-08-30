import * as n3 from 'n3';

import { NQuad } from '../model/n-quad';
import { BaseRdfDocumentParser } from './rdf-document-parser';
import { NamespaceManagerInstance } from '../utils/rdf/namespace-manager';

export class TurtleParser extends BaseRdfDocumentParser {
	public parseStringAsync(
		document: string,
		quadHandler?: (quad: NQuad) => void
	): Promise<NQuad[]> {
		return new Promise<NQuad[]>((resolve, reject) => {
			const triples = [];
			const parsedQuads: NQuad[] = [];
			const parser = new n3.Parser();

			parser.parse(document, (err, triple, prefixes) => {
				if (err) {
					return reject(err);
				}

				// Register namespaces withing namespace manager instance
				// Unfortunately N3Parser provides prefixes at the end
				// so parsed triples must be stored in memory and converted
				// to NQuad object at the end, after namespaces are registered
				if (prefixes) {
					for (const prefix in prefixes) {
						NamespaceManagerInstance.registerNamespace(prefix, prefixes[prefix]);
					}
				}

				if (triple) {
					triples.push(triple);
				} else {
					// This means parsing is finished, time to convert to NQuads
					for (const triple of triples) {
						// Workaround bug in N3Parser
						// It appends _:b(auto incremented number) to blank nodes
						// even if they are valid blank nodes like _:b1
						// regex will just cut that off
						const quad = new NQuad(
							triple.subject.replace(/^_:b[0-9]+_/, '_:'),
							triple.predicate,
							triple.object.replace(/^_:b[0-9]+_/, '_:'),
							triple.graph
						);
						parsedQuads.push(quad);
						if (quadHandler) {
							quadHandler(quad);
						}
					}

					return resolve(parsedQuads);
				}
			});
		});
	}
}
