import { TestHelper } from '../helpers/test-helper';
import 'mocha';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);
chai.should();

import * as fs from 'fs';
import * as del from 'del';

import { IRI } from '../../src/model/iri';
import { NQuad } from '../../src/model/n-quad';
import { NTriple } from '../../src/model/n-triple';
import { BlankNode } from '../../src/model/blank-node';
import { FormatError } from '../../src/errors/format-error';
import { LangLiteral } from '../../src/model/lang-literal';
import { RdfIOManager } from '../../src/utils/io/rdf-io-manager';
import { JsonLDParser } from '../../src/parsers/jsonld-parser';
import { TurtleParser } from '../../src/parsers/turtle-parser';
import { PlainLiteral } from '../../src/model/plain-literal';
import { TypedLiteral } from '../../src/model/typed-literal';
import { ArgumentError } from '../../src/errors/argument-error';
import { RdfDataExporter } from '../../src/utils/io/rdf-data-exporter';
import { RdfDataImporter } from '../../src/utils/io/rdf-data-importer';
import { JsonLDSerializer } from '../../src/serializers/jsonld-serializer';
import { TurtleSerializer } from '../../src/serializers/turtle-serializer';
import { ITripleQueryResult } from '../../src/model/sparql-query-result';
import { RemoteSparqlEndpoint } from '../../src/rdf-store/remote-sparql-endpoint';
import { InvalidOperationError } from '../../src/errors/invalid-operation-error';
import { NamespaceManagerInstance } from '../../src/utils/rdf/namespace-manager';


