import { ReadStream } from 'tty';
import * as path from 'path';
import { RdfDocumentOriginType } from './parsers/rdf-document-parser';
import * as fs from 'fs';
import { JsonLDParser } from './parsers/jsonld-parser';
import { IRI } from './model/iri';
import { NamespaceManager } from './utils/rdf/namespace-manager';
// import { BlankNode } from 'rdflib-ts';


(async () => {
	// Write code to debug
	let parser = new JsonLDParser();

	try {
		
		let stream = fs.createReadStream('kdfjkjk');
		let quads = await (<any>parser).resolveDocumentContentAsync(stream, RdfDocumentOriginType.ReadableStream);
		
		let a = 5;
	} catch (error) {
		console.log(error.message);
	}

	
	process.exit();
})();

