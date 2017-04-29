# RDFLib.ts

Typescript implementation of basic RDF model, utils and rdf store with SPARQL 1.1 support.
This library is work in progress. Contributions are very welcome. Main goal is to implement in memory rdf store with SPARQL 1.1 support. 

## Installation
---

`npm install --save rdflib-ts`

## Usage
---

##### RDF Model
RDFLib.ts contains set of model classes which can be used to represent rdf terms. 
###### Available model classes:
* BlankNode
* IRI
* PlainLiteral
* LangLiteral
* TypedLiteral
* Namespace
* NTriple
* NQuad

Each rdf term model class (BlankNode, IRI, PlainLiteral, LangLiteral, TypedLiteral) has `value` property and overrides `toSting()` which return RDF formatted value. 

###### Example 1: Using model classes
```typescript
import { NamespaceManagerInstance, BlankNode, IRI, TypedLiteral, LangLiteral, NTriple, NQuad } from 'rdflib-ts';

NamespaceManagerInstance.registerNamespace('ex', 'http://example.org#');
	
let alice = new IRI('ex:Alice');
console.log(alice.toString()); // <http://example.org#Alice>
console.log(alice.namespace.value); // http://example.org#
console.log(alice.relativeValue); // Alice

let knows = new IRI('ex:knows');
console.log(knows.toString()); // <http://example.org#knows>
console.log(knows.namespace.value); // http://example.org#
console.log(knows.relativeValue); // knows

let anonymous = new BlankNode('b1');
console.log(anonymous.toString()); // _:b1

let about = new IRI('ex:about');
console.log(about.toString()); // <http://example.org#about>
console.log(about.namespace.value); // http://example.org#
console.log(about.relativeValue); // about

let aboutAlice = new LangLiteral('Alice is some random girl', 'de');
console.log(aboutAlice.toString()); // "Alice is some random girl"@de

let age = new IRI('ex:age');
console.log(age.toString()); // <http://example.org#age>
console.log(age.namespace.value); // http://example.org#
console.log(age.relativeValue); // age

let aliceAge = new TypedLiteral('24', 'xsd:integer');
console.log(aliceAge.toString()); // "24"^^<http://www.w3.org/2001/XMLSchema#integer>

let exampleGraph = new IRI('ex:graph');
console.log(exampleGraph.toString()); // <http://example.org#graph>
console.log(exampleGraph.namespace.value); // http://example.org#
console.log(exampleGraph.relativeValue); // graph

let triple = new NTriple(alice, knows, anonymous);
console.log(triple.toString()); // <http://example.org#Alice> <http://example.org#knows> _:b1 .

let quad = new NQuad(alice, about, aboutAlice, exampleGraph);
console.log(quad.toString()); // <http://example.org#Alice> <http://example.org#about> "Alice is some random girl"@de <http://example.org#graph> .
```

###### Example 2: Different BlankNode usage scenarios
```typescript
import { BlankNode } from 'rdflib-ts';

let blankNode1 = new BlankNode('blankNode1');
console.log(blankNode1.value); // blankNode1
console.log(blankNode1.toString()); // _:blankNode1

// If value contains _: it will be removed, in memory term values
// don't contain RDF serialization artifacts, there are appended during serialization
let blankNode2 = new BlankNode('_:blankNode2');
console.log(blankNode2.value); // blankNode2
console.log(blankNode2.toString()); // _:blankNode2

// If no value provided, it will be generated (auto incremented)
let b0 = new BlankNode();
console.log(b0.value); // b0
console.log(b0.toString()); // _:b0

let b1 = new BlankNode();
console.log(b1.value); // b1
console.log(b1.toString()); // _:b1

let invalidBlankNode = new BlankNode('11#.00--'); // Throws FormatError
```

