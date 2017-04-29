import { JsonLDParser } from './parsers/jsonld-parser';

import * as fs from 'fs';
import { TurtleParser } from './parsers/turtle-parser';

import { RdfIOManager } from './utils/io/rdf-io-manager';
import { NQuad } from './model/n-quad';
import { IRI } from './model/iri';
import { BlankNode } from './model/blank-node';
import { TypedLiteral } from './model/typed-literal';
import { NamespaceManagerInstance } from './utils/rdf/namespace-manager';
import { LangLiteral } from './model/lang-literal';
import { PlainLiteral } from './model/plain-literal';

(async () => {
	let ttlParser = new TurtleParser();
	let jsonParser = new JsonLDParser();
	let ioManager = new RdfIOManager();

	let quads = await ioManager.parseDocumentAsync('http://localhost:3033/test/datasets/ttl/turtleparser_testcase1_10quads.ttl');

	process.exit();
})();

