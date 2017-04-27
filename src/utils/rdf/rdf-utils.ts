import { ISparqlQueryResultBinding } from '../../model/sparql-query-result';

export class RdfUtils {

	public static isUUID(value: string): boolean {
		return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
	}

	public static isUrl(value: string): boolean {
		let urlRegex = new RegExp(
			'^' +
			// Rdf iri opening bracket
			'<?' +
			// protocol identifier
			'(?:(?:https?://|ftp://|ftps://|sftp://|file:///?|www.))' +
			// user:pass authentication
			'(?:\\S+(?::\\S*)?@)?' +
			'(?:' +
			// IP address exclusion
			// private & local networks
			'(?!(?:10|127)(?:\\.\\d{1,3}){3})' +
			'(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})' +
			'(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})' +
			// IP address dotted notation octets
			// excludes loopback network 0.0.0.0
			// excludes reserved space >= 224.0.0.0
			// excludes network & broacast addresses
			// (first & last IP address of each class)
			'(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])' +
			'(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}' +
			'(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))' +
			'|' +
			// host name - if it's file protocol it's optional
			`(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)${/^file:\/\//.test(value) ? '?' : ''}` +
			// domain name
			'(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*' +
			// TLD identifier - if it's file protocol or localhost it's optional
			`(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))${/^file:\/\//.test(value) || /localhost/.test(value) ? '?' : ''}` +
			// TLD may end with dot
			'\\.?' +
			')' +
			// port number
			'(?::\\d{2,5})?' +
			// resource path
			'(?:[/?#]\\S*)?' +
			// if value starts with rdf iri opening bracket there must be closing one at the end
			`${/^</.test(value) ? '>' : ''}` +
			'$', 'i'
		);

		return urlRegex.test(value);
	}

	public static isUrn(value: string): boolean {
		let urnRegex = new RegExp(
			'^' +
			// Rdf iri opening bracket
			'<?' +
			'urn:[a-z0-9][a-z0-9-]{0,31}:[a-z0-9()+,\-.:=@;$_!*\'%/?#]+' +
			// if value starts with rdf iri opening bracket there must be closing one at the end
			`${/^</.test(value) ? '>' : ''}` +
			'$', 'i'
		);

		return urnRegex.test(value);
	}

	public static isLocalFilePath(value: string): boolean {
		return /^((?:[^/]*\/)*)(.*)\.[a-z]+/gi.test(value);
	}

	public static isAbsoluteIRI(value: string): boolean {
		return RdfUtils.isUrl(value) || RdfUtils.isUrn(value);
	}

	public static isRelativeIRI(value: string): boolean {
		return /^_?[a-z0-9-]+:#?[^/: ]*$/i.test(value);
	}

	public static isSkolemIRI(value: string): boolean {
		return /\/.well-known\/genid\//.test(value);
	}

	public static isIRI(value: string): boolean {
		return RdfUtils.isRelativeIRI(value) || RdfUtils.isAbsoluteIRI(value);
	}

	public static isBlankNode(value: string): boolean {
		return /^(_:)?[a-z0-9]+$/i.test(value);
	}

	public static isPlainLiteral(value: string): boolean {
		return /^"[\s\S]*"$/i.test(value);
	}

	public static isLangLiteral(value: string): boolean {
		return /^"[\s\S]*"@[a-z]+$/i.test(value);
	}

	public static isTypedLiteral(value: string): boolean {
		return /^"[\s\S]*"\^\^/i.test(value) && RdfUtils.isIRI(value.split('^^')[1]);
	}

	public static escapeLiteral(value: string): string {
		return value.replace(/((?:\\)*)\\(?!\\\\)/g, '\\\\').replace(/"/g, '\\"');
	}

	public static isSparqlResultBinding(value: any): value is ISparqlQueryResultBinding {
		return typeof value !== 'string' && 
			   'type' in value && (value.type === 'uri' || value.type === 'bnode' || value.type === 'literal' || value.type === 'typed-literal') 
				&& 'value' in value && typeof value.value === 'string';
	}
}