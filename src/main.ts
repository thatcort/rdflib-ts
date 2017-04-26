import { NamespaceManager } from './utils/rdf/namespace-manager';
// import { BlankNode } from 'rdflib-ts';


(async () => {
	// Write code to debug
	// let b1 = new BlankNode('b1');
	// console.log(b1);
	let manager = new NamespaceManager();
	manager.registerNamespace('rdf', 'http://newrdfvalue.org');
	process.exit();
})();

