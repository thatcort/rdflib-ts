import { TurtleParser } from './parsers/turtle-parser';
import { ReadStream } from 'tty';
import * as path from 'path';
import * as fs from 'fs';
import { JsonLDParser } from './parsers/jsonld-parser';
import { IRI } from './model/iri';
import { NamespaceManager } from './utils/rdf/namespace-manager';
// import { BlankNode } from 'rdflib-ts';


(async () => {
	// Write code to debug
	let parser = new TurtleParser();

	try {
		
		let quads = await parser.parseDocumentAsync('test/datasets/ttl/turtleparser_testcase2_invalid.ttl');
		
		let a = 5;
	} catch (error) {
		console.log(error.message);
	}

	
	process.exit();
})();

