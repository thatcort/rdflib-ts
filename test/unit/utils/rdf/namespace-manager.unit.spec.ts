import 'mocha';
import { expect } from 'chai';

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
			
			expect(manager.coreNamespaces.some(n => n.prefix === 'rdf' && n.value === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#')).to.be.true;
			expect(manager.coreNamespaces.some(n => n.prefix === 'rdfs' && n.value === 'http://www.w3.org/2000/01/rdf-schema#')).to.be.true;
			expect(manager.coreNamespaces.some(n => n.prefix === 'xsd' && n.value === 'http://www.w3.org/2001/XMLSchema#')).to.be.true;
			expect(manager.coreNamespaces.some(n => n.prefix === 'skolem' && n.value === 'https://bitbucket.org/vladimir_djurdjevic/rdflib.ts/.well-known/genid/')).to.be.true;
		});
	});

	context('getAllNamespaces', () => {
		it('should return joined core and generated namespaces', () => {
			let allNamespaces = manager.getAllNamespaces();
			expect(manager.coreNamespaces.some(n => allNamespaces.indexOf(n) === -1)).to.be.false;
			expect(manager.generatedNamespaces.some(n => allNamespaces.indexOf(n) === -1)).to.be.false;		
		});
	});

	context('getNamespace', () => {
		it('should return null if namespace with prefix or value does not exist', () => {
			expect(manager.getNamespace(null, null)).not.to.be.ok;
			expect(manager.getNamespace('un', 'http://unknown.org')).not.to.be.ok;
		});

		it('should return namespace if namespace with target prefix or value exists in core or generated namespaces', () => {
			expect(manager.getNamespace('rdf', null).value).to.equal('http://www.w3.org/1999/02/22-rdf-syntax-ns#');
			expect(manager.getNamespace(null, 'http://www.w3.org/1999/02/22-rdf-syntax-ns#').prefix).to.equal('rdf');
			expect(manager.getNamespace('rdf', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#')).to.be.ok;
			expect(manager.getNamespace(null, 'http://generated.org')).to.be.ok;
			expect(manager.getNamespace('_ns0', null)).to.be.ok;
			expect(manager.getNamespace('_ns0', 'http://generated.org')).to.be.ok;
		});
	});

	context('getNamespaceByPrefix', () => {
		it('should return null if namespace with prefix does not exist', () => {
			expect(manager.getNamespaceByPrefix('aaaa')).not.to.be.ok;
		});

		it('should return namespace if namespace with target prefix exists in core or generated namespaces', () => {
			expect(manager.getNamespaceByPrefix('rdf').value).to.equal('http://www.w3.org/1999/02/22-rdf-syntax-ns#');
		});
	});

	context('getNamespaceByValue', () => {
		it('should return null if namespace with value does not exist', () => {
			expect(manager.getNamespaceByValue('http://unknownnamespace.org#')).not.to.be.ok;
		});

		it('should return namespace if namespace with target value exists in core or generated namespaces', () => {
			expect(manager.getNamespaceByValue('http://www.w3.org/1999/02/22-rdf-syntax-ns#').prefix).to.equal('rdf');
		});
	});

	context('registerNamespace', () => {
		it('should create and add to core namespaces new namespace object if namespace with specified prefix does not exist', () => {
			manager.registerNamespace('ex', 'http://example.org#');
			expect(manager.coreNamespaces.some(n => n.prefix === 'ex' && n.value === 'http://example.org#')).to.be.true;
		});

		it('should replace namespace with new one if namespace with target prefix already exists', () => {
			manager.registerNamespace('rdf', 'http://newrdfnamespacevalue.org');
			let replaced = manager.coreNamespaces.find(n => n.prefix === 'rdf');
			expect(replaced).to.be.ok;
			expect(replaced.value).to.equal('http://newrdfnamespacevalue.org/');
		});
	});

	context('generateNamespace', () => {
		it('should generate namespace from provided value', () => {
			manager.generateNamespace('http://generated.org#');
			expect(manager.getNamespaceByValue('http://generated.org#')).to.be.ok;
		});
	});
});