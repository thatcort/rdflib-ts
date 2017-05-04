import { IRI } from '../../model/iri';
import { BlankNode } from '../../model/blank-node';
import { ISparqlQueryResultBinding } from '../../model/sparql-query-result';
import { Literal, RdfTerm } from '../../model/rdf-core-types';
import { RdfUtils } from './rdf-utils';
import { FormatError } from '../../errors/format-error';
import { LangLiteral } from '../../model/lang-literal';
import { TypedLiteral } from '../../model/typed-literal';
import { PlainLiteral } from '../../model/plain-literal';
import { ArgumentError } from '../../errors/argument-error';

export class RdfFactory {	
	public static createLiteral(value: string, language?: string, datatype?: string): Literal {
		if (value == null) {
			throw new ArgumentError('Literal value can not be null or undefined');
		} 
		
		if (language) {
			return new LangLiteral(value, language);
		} else if (datatype) {
			return new TypedLiteral(value, datatype);
		} else if (RdfUtils.isLangLiteral(value)) {
			return new LangLiteral(value);
		} else if (RdfUtils.isTypedLiteral(value)) {
			return new TypedLiteral(value);
		} 
			
		return new PlainLiteral(value);
	}

	public static createRdfTermFromSparqlResultBinding(binding: ISparqlQueryResultBinding): RdfTerm {
		switch (binding.type) {
			case 'uri': return new IRI(binding.value);
			case 'bnode': return new BlankNode(binding.value);
			default: return RdfFactory.createLiteral(binding.value, binding['xml:lang'], binding.datatype);
		}
	}
}