###### Example 3: Different IRI usage scenarios
```typescript
import { IRI } from 'rdflib-ts';

// When using this form, target namespace must be registered within
// NamespaceManagerInstance in order to be resolve. XSD, RDF and RDFS
// are registered by default
let fromRelative = new IRI('xsd:integer');
console.log(fromRelative.toString()); // <http://www.w3.org/2001/XMLSchema#integer>
console.log(fromRelative.namespace.value); // http://www.w3.org/2001/XMLSchema#
console.log(fromRelative.relativeValue); // integer

let explicitNamespace = new IRI('Alice', new Namespace('ex', 'http://example.org#'));
console.log(explicitNamespace.toString()); // <http://example.org#Alice>
console.log(explicitNamespace.namespace.value); // http://example.org#
console.log(explicitNamespace.relativeValue); // Alice

// If namespace resolved from absolute value does not exist
// It will be created, but prefix will be auto generated
let fromAbsolute = new IRI('http://example.org#Alice');
console.log(fromAbsolute.toString()); // <http://example.org#Alice>
console.log(fromAbsolute.namespace.value); // http://example.org#
console.log(fromAbsolute.relativeValue); // Alice

// If value is within <> it will be removed, in memory term values
// don't contain RDF serialization artifacts, there are appended during serialization
let fromAbsoluteRdf = new IRI('<http://example.org#Alice>');
console.log(fromAbsoluteRdf.value); // http://example.org#Alice
console.log(fromAbsolute.toString()); // <http://example.org#Alice>
console.log(fromAbsolute.namespace.value); // http://example.org#
console.log(fromAbsolute.relativeValue); // Alice

let invalid1 = new IRI('#####'); // Throws FormatError
```

###### Example 4: Different literal usage scenarios
```typescript
import { PlainLiteral, TypedLiteral, LangLiteral } from 'rdflib-ts';

let plain = new PlainLiteral('This is plain literal');
console.log(plain.toString()); // "This is plain literal"

// If value is double quoted it will be removed, in memory term values
// don't contain RDF serialization artifacts, there are appended during serialization
let plainRdf = new PlainLiteral('"This is plain literal"');
console.log(plain.value); // This is plain literal
console.log(plain.toString()); // "This is plain literal"

// If not specified, default value for data type is xsd:string
let typedDefault = new TypedLiteral('This is typed literal');
console.log(typedDefault.toString()); // "This is typed literal"^^<http://www.w3.org/2001/XMLSchema#string>

let explicitType = new TypedLiteral('This is typed literal', 'xsd:string');
console.log(explicitType.toString()); // "This is typed literal"^^<http://www.w3.org/2001/XMLSchema#string>

let explicitType1 = new TypedLiteral('This is typed literal', new IRI('xsd:string'));
console.log(explicitType.toString()); // "This is typed literal"^^<http://www.w3.org/2001/XMLSchema#string>

let implicitType = new TypedLiteral('"This is typed literal"^^xsd:string');
console.log(implicitType.toString()); // "This is typed literal"^^<http://www.w3.org/2001/XMLSchema#string>

// If not specified, default value for language is en
let langDefault = new LangLiteral('This is lang literal');
console.log(langDefault.toString()); // "This is lang literal"@en

let explicitLang = new LangLiteral('This is lang literal', 'en');
console.log(explicitLang.toString()); // "This is lang literal"@en

let implicitLang = new LangLiteral('"This is lang literal"@en');
console.log(implicitLang.toString()); // "This is lang literal"@en
```

###### Example 5: Different NTriple/NQuad usage scenarios
```typescript
import { NamespaceManagerInstance, NQuad } from 'rdflib-ts';

// Register prefix to use in application scope
NamespaceManagerInstance.registerNamespace('ex', 'http://example.org#');

// NTriple and NQuad constructor can handle string values instead of 
// passing BlankNode, IRI, and Literal instances
let quad = new NQuad('ex:Alice', 'ex:knows', 'ex:Bob', 'ex:namedGraph');
console.log(quad.toString()); // <http://example.org#Alice> <http://example.org#knows> <http://example.org#Bob> <http://example.org#namedGraph> .

// NTriple or NQuad can be "skolemized" (blank nodes replaced with iries)
quad = new NQuad('b1', 'ex:knows', 'b2');
console.log(quad.toString()); // _:b1 <http://example.org#knows> _:b2 .

quad.skolemize();
console.log(quad.toString()); // <https://bitbucket.org/vladimir_djurdjevic/rdflib.ts/.well-known/genid/b1> <http://example.org#knows> <https://bitbucket.org/vladimir_djurdjevic/rdflib.ts/.well-known/genid/b2> .

// When unskolemized, blank nodes are preserved
quad.unskolemize();
console.log(quad.toString()); // _:b1 <http://example.org#knows> _:b2 .
```

##### Parsing/Serializing data
RDFLib.ts provides `RdfIOManager` class which can be used to parse or serialize RDF data. Currently supported formats are Turtle family formats (.nt, .nq, ttl, trig, n3) which are handled with https://github.com/RubenVerborgh/N3.js library, and JsonLD format handled with https://github.com/digitalbazaar/jsonld.js/ library. Support for RDF/XML will be added later. If you need to handle custom format, appropriate parser/serializer can be registered using `RdfIOManager.registerParser(extension: string, parser: IRdfDocumentParser)` and `RdfIOManager.registerSerializer(extension: string, serializer: IRdfDataSerializer)` methods. If target format is supported, parsing and serialization can be done using `RdfIOManager.parseDocumentAsync(filePath: string, quadHandler?: (quad: NQuad) => void)` and `RdfIOManager.serializeAsync(quads: NQuad[], outFilePath: string)` methods. Both methods are asynchronous and promise based. `quadHandler?: (quad: NQuad) => void` is optional callback function which (if provided), gets called after each parsed quad.  