describe('RDFLib.ts', () => {

	NamespaceManagerInstance.registerNamespace('ex', 'http://example.org#');
	let defaultGraphDataset: NQuad[] = [];
	let namedGraphDataset: NQuad[] = [];

	let defaultGraphDocumentPath = 'test/tmp/serialization/default-graph-dataset.json';
	let namedGraphDocumentPath = 'test/tmp/serialization/named-graph-dataset.trig';

	let fusekiServerPID;

	before(async () => {
		fusekiServerPID = await TestHelper.spawnFusekiServerAsync();
		await TestHelper.createStoreOnFusekiServerAsync('TestDataset1');
		await TestHelper.createStoreOnFusekiServerAsync('TestDataset2');

	});

	after(async () => {
		await TestHelper.deleteStoreOnFusekiServerAsync('TestDataset1');
		await TestHelper.deleteStoreOnFusekiServerAsync('TestDataset2');
		TestHelper.killProcess(fusekiServerPID);
	});

	context('RDF model', () => {
		it('user should be able to create rdf terms with different input styles', () => {

			// Alice triples

			let quad1 = new NQuad('ex:Alice', 'rdf:type', 'ex:Person');
			quad1.toString().should.equal('<http://example.org#Alice> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://example.org#Person> .');

			let quad2 = new NQuad(new IRI('ex:Alice'), new IRI('ex:child'), 'ex:Calvin');
			quad2.toString().should.equal('<http://example.org#Alice> <http://example.org#child> <http://example.org#Calvin> .');

			let quad3 = new NQuad('http://example.org#Alice', 'ex:knows', '_:anonymous1');
			quad3.toString().should.equal('<http://example.org#Alice> <http://example.org#knows> _:anonymous1 .');

			let quad4 = new NQuad('ex:Alice', 'ex:knows', new BlankNode('anonymous2'));
			quad4.toString().should.equal('<http://example.org#Alice> <http://example.org#knows> _:anonymous2 .');

			let quad5 = new NQuad('ex:Alice', 'ex:about', 'Some random girl for rdf data testing');
			quad5.toString().should.equal('<http://example.org#Alice> <http://example.org#about> "Some random girl for rdf data testing" .');

			let quad6 = new NQuad('ex:Alice', 'ex:age', '"21"^^xsd:integer');
			quad6.toString().should.equal('<http://example.org#Alice> <http://example.org#age> "21"^^<http://www.w3.org/2001/XMLSchema#integer> .');

			// Bob triples

			let quad7 = new NQuad('ex:Bob', 'rdf:type', 'ex:Person');
			quad7.toString().should.equal('<http://example.org#Bob> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://example.org#Person> .');

			let quad8 = new NQuad(new IRI('ex:Bob'), new IRI('ex:child'), 'ex:Calvin');
			quad8.toString().should.equal('<http://example.org#Bob> <http://example.org#child> <http://example.org#Calvin> .');

			let quad9 = new NQuad('http://example.org#Bob', 'ex:knows', new BlankNode('b0'));
			quad9.toString().should.equal('<http://example.org#Bob> <http://example.org#knows> _:b0 .');

			let quad10 = new NQuad('ex:Bob', 'ex:knows', new BlankNode('anonymous4'));
			quad10.toString().should.equal('<http://example.org#Bob> <http://example.org#knows> _:anonymous4 .');

			let quad11 = new NQuad('ex:Bob', 'ex:about', '"Some random buddy for rdf data testing"@en');
			quad11.toString().should.equal('<http://example.org#Bob> <http://example.org#about> "Some random buddy for rdf data testing"@en .');

			let quad12 = new NQuad('ex:Bob', 'ex:age', new TypedLiteral('25', 'xsd:integer'));
			quad12.toString().should.equal('<http://example.org#Bob> <http://example.org#age> "25"^^<http://www.w3.org/2001/XMLSchema#integer> .');

			// Calvin triples

			let quad13 = new NQuad('ex:Calvin', 'rdf:type', 'ex:Person');
			quad13.toString().should.equal('<http://example.org#Calvin> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://example.org#Person> .');

			let quad14 = new NQuad(new IRI('ex:Calvin'), new IRI('ex:child'), 'ex:Mike');
			quad14.toString().should.equal('<http://example.org#Calvin> <http://example.org#child> <http://example.org#Mike> .');

			let quad15 = new NQuad('http://example.org#Calvin', 'ex:knows', new IRI('http://example.org#Josh'));
			quad15.toString().should.equal('<http://example.org#Calvin> <http://example.org#knows> <http://example.org#Josh> .');

			let quad16 = new NQuad('ex:Calvin', 'ex:knows', new IRI('John', NamespaceManagerInstance.getNamespaceByPrefix('ex')));
			quad16.toString().should.equal('<http://example.org#Calvin> <http://example.org#knows> <http://example.org#John> .');

			let quad17 = new NQuad('ex:Calvin', 'ex:about', new LangLiteral('Some random buddy for rdf data testing', 'en'));
			quad17.toString().should.equal('<http://example.org#Calvin> <http://example.org#about> "Some random buddy for rdf data testing"@en .');

			let quad18 = new NQuad('ex:Calvin', 'ex:age', new TypedLiteral('25', new IRI('xsd:integer')));
			quad18.toString().should.equal('<http://example.org#Calvin> <http://example.org#age> "25"^^<http://www.w3.org/2001/XMLSchema#integer> .');

			// John triples

			let quad19 = new NQuad('ex:John', 'rdf:type', 'ex:Person');
			quad19.toString().should.equal('<http://example.org#John> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://example.org#Person> .');

			let quad20 = new NQuad(new IRI('ex:John'), new IRI('ex:child'), 'ex:Calvin');
			quad20.toString().should.equal('<http://example.org#John> <http://example.org#child> <http://example.org#Calvin> .');

			let quad21 = new NQuad('http://example.org#John', 'ex:knows', new IRI('http://example.org#Josh'));
			quad21.toString().should.equal('<http://example.org#John> <http://example.org#knows> <http://example.org#Josh> .');

			let quad22 = new NQuad('ex:John', 'ex:knows', new IRI('Jessie', NamespaceManagerInstance.getNamespaceByPrefix('ex')));
			quad22.toString().should.equal('<http://example.org#John> <http://example.org#knows> <http://example.org#Jessie> .');

			let quad23 = new NQuad('ex:John', 'ex:about', new LangLiteral('"Some random buddy for rdf data testing"@en'));
			quad23.toString().should.equal('<http://example.org#John> <http://example.org#about> "Some random buddy for rdf data testing"@en .');

			let quad24 = new NQuad('ex:John', 'ex:age', new TypedLiteral('"25"^^xsd:integer'));
			quad24.toString().should.equal('<http://example.org#John> <http://example.org#age> "25"^^<http://www.w3.org/2001/XMLSchema#integer> .');

			// Josh triples

			let quad25 = new NQuad('ex:Josh', 'rdf:type', 'ex:Person');
			quad25.toString().should.equal('<http://example.org#Josh> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://example.org#Person> .');

			let quad26 = new NQuad(new IRI('ex:Josh'), new IRI('ex:child'), 'ex:Calvin');
			quad26.toString().should.equal('<http://example.org#Josh> <http://example.org#child> <http://example.org#Calvin> .');

			let quad27 = new NQuad('http://example.org#Josh', 'ex:knows', new IRI('http://example.org#John'));
			quad27.toString().should.equal('<http://example.org#Josh> <http://example.org#knows> <http://example.org#John> .');

			let quad28 = new NQuad('ex:Josh', 'ex:knows', new IRI('Jessie', NamespaceManagerInstance.getNamespaceByPrefix('ex')));
			quad28.toString().should.equal('<http://example.org#Josh> <http://example.org#knows> <http://example.org#Jessie> .');

			let quad29 = new NQuad('ex:Josh', 'ex:about', new LangLiteral('"Some random buddy for rdf data testing"@en'));
			quad29.toString().should.equal('<http://example.org#Josh> <http://example.org#about> "Some random buddy for rdf data testing"@en .');

			let quad30 = new NQuad('ex:Josh', 'ex:age', new PlainLiteral('25'));
			quad30.toString().should.equal('<http://example.org#Josh> <http://example.org#age> "25" .');

			// Add quads to default graph dataset
			defaultGraphDataset = [].concat([
				quad1, quad2, quad3, quad4, quad5, quad6, quad7, quad8, quad9, quad10,
				quad11, quad12, quad13, quad14, quad15, quad16, quad17, quad18, quad19, quad20,
				quad21, quad22, quad23, quad24, quad25, quad26, quad27, quad28, quad29, quad30
			]);

			// Alice, Bob and Calvin in named graphs
			let quad31 = new NQuad('ex:Alice', 'rdf:type', 'ex:Person', 'ex:NewYork');
			quad31.toString().should.equal('<http://example.org#Alice> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://example.org#Person> <http://example.org#NewYork> .');

			let quad32 = new NQuad('ex:Alice', 'ex:child', 'ex:Calvin', 'ex:NewYork');
			quad32.toString().should.equal('<http://example.org#Alice> <http://example.org#child> <http://example.org#Calvin> <http://example.org#NewYork> .');

			let quad33 = new NQuad('ex:Bob', 'rdf:type', 'ex:Person', 'ex:Toronto');
			quad33.toString().should.equal('<http://example.org#Bob> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://example.org#Person> <http://example.org#Toronto> .');

			let quad34 = new NQuad('ex:Bob', 'ex:child', 'ex:Calvin', 'ex:Toronto');
			quad34.toString().should.equal('<http://example.org#Bob> <http://example.org#child> <http://example.org#Calvin> <http://example.org#Toronto> .');

			let quad35 = new NQuad('ex:Calvin', 'rdf:type', 'ex:Person', 'ex:London');
			quad35.toString().should.equal('<http://example.org#Calvin> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://example.org#Person> <http://example.org#London> .');

			let quad36 = new NQuad('ex:Calvin', 'ex:school', 'ex:TrinityAnglicanSchool', 'ex:London');
			quad36.toString().should.equal('<http://example.org#Calvin> <http://example.org#school> <http://example.org#TrinityAnglicanSchool> <http://example.org#London> .');

			// Insert quads in named graph dataset
			namedGraphDataset = [].concat([quad31, quad32, quad33, quad34, quad36]);
		});

		it('should throw appropriate exceptions if input parameters are not valid', () => {
			(() => new BlankNode('###invalid$blank@node^^value')).should.throw(FormatError);

			(() => new IRI(null)).should.throw(ArgumentError);
			(() => new IRI(undefined)).should.throw(ArgumentError);
			(() => new IRI('')).should.throw(ArgumentError);
			(() => new IRI('###invalid value')).should.throw(FormatError);
			(() => new IRI('s f: invalid relative iri')).should.throw(FormatError);
			(() => new IRI('hpt:/aaa')).should.throw(FormatError);

			(() => new LangLiteral(null)).should.throw(ArgumentError);
			(() => new LangLiteral(undefined)).should.throw(ArgumentError);
			(() => new TypedLiteral(null)).should.throw(ArgumentError);
			(() => new TypedLiteral(undefined)).should.throw(ArgumentError);
			(() => new PlainLiteral(null)).should.throw(ArgumentError);
			(() => new PlainLiteral(undefined)).should.throw(ArgumentError);

			(() => new NTriple(null, 'rdf:type', '_:b1')).should.throw(ArgumentError);
			(() => new NTriple(undefined, 'rdf:type', '_:b1')).should.throw(ArgumentError);
			(() => new NTriple('', 'rdf:type', '_:b1')).should.throw(ArgumentError);
			(() => new NTriple('rdf:type', null, '_:b1')).should.throw(ArgumentError);
			(() => new NTriple('rdf:type', 'rdf:type', null)).should.throw(ArgumentError);
			(() => new NTriple('rdf:type', 'rdf:type', undefined)).should.throw(ArgumentError);

			(() => new NQuad(null, 'rdf:type', '_:b1')).should.throw(ArgumentError);
			(() => new NQuad(undefined, 'rdf:type', '_:b1')).should.throw(ArgumentError);
			(() => new NQuad('', 'rdf:type', '_:b1')).should.throw(ArgumentError);
			(() => new NQuad('rdf:type', null, '_:b1')).should.throw(ArgumentError);
			(() => new NQuad('rdf:type', undefined, '_:b1')).should.throw(ArgumentError);
			(() => new NQuad('rdf:type', 'rdf:type', null)).should.throw(ArgumentError);
			(() => new NQuad('rdf:type', 'rdf:type', undefined)).should.throw(ArgumentError);

			(() => new NTriple('###invalid value', 'rdf:type', '')).should.throw(InvalidOperationError);
			(() => new NTriple('rdf:type', '_:b1', '')).should.throw(InvalidOperationError);
			(() => new NTriple('"literal"', 'rdf:type', '')).should.throw(InvalidOperationError);
			(() => new NQuad('###invalid value', 'rdf:type', '')).should.throw(InvalidOperationError);
			(() => new NQuad('rdf:type', '_:b1', '')).should.throw(InvalidOperationError);
			(() => new NQuad('"literal"', 'rdf:type', '')).should.throw(InvalidOperationError);
			(() => new NQuad('"literal"', 'rdf:type', '', '_:b1')).should.throw(InvalidOperationError);
		});
	});

	context('Parsing/Serializing', () => {
		it('user should be able to parse/serialize rdf data from/to different formats and from different origins', async () => {

			let ttlParser = new TurtleParser();
			let ttlSerializer = new TurtleSerializer();
			let jsonParser = new JsonLDParser();
			let jsonSerializer = new JsonLDSerializer();
			let ioManager = new RdfIOManager();

			// Parse from string
			let defaultGraphDatasetString = defaultGraphDataset.join('\n');
			let namedGraphDatasetString = namedGraphDataset.join('\n');

			let defaultGraphQuads = await ttlParser.parseDocumentAsync(defaultGraphDatasetString);
			defaultGraphQuads.should.be.ok;
			defaultGraphQuads.should.have.lengthOf(defaultGraphDataset.length);

			let namedGraphQuads = await ttlParser.parseDocumentAsync(namedGraphDatasetString);
			namedGraphQuads.should.be.ok;
			namedGraphQuads.should.have.lengthOf(namedGraphDataset.length);

			await ioManager.serializeAsync(defaultGraphQuads, defaultGraphDocumentPath);
			fs.existsSync(defaultGraphDocumentPath).should.be.true;

			await ioManager.serializeAsync(namedGraphQuads, namedGraphDocumentPath);
			fs.existsSync(namedGraphDocumentPath).should.be.true;

			defaultGraphQuads = await ioManager.parseDocumentAsync(defaultGraphDocumentPath);
			defaultGraphQuads.should.be.ok;
			defaultGraphQuads.should.have.lengthOf(defaultGraphDataset.length);

			namedGraphQuads = await ioManager.parseDocumentAsync(namedGraphDocumentPath);
			namedGraphQuads.should.be.ok;
			namedGraphQuads.should.have.lengthOf(namedGraphDataset.length);

			del.sync('test/tmp');
		});
	});

	context('RDF Store, Import/Export', () => {
		it('user should be able to import data into remote triple store, query store with SPARQL 1.1 and export data from store', async () => {
			let store1 = new RemoteSparqlEndpoint('TestDataset1', 'http://localhost:3030');
			let store2 = new RemoteSparqlEndpoint('TestDataset2', 'http://localhost:3030');

			let importer = new RdfDataImporter();
			let exporter = new RdfDataExporter();

			await importer.importRdfDataAsync(defaultGraphDataset, store1);
			store1.storeSize.should.equal(defaultGraphDataset.length);

			let queryResult = await store1.queryAsync<ITripleQueryResult>('SELECT * WHERE { ?subject ?predicate ?object }');
			queryResult.results.bindings.should.have.lengthOf(defaultGraphDataset.length);

			await exporter.exportRdfDataAsync(store1, defaultGraphDocumentPath);
			fs.existsSync(defaultGraphDocumentPath).should.be.true;

			await importer.importRdfDataAsync(namedGraphDataset, store1);
			store1.storeSize.should.equal(defaultGraphDataset.length + namedGraphDataset.length);

			await exporter.exportRdfDataAsync(store1, store2);
			let exportFromStore2 = await exporter.exportRdfDataAsync(store2);
			exportFromStore2.should.have.lengthOf(defaultGraphDataset.length + namedGraphDataset.length);

			del.sync('test/tmp');
		});
	});
});