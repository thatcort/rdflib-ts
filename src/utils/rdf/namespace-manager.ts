import { Namespace } from '../../model/namespace';
import { InvalidOperationError } from '../../errors/invalid-operation-error';

export class NamespaceManager {
	public readonly coreNamespaces: Namespace[];
	public readonly generatedNamespaces: Namespace[];

	public constructor() {
		this.coreNamespaces = [];
		this.generatedNamespaces = [];

		this.registerNamespace('rdf', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#');
		this.registerNamespace('rdfs', 'http://www.w3.org/2000/01/rdf-schema#');
		this.registerNamespace('xsd', 'http://www.w3.org/2001/XMLSchema#');
		this.registerNamespace('skolem', 'https://bitbucket.org/vladimir_djurdjevic/rdflib.ts/.well-known/genid/');
	}

	public getAllNamespaces(): Namespace[] {
		return this.coreNamespaces.concat(this.generatedNamespaces);
	}

	public getNamespace(prefix: string, value: string): Namespace {
		let namespace = null;
		let valueRegex = new RegExp(`^${value}\/?$`);

		if (prefix && value) {
			namespace = this.coreNamespaces.find(ns => ns.prefix === prefix && valueRegex.test(ns.value)) ||
				this.generatedNamespaces.find(ns => ns.prefix === prefix && valueRegex.test(ns.value));
		} else if (prefix) {
			namespace = this.coreNamespaces.find(ns => ns.prefix === prefix) ||
				this.generatedNamespaces.find(ns => ns.prefix === prefix);
		} else if (value) {
			namespace = this.coreNamespaces.find(ns => valueRegex.test(ns.value)) ||
				this.generatedNamespaces.find(ns => valueRegex.test(ns.value));
		}

		return namespace ? namespace : null;
	}

	public getNamespaceByPrefix(prefix: string): Namespace {
		return this.getNamespace(prefix, null);
	}

	public getNamespaceByValue(value: string): Namespace {
		return this.getNamespace(null, value);
	}

	public registerNamespace(prefix: string, value: string): Namespace {
		let registered = this.getNamespaceByPrefix(prefix) || this.getNamespaceByValue(value);
		let newNamespace = new Namespace(prefix, value);

		if (registered) {
			this.coreNamespaces[this.coreNamespaces.indexOf(registered)] = newNamespace;
		} else {
			this.coreNamespaces.push(newNamespace);
		}

		return newNamespace;
	}

	public generateNamespace(value: string): Namespace {
		let generatedNamespace = new Namespace(`_ns${this.generatedNamespaces.length}`, value);
		this.generatedNamespaces.push(generatedNamespace);

		return generatedNamespace;
	}
}

export const NamespaceManagerInstance: NamespaceManager = new NamespaceManager();