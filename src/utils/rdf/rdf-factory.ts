import { FormatError } from '../../errors/format-error';
import { PlainLiteral } from '../../model/plain-literal';
import { RdfUtils } from './rdf-utils';
import { LangLiteral } from '../../model/lang-literal';
import { TypedLiteral } from '../../model/typed-literal';
import { ArgumentError } from '../../errors/argument-error';
import { Literal } from '../../model/rdf-core-types';
export class RdfFactory {
	
	public static createLiteral(value: string, language?: string, datatype?: string): Literal {
		if (!value) {
			throw new ArgumentError('Literal value can not be undefined, null or empty string');
		} else if (RdfUtils.isTypedLiteral(value)) {
			return new TypedLiteral(value);
		} else if (datatype) {
			return new TypedLiteral(value, datatype);
		} else if (RdfUtils.isLangLiteral(value)) {
			return new LangLiteral(value);
		} else if (language) {
			return new LangLiteral(value, language);
		} else  {
			return new PlainLiteral(value);
		} 
	}
}