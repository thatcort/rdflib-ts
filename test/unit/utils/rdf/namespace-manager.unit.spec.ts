import { NamespaceManager } from '../../../../src/utils/rdf/namespace-manager';

describe('NamespaceManager - Unit', () => {
	let manager: NamespaceManager;

	beforeEach(() => {
		manager = new NamespaceManager();
		manager.generateNamespace('http://generated.org');
	});

	context('constructor', () => {
		it('should add default namespaces (rdf, rdfs, xsd, skolem', () => {
			manager = new NamespaceManager();

			manager.coreNamespaces.some(
				n => n.prefix === 'rdf' && n.value === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#'
			).should.be.true;
			manager.coreNamespaces.some(
				n => n.prefix === 'rdfs' && n.value === 'http://www.w3.org/2000/01/rdf-schema#'
			).should.be.true;
			manager.coreNamespaces.some(
				n => n.prefix === 'xsd' && n.value === 'http://www.w3.org/2001/XMLSchema#'
			).should.be.true;
			manager.coreNamespaces.some(
				n =>
					n.prefix === 'skolem' &&
					n.value ===
						'https://bitbucket.org/vladimir_djurdjevic/rdflib.ts/.well-known/genid/'
			).should.be.true;
		});
	});

	context('getAllNamespaces', () => {
		it('should return joined core and generated namespaces', () => {
			const allNamespaces = manager.getAllNamespaces();
			manager.coreNamespaces.some(n => allNamespaces.indexOf(n) === -1).should.be.false;
			manager.generatedNamespaces.some(n => allNamespaces.indexOf(n) === -1).should.be.false;
		});
	});

	context('getNamespace', () => {
		it('should return namespace if namespace with target prefix or value exists in core or generated namespaces', () => {
			manager
				.getNamespace('rdf', null)
				.value.should.equal('http://www.w3.org/1999/02/22-rdf-syntax-ns#');
			manager
				.getNamespace(null, 'http://www.w3.org/1999/02/22-rdf-syntax-ns#')
				.prefix.should.equal('rdf');
			manager.getNamespace('rdf', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#').should.be.ok;
			manager.getNamespace(null, 'http://generated.org').should.be.ok;
			manager.getNamespace('_ns0', null).should.be.ok;
			manager.getNamespace('_ns0', 'http://generated.org').should.be.ok;
		});
	});

	context('getNamespaceByPrefix', () => {
		it('should return namespace if namespace with target prefix exists in core or generated namespaces', () => {
			manager
				.getNamespaceByPrefix('rdf')
				.value.should.equal('http://www.w3.org/1999/02/22-rdf-syntax-ns#');
		});
	});

	context('getNamespaceByValue', () => {
		it('should return namespace if namespace with target value exists in core or generated namespaces', () => {
			manager
				.getNamespaceByValue('http://www.w3.org/1999/02/22-rdf-syntax-ns#')
				.prefix.should.equal('rdf');
		});
	});

	context('registerNamespace', () => {
		it('should create and add to core namespaces new namespace object if namespace with specified prefix does not exist', () => {
			manager.registerNamespace('ex', 'http://example.org#');
			manager.coreNamespaces.some(n => n.prefix === 'ex' && n.value === 'http://example.org#')
				.should.be.true;
		});

		it('should replace namespace with new one if namespace with target prefix already exists', () => {
			manager.registerNamespace('rdf', 'http://newrdfnamespacevalue.org');
			const replaced = manager.coreNamespaces.find(n => n.prefix === 'rdf');
			replaced.should.be.ok;
			replaced.value.should.equal('http://newrdfnamespacevalue.org/');
		});
	});

	context('generateNamespace', () => {
		it('should generate namespace from provided value', () => {
			manager.generateNamespace('http://generated.org#');
			manager.getNamespaceByValue('http://generated.org#').should.be.ok;
		});
	});
});
