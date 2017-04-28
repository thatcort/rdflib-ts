import { JsonLDSerializer } from './serializers/jsonld-serializer';
import { TurtleSerializer } from './serializers/turtle-serializer';
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
	let ttlParser = new TurtleParser();
	let jsonParser = new JsonLDParser();

	let ttlSerializer = new TurtleSerializer();
	let jsonSerializer = new JsonLDSerializer();

	try {
		
		let quads = await ttlParser.parseDocumentAsync('test/datasets/ttl/turtleparser_testcase1_10quads.ttl');
		await jsonSerializer.serializeAsync(quads, 'D:/test/serialized/turtle-to-json-file-input.json');

		quads = await jsonParser.parseDocumentAsync('D:/test/serialized/turtle-to-json-file-input.json');
		await ttlSerializer.serializeAsync(quads, 'D:/test/serialized/json-to-turtle-file-input.ttl');

		let inputStream = fs.createReadStream('test/datasets/ttl/turtleparser_testcase1_10quads.ttl');
		let outputStream = fs.createWriteStream('D:/test/serialized/streams/turtle-to-json-file-input.json');

		quads = await ttlParser.parseDocumentAsync(inputStream);
		await jsonSerializer.serializeAsync(quads, outputStream);
		
		let a = 5;
	} catch (error) {
		console.log(error.message);
	}

	
	process.exit();
})();

