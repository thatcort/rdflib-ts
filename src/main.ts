import { RdfIOManager } from './utils/io/rdf-io-manager';
import { NQuad } from './model/n-quad';
import { IRI } from './model/iri';
import { BlankNode } from './model/blank-node';
import { TypedLiteral } from './model/typed-literal';
import { NamespaceManagerInstance } from './utils/rdf/namespace-manager';
import { LangLiteral } from './model/lang-literal';
import { PlainLiteral } from './model/plain-literal';

(async () => {
	NamespaceManagerInstance.registerNamespace('ex', 'http://example.org#');

	let quad1 = new NQuad('ex:Alice', 'rdf:type', 'ex:Person');
	// quad1.toString().should.equal('<http://example.org#Alice> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://example.org#Person> .');

	let quad2 = new NQuad(new IRI('ex:Alice'), new IRI('ex:child'), 'ex:Calvin');
	// quad2.toString().should.equal('<http://example.org#Alice> <http://example.org#child> <http://example.org#Calvin> .');

	let quad3 = new NQuad('http://example.org#Alice', 'ex:knows', '_:anonymous1');
	// quad3.toString().should.equal('<http://example.org#Alice> <http://example.org#knows> _:anonymous1 .');

	let quad4 = new NQuad('ex:Alice', 'ex:knows', new BlankNode('anonymous2'));
	// quad4.toString().should.equal('<http://example.org#Alice> <http://example.org#knows> _:anonymous2 .');

	let quad5 = new NQuad('ex:Alice', 'ex:about', 'Some random girl for rdf data testing');
	// quad5.toString().should.equal('<http://example.org#Alice> <http://example.org#about> "Some random girl for rdf data testing" .');

	let quad6 = new NQuad('ex:Alice', 'ex:age', '"21"^^xsd:integer');
	// quad6.toString().should.equal('<http://example.org#Alice> <http://example.org#age> "21"^^<http://www.w3.org/2001/XMLSchema#integer> .');

	// Bob triples

	let quad7 = new NQuad('ex:Bob', 'rdf:type', 'ex:Person');
	// quad7.toString().should.equal('<http://example.org#Bob> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://example.org#Person> .');

	let quad8 = new NQuad(new IRI('ex:Bob'), new IRI('ex:child'), 'ex:Calvin');
	// quad8.toString().should.equal('<http://example.org#Bob> <http://example.org#child> <http://example.org#Calvin> .');

	let quad9 = new NQuad('http://example.org#Bob', 'ex:knows', new BlankNode('b0'));
	// quad9.toString().should.equal('<http://example.org#Bob> <http://example.org#knows> _:b0 .');

	let quad10 = new NQuad('ex:Bob', 'ex:knows', new BlankNode('anonymous4'));
	// quad10.toString().should.equal('<http://example.org#Bob> <http://example.org#knows> _:anonymous4 .');

	let quad11 = new NQuad('ex:Bob', 'ex:about', '"Some random buddy for rdf data testing"@en');
	// quad11.toString().should.equal('<http://example.org#Bob> <http://example.org#about> "Some random buddy for rdf data testing"@en .');

	let quad12 = new NQuad('ex:Bob', 'ex:age', new TypedLiteral('25', 'xsd:integer'));
	// quad12.toString().should.equal('<http://example.org#Bob> <http://example.org#age> "25"^^<http://www.w3.org/2001/XMLSchema#integer> .');

	// Calvin triples

	let quad13 = new NQuad('ex:Calvin', 'rdf:type', 'ex:Person');
	// quad13.toString().should.equal('<http://example.org#Calvin> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://example.org#Person> .');

	let quad14 = new NQuad(new IRI('ex:Calvin'), new IRI('ex:child'), 'ex:Mike');
	// quad14.toString().should.equal('<http://example.org#Calvin> <http://example.org#child> <http://example.org#Mike> .');

	let quad15 = new NQuad('http://example.org#Calvin', 'ex:knows', new IRI('http://example.org#Josh'));
	// quad15.toString().should.equal('<http://example.org#Calvin> <http://example.org#knows> <http://example.org#Josh> .');

	let quad16 = new NQuad('ex:Calvin', 'ex:knows', new IRI('John', NamespaceManagerInstance.getNamespaceByPrefix('ex')));
	// quad16.toString().should.equal('<http://example.org#Calvin> <http://example.org#knows> <http://example.org#John> .');

	let quad17 = new NQuad('ex:Calvin', 'ex:about', new LangLiteral('Some random buddy for rdf data testing', 'en'));
	// quad17.toString().should.equal('<http://example.org#Calvin> <http://example.org#about> "Some random buddy for rdf data testing"@en .');

	let quad18 = new NQuad('ex:Calvin', 'ex:age', new TypedLiteral('25', new IRI('xsd:integer')));
	// quad18.toString().should.equal('<http://example.org#Calvin> <http://example.org#age> "25"^^<http://www.w3.org/2001/XMLSchema#integer> .');

	// John triples

	let quad19 = new NQuad('ex:John', 'rdf:type', 'ex:Person');
	// quad19.toString().should.equal('<http://example.org#John> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://example.org#Person> .');

	let quad20 = new NQuad(new IRI('ex:John'), new IRI('ex:child'), 'ex:Calvin');
	// quad20.toString().should.equal('<http://example.org#John> <http://example.org#child> <http://example.org#Calvin> .');

	let quad21 = new NQuad('http://example.org#John', 'ex:knows', new IRI('http://example.org#Josh'));
	// quad21.toString().should.equal('<http://example.org#John> <http://example.org#knows> <http://example.org#Josh> .');

	let quad22 = new NQuad('ex:John', 'ex:knows', new IRI('Jessie', NamespaceManagerInstance.getNamespaceByPrefix('ex')));
	// quad22.toString().should.equal('<http://example.org#John> <http://example.org#knows> <http://example.org#Jessie> .');

	let quad23 = new NQuad('ex:John', 'ex:about', new LangLiteral('"Some random buddy for rdf data testing"@en'));
	// quad23.toString().should.equal('<http://example.org#John> <http://example.org#about> "Some random buddy for rdf data testing"@en .');

	let quad24 = new NQuad('ex:John', 'ex:age', new TypedLiteral('"25"^^xsd:integer'));
	// quad24.toString().should.equal('<http://example.org#John> <http://example.org#age> "25"^^<http://www.w3.org/2001/XMLSchema#integer> .');

	// Josh triples

	let quad25 = new NQuad('ex:Josh', 'rdf:type', 'ex:Person');
	// quad25.toString().should.equal('<http://example.org#Josh> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://example.org#Person> .');

	let quad26 = new NQuad(new IRI('ex:Josh'), new IRI('ex:child'), 'ex:Calvin');
	// quad26.toString().should.equal('<http://example.org#Josh> <http://example.org#child> <http://example.org#Calvin> .');

	let quad27 = new NQuad('http://example.org#Josh', 'ex:knows', new IRI('http://example.org#John'));
	// quad27.toString().should.equal('<http://example.org#Josh> <http://example.org#knows> <http://example.org#John> .');

	let quad28 = new NQuad('ex:Josh', 'ex:knows', new IRI('Jessie', NamespaceManagerInstance.getNamespaceByPrefix('ex')));
	// quad28.toString().should.equal('<http://example.org#Josh> <http://example.org#knows> <http://example.org#Jessie> .');

	let quad29 = new NQuad('ex:Josh', 'ex:about', new LangLiteral('"Some random buddy for rdf data testing"@en'));
	// quad29.toString().should.equal('<http://example.org#Josh> <http://example.org#about> "Some random buddy for rdf data testing"@en .');

	let quad30 = new NQuad('ex:Josh', 'ex:age', new PlainLiteral('25'));
	// quad30.toString().should.equal('<http://example.org#Josh> <http://example.org#age> "25" .');

	// Add quads to default graph dataset
	let defaultGraphDataset = [].concat([
		quad1, quad2, quad3, quad4, quad5, quad6, quad7, quad8, quad9, quad10,
		quad11, quad12, quad13, quad14, quad15, quad16, quad17, quad18, quad19, quad20,
		quad21, quad22, quad23, quad24, quad25, quad26, quad27, quad28, quad29, quad30
	]);

	let ioManager = new RdfIOManager();
	await ioManager.serializeAsync(defaultGraphDataset, 'C:/test/new/serialized/serialized.json');

	process.exit();
})();

