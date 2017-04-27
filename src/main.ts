import * as path from 'path';
import { RdfDocumentOriginType } from './parsers/rdf-document-parser';
import * as fs from 'fs';
import { JsonLDParser } from './parsers/jsonld-parser';
import { IRI } from './model/iri';
import { NamespaceManager } from './utils/rdf/namespace-manager';
// import { BlankNode } from 'rdflib-ts';


(async () => {
	// Write code to debug
	// let parser = new JsonLDParser();

	// try {
	// 	let stream = fs.readFileSync('test/datasets/jsonld/jsonldparser_testcase1_10quads.json', 'utf-8');
	// 	let quads = await parser.parseDocumentAsync(stream);
		
	// 	let a = 5;
	// } catch (error) {
	// 	console.log(error.message);
	// }

	// console.log(path.delimiter);
	
	process.exit();
})();