###### Example 1: Parsing and serializing with different formats
```typescript
import { RdfIOManager, NQuad } from 'rdflib-ts';

let IOManager = new RdfIOManager();

try {
	// Parse JsonLD document and serialize it back to equivalent TriG document.
	let quads: NQuad[] = await IOManager.parseDocumentAsync('D:/vladimir_djurdjevic/shacl_1_4_example_data_graph.json', quad => console.log(quad.toString()));
	await IOManager.serializeAsync(quads, 'D:/vladimir_djurdjevic/shacl_1_4_example_data_graph.trig');

	// Parse Turtle document and serialize it back to equivalent JsonLD document.
	// Not using quad handler now
	quads = await IOManager.parseDocumentAsync('D:/vladimir_djurdjevic/shacl_1_4_example_data_graph.ttl');
	await IOManager.serializeAsync(quads, 'D:/vladimir_djurdjevic/shacl_1_4_example_data_graph.jsonld');
} catch (error) {
	console.log(error.message);
}
```

##### RDF Store
For now only `RemoteSparqlEndpoint` version is implemented. As already pointed out, main goal is to implement `InMemoryRdfStore` version. `RemoteSparqlEndpoint` just a proxy to remote SPARQL endpoint which can be queried using SPARQL 1.1 query language. It uses https://github.com/eddieantonio/node-sparql-client library to send SPARQL queries over http to target RDF store. RDF store can be used to import /export quads. If you want to import whole document, or export quads from store to document, you can use `RdfDataImporter` and `RdfDataExporter` classes.

###### Example 1: RemoteSparqlEndpoint usage
```typescript
import { NQuad, RemoteSparqlEndpoint } from 'rdflib-ts';

// Register prefix to use in application scope
NamespaceManagerInstance.registerNamespace('ex', 'http://example.org#');

// Apache Jena Fuseki server running on localhost:3030
// There is TestStore created on server
let remoteEndpoint = new RemoteSparqlEndpoint('TestStore', 'http://localhost:3030');

try {
	await remoteEndpoint.importQuadsAsync([new NQuad('ex:Alice', 'ex:knows', 'ex:Bob')]);

	// Interface ISparqlQueryResult<IQuadQueryResult> can be used for intellisense
	// ISparqlQueryResult format is defined in https://www.w3.org/TR/sparql11-results-json/
	// IQuadQueryResult defines shape of one binding, matches variables returned by query
	let queryResult: ISparqlQueryResult<IQuadQueryResult> = await remoteEndpoint.queryAsync<IQuadQueryResult>('SELECT * WHERE { ?subject ?predicate ?object }');

	// There is only one result, previously imported
	for (let result of queryResult.results.bindings) {
		console.log(result.subject.value); // http://example.org#Alice
		console.log(result.predicate.value); // http://example.org#knows
		console.log(result.object.value); // http://example.org#Bob
	}

} catch (error) {
	console.log(error.message);
}
```

###### Example 2: RdfDataExporter and RdfDataImporter usage
```typescript
import { NQuad, RemoteSparqlEndpoint, RdfDataExporter, RdfDocumentImporter } from 'rdflib-ts';

// Register prefix to use in application scope
NamespaceManagerInstance.registerNamespace('ex', 'http://example.org#');

// Apache Jena Fuseki server running on localhost:3030
// There are TestStore1 and TestStore2 created on server
let remoteEndpoint1 = new RemoteSparqlEndpoint('TestStore1', 'http://localhost:3030');
let remoteEndpoint2 = new RemoteSparqlEndpoint('TestStore2', 'http://localhost:3030');

let dataImporter = new RdfDataImporter();
let dataExporter = new RdfDataExporter();

try {

	// Data importer can import quads from memory or from rdf document
	await dataImporter.importRdfDataAsync([new NQuad('ex:Alice', 'ex:knows', 'ex:Bob')], remoteEndpoint1);
	await dataImporter.importRdfDataAsync('D:/vladimir_djurdjevic/shacl_1_4_example_data_graph.json', remoteEndpoint1);

	// Data exporter can just return exported quads in memory, 
	// write them to file or even import them in other store
	let quads: NQuad[] = await dataExporter.exportRdfDataAsync(remoteEndpoint1);
	await dataExporter.exportRdfDataAsync(remoteEndpoint1, 'D:/vladimir_djurdjevic/outPath.ttl');
	await dataExporter.exportRdfDataAsync(remoteEndpoint1, remoteEndpoint2);

} catch (error) {
	console.log(error.message);
}
```

