import { NamespaceManagerInstance } from './utils/rdf/namespace-manager';
import { RdfDataImporter } from './utils/io/rdf-data-importer';
import { RemoteSparqlEndpoint } from './rdf-store/remote-sparql-endpoint';
import { NQuad } from './model/n-quad';

(async () => {
	NamespaceManagerInstance.registerNamespace('ex', 'http://example.org#');

	let quad31 = new NQuad('ex:Alice', 'rdf:type', 'ex:Person', 'ex:NewYork');
	// quad31.toString().should.equal('<http://example.org#Alice> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://example.org#Person> <http://example.org#NewYork> .');

	let quad32 = new NQuad('ex:Alice', 'ex:child', 'ex:Calvin', 'ex:NewYork');
	// quad32.toString().should.equal('<http://example.org#Alice> <http://example.org#child> <http://example.org#Calvin> <http://example.org#NewYork> .');

	let quad33 = new NQuad('ex:Bob', 'rdf:type', 'ex:Person', 'ex:Toronto');
	// quad33.toString().should.equal('<http://example.org#Bob> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://example.org#Person> <http://example.org#Toronto> .');

	let quad34 = new NQuad('ex:Bob', 'ex:child', 'ex:Calvin', 'ex:Toronto');
	// quad34.toString().should.equal('<http://example.org#Bob> <http://example.org#child> <http://example.org#Calvin> <http://example.org#Toronto> .');

	let quad35 = new NQuad('ex:Calvin', 'rdf:type', 'ex:Person', 'ex:London');
	// quad35.toString().should.equal('<http://example.org#Calvin> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://example.org#Person> <http://example.org#London> .');

	let quad36 = new NQuad('ex:Calvin', 'ex:school', 'ex:TrinityAnglicanSchool', 'ex:London');
	// quad36.toString().should.equal('<http://example.org#Calvin> <http://example.org#school> <http://example.org#TrinityAnglicanSchool> <http://example.org#London> .');

	// Insert quads in named graph dataset
	let namedGraphDataset = [].concat([quad31, quad32, quad33, quad34, quad36]);

	let store1 = new RemoteSparqlEndpoint('TestDataset1', 'http://localhost:3030');
	let importer = new RdfDataImporter();
	await importer.importRdfDataAsync(namedGraphDataset, store1);

	process.exit();
})();