##### NamespaceManager, RdfUtils and RdfFactory
`NamespaceManager` class can be used to manipulate with namespaces. Default `NamespaceManagerInstance` is used in various parts of library for namespace resolution. `IRI` class, for example, uses `NamespaceManagerInstance` to resolve namespace. `RdfDataExporter` also uses `NamespaceManagerInstance` for creating context for JsonLD output or set of prefixes for Turtle output. 
`RdfUtils` and `RdfFactory` are simple util classes with static helper methods for checking RDF value format or creating terms based on different inputs.

###### RdfUtils:
* `RdfUtils.isUUID(value: string): boolean`
* `RdfUtils.isUrl(value: string): boolean`
* `RdfUtils.isUrn(value: string): boolean`
* `RdfUtils.isAbsoluteIRI(value: string): boolean`
* `RdfUtils.isRelativeIRI(value: string): boolean`
* `RdfUtils.isSkolemIRI(value: string): boolean`
* `RdfUtils.isIRI(value: string): boolean`
* `RdfUtils.isBlankNode(value: string): boolean`
* `RdfUtils.isPlainLiteral(value: string): boolean`
* `RdfUtils.isLangLiteral(value: string): boolean`
* `RdfUtils.isTypedLiteral(value: string): boolean`
* `RdfUtils.escapeLiteral(value: string): string`
 
###### RdfFactory:
* `RdFactory.createLiteral(value: string, language?: string, datatype?: string): Literal`
* `RdFactory.createRdfSubject(value: string): RdfSubject`
* `RdFactory.createRdfSubject(value: string): RdfSubject`
* `RdFactory.createRdfTermFromSparqlResult(result: ISparqlQueryResultBinding): RdfTerm`
* `RdFactory.createNQuadFromSparqlResult(result: IQuadQueryResult): NQuad`


##### Custom errors (exceptions)
RDFLib.ts contains set of custom error classes for handling different error scenarios.
Every custom error has `innerError` property which can be useful when rethrowing errors.
Error message consists of error name followed by concatenated (dot separated) error messages for every inner error in chain.

###### Available errors:
* ArgumentError
* FormatError
* InvalidOperationError
* NetworkError
* NotImplementedError
* NotSupportedError

###### Example 1: Simple try catch
```typescript
import { FormatError } from 'rdflib-ts';

try {
    throw new FormatError('Provided value has incorrect format');
} catch (error) {
    console.log(error.message); // FormatError: Provided value has incorrect format
}
```

###### Example 2: Rethrowing error
```typescript
import { FormatError, InvalidOperationError } from 'rdflib-ts';

let rethrowingErrorFunction = () => {
	try {
		throw new FormatError('Provided value has incorrect format');
	} catch (error) {
		throw new InvalidOperationError('Can not create object', error);
	}
}

try {
	rethrowingErrorFunction();
} catch (error) {
	console.log(error.message); // InvalidOperationError: Can not create object. Provided value has incorrect format (FormatError)
}
```

## Development
---

Want to contribute? Great!
If you are using Visual Studio Code, there is default development setup in `.vscode` folder. There are configured tasks for compile, test and build, and default launch configuration with `main.ts` as entry point, and compile as pre launch task. Be aware that working directory when debugging is not project root, it it `compiled` directory (directory where compiled .js files reside).
There is also `keybindings.json` file with custom bindings which you can copy to your local keybinding.json file (File -> Preferences -> Keyboard Shortcuts). It's just 3 shortcuts, `f4` to run tests, `f6` to run build task and `ctrl+k, ctrl+d` to format code.
After cloning code, run `npm install` to install dependencies, then run `npm run build` to build library and `npm link rdflib-ts` to link library locally for test purposes. 
To run tests, run `npm test` command. For running integration test, instance of Apache Jena Fuseki 2.5.0 server must be running on port 3030. You can download and run it your self, or you can use docker image specified in `bitbucket-pipelines.yml` file and make sure to have same environment as one used for continuous integration and testing.

## Todos
---

 - Implement in memory RDF store with SPARQL 1.1 support
 - Add support for RDF/XML serialization format
 - Reach 100% code coverage
 - Setup docker containers with fuseki server and static file server for integration and e2e tests
 - Make it browser friendly

License
----

MIT
