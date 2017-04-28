import 'mocha';
import { expect } from 'chai';

import { RdfUtils } from '../../../../src/utils/rdf/rdf-utils';

describe('RdfUtils - Unit', () => {
	context('isUUID', () => {
		it('should return false for invalid UUID values', () => {
			expect(RdfUtils.isUUID('not a UUID value')).to.be.false;
			expect(RdfUtils.isUUID('123456')).to.be.false;
			expect(RdfUtils.isUUID('11111111-2222-2222-2222-22221456798')).to.be.false;
			expect(RdfUtils.isUUID('11111111-22232-2222-2222-22221456798s')).to.be.false;
			expect(RdfUtils.isUUID('11111111-22#2-2222-2222-22221456798s')).to.be.false;
		});

		it('should return true for valid UUID values', () => {
			expect(RdfUtils.isUUID('3931d860-1266-11e7-93ae-92361f002671')).to.be.true;
			expect(RdfUtils.isUUID('91abdf53-ce3c-4359-8753-8d7fc3d4e3b2')).to.be.true;
		});
	});

	context('isUrl', () => {
		it('should return false for invalid URL values', () => {
			expect(RdfUtils.isUrl('http://foo.com/blah_blah')).to.be.true;
			expect(RdfUtils.isUrl('http://foo.com/blah_blah/')).to.be.true;
			expect(RdfUtils.isUrl('http://foo.com/blah_blah_(wikipedia)')).to.be.true;
			expect(RdfUtils.isUrl('http://foo.com/blah_blah_(wikipedia)_(again)')).to.be.true;
			expect(RdfUtils.isUrl('http://www.example.com/wpstyle/?p=364')).to.be.true;
			expect(RdfUtils.isUrl('https://www.example.com/foo/?bar=baz&inga=42&quux')).to.be.true;
			expect(RdfUtils.isUrl('http://✪df.ws/123')).to.be.true;
			expect(RdfUtils.isUrl('http://userid:password@example.com:8080')).to.be.true;
			expect(RdfUtils.isUrl('http://userid:password@example.com:8080/')).to.be.true;
			expect(RdfUtils.isUrl('http://userid@example.com')).to.be.true;
			expect(RdfUtils.isUrl('http://userid@example.com/')).to.be.true;
			expect(RdfUtils.isUrl('http://userid@example.com:8080')).to.be.true;
			expect(RdfUtils.isUrl('http://userid@example.com:8080/')).to.be.true;
			expect(RdfUtils.isUrl('http://userid:password@example.com')).to.be.true;
			expect(RdfUtils.isUrl('http://userid:password@example.com/')).to.be.true;
			expect(RdfUtils.isUrl('http://142.42.1.1/')).to.be.true;
			expect(RdfUtils.isUrl('http://142.42.1.1:8080/')).to.be.true;
			expect(RdfUtils.isUrl('http://➡.ws/䨹')).to.be.true;
			expect(RdfUtils.isUrl('http://⌘.ws')).to.be.true;
			expect(RdfUtils.isUrl('http://⌘.ws/')).to.be.true;
			expect(RdfUtils.isUrl('http://foo.com/blah_(wikipedia)#cite-1')).to.be.true;
			expect(RdfUtils.isUrl('http://foo.com/blah_(wikipedia)_blah#cite-1')).to.be.true;
			expect(RdfUtils.isUrl('http://foo.com/unicode_(✪)_in_parens')).to.be.true;
			expect(RdfUtils.isUrl('http://foo.com/(something)?after=parens')).to.be.true;
			expect(RdfUtils.isUrl('http://☺.damowmow.com/')).to.be.true;
			expect(RdfUtils.isUrl('http://code.google.com/events/#&product=browser')).to.be.true;
			expect(RdfUtils.isUrl('http://j.mp')).to.be.true;
			expect(RdfUtils.isUrl('ftp://foo.bar/baz')).to.be.true;
			expect(RdfUtils.isUrl('ftps://foo.bar/baz')).to.be.true;
			expect(RdfUtils.isUrl('sftp://foo.bar/baz')).to.be.true;
			expect(RdfUtils.isUrl('http://foo.bar/?q=Test%20URL-encoded%20stuff')).to.be.true;
			expect(RdfUtils.isUrl('http://مثال.إختبار')).to.be.true;
			expect(RdfUtils.isUrl('http://例子.测试')).to.be.true;
			expect(RdfUtils.isUrl('http://उदाहरण.परीक्षा')).to.be.true;
			expect(RdfUtils.isUrl('http://1337.net')).to.be.true;
			expect(RdfUtils.isUrl('http://a.b-c.de')).to.be.true;
			expect(RdfUtils.isUrl('http://223.255.255.254')).to.be.true;
			expect(RdfUtils.isUrl('www.example.org')).to.be.true;
			expect(RdfUtils.isUrl('http://localhost:3033/test/datasets/jsonld/shacl_1_4_example_data_graph.json')).to.be.true;
			expect(RdfUtils.isUrl('file://localhost/c:/WINDOWS/clock.avi')).to.be.true;
			expect(RdfUtils.isUrl('file:///c:/WINDOWS/clock.avi')).to.be.true;
		});

		it('should return true for valid URL values', () => {
			expect(RdfUtils.isUrl('not a url')).to.be.false;
			expect(RdfUtils.isUrl('http://')).to.be.false;
			expect(RdfUtils.isUrl('http://.')).to.be.false;
			expect(RdfUtils.isUrl('http://..')).to.be.false;
			expect(RdfUtils.isUrl('http://../')).to.be.false;
			expect(RdfUtils.isUrl('http://?')).to.be.false;
			expect(RdfUtils.isUrl('http://??')).to.be.false;
			expect(RdfUtils.isUrl('http://??/')).to.be.false;
			expect(RdfUtils.isUrl('http://#')).to.be.false;
			expect(RdfUtils.isUrl('http://##')).to.be.false;
			expect(RdfUtils.isUrl('http://##/')).to.be.false;
			expect(RdfUtils.isUrl('http://foo.bar?q=Spaces should be encoded')).to.be.false;
			expect(RdfUtils.isUrl('//')).to.be.false;
			expect(RdfUtils.isUrl('//a')).to.be.false;
			expect(RdfUtils.isUrl('///a')).to.be.false;
			expect(RdfUtils.isUrl('///')).to.be.false;
			expect(RdfUtils.isUrl('http:///a')).to.be.false;
			expect(RdfUtils.isUrl('foo.com')).to.be.false;
			expect(RdfUtils.isUrl('rdar://1234')).to.be.false;
			expect(RdfUtils.isUrl('h://test')).to.be.false;
			expect(RdfUtils.isUrl('http:// shouldfail.com')).to.be.false;
			expect(RdfUtils.isUrl(':// should fail')).to.be.false;
			expect(RdfUtils.isUrl('http://foo.bar/foo(bar)baz quux')).to.be.false;
			expect(RdfUtils.isUrl('http://-error-.invalid/')).to.be.false;
			expect(RdfUtils.isUrl('http://-a.b.co')).to.be.false;
			expect(RdfUtils.isUrl('http://a.b-.co')).to.be.false;
			expect(RdfUtils.isUrl('http://0.0.0.0')).to.be.false;
			expect(RdfUtils.isUrl('http://10.1.1.0')).to.be.false;
			expect(RdfUtils.isUrl('http://10.1.1.255')).to.be.false;
			expect(RdfUtils.isUrl('http://224.1.1.1')).to.be.false;
			expect(RdfUtils.isUrl('http://1.1.1.1.1')).to.be.false;
			expect(RdfUtils.isUrl('http://123.123.123')).to.be.false;
			expect(RdfUtils.isUrl('http://3628126748')).to.be.false;
			expect(RdfUtils.isUrl('http://.www.foo.bar/')).to.be.false;
			expect(RdfUtils.isUrl('http://.www.foo.bar./')).to.be.false;
			expect(RdfUtils.isUrl('http://10.1.1.1')).to.be.false;
			expect(RdfUtils.isUrl('http://10.1.1.254')).to.be.false;
		});
	});

	context('isUrn', () => {
		it('should return false for invalid URN values', () => {
			expect(RdfUtils.isUrn('not a urn')).to.be.false;
			expect(RdfUtils.isUrn('urn: without prefix')).to.be.false;
		});

		it('should return true for valid URN values', () => {
			expect(RdfUtils.isUrn('urn:isbn:0451450523')).to.be.true;
			expect(RdfUtils.isUrn('urn:isan:0000-0000-9E59-0000-O-0000-0000-2')).to.be.true;
			expect(RdfUtils.isUrn('urn:ISSN:0167-6423')).to.be.true;
			expect(RdfUtils.isUrn('urn:ietf:rfc:2648')).to.be.true;
			expect(RdfUtils.isUrn('urn:mpeg:mpeg7:schema:2001')).to.be.true;
			expect(RdfUtils.isUrn('urn:oid:2.16.840')).to.be.true;
			expect(RdfUtils.isUrn('urn:uuid:6e8bc430-9c3a-11d9-9669-0800200c9a66')).to.be.true;
			expect(RdfUtils.isUrn('urn:nbn:de:bvb:19-146642')).to.be.true;
			expect(RdfUtils.isUrn('urn:lex:eu:council:directive:2010-03-09;2010-19-UE')).to.be.true;
			expect(RdfUtils.isUrn('urn:lsid:zoobank.org:pub:CDC8D258-8F57-41DC-B560-247E17D3DC8C')).to.be.true;
			expect(RdfUtils.isUrn('<urn:lsid:zoobank.org:pub:CDC8D258-8F57-41DC-B560-247E17D3DC8C>')).to.be.true;
		});
	});

	context('isLocalFilePath', () => {
		it('should return false for invalid file path values', () => {
			expect(RdfUtils.isLocalFilePath('not a valid file path')).to.be.false;
			expect(RdfUtils.isLocalFilePath('no_extension')).to.be.false;
			expect(RdfUtils.isLocalFilePath('/no_extension')).to.be.false;
			expect(RdfUtils.isLocalFilePath('/some/path/no_extension')).to.be.false;
		});

		it('should return true for valid file path values', () => {
			expect(RdfUtils.isLocalFilePath('file.txt')).to.be.true;
			expect(RdfUtils.isLocalFilePath('/some/path/file.tsx')).to.be.true;
			expect(RdfUtils.isLocalFilePath('D:/test/files/file.json')).to.be.true;
		});
	});

	context('isAbsoluteIRI', () => {
		it('should return false for invalid absolute IRI values', () => {
			expect(RdfUtils.isAbsoluteIRI('_:b1')).to.be.false;
			expect(RdfUtils.isAbsoluteIRI('invalid absolute iri')).to.be.false;
			expect(RdfUtils.isAbsoluteIRI('http:/invalid-absolute.iri')).to.be.false;
			expect(RdfUtils.isAbsoluteIRI('http://invalid- absolute.iri')).to.be.false;
			expect(RdfUtils.isAbsoluteIRI('http://invalid-absolute .iri')).to.be.false;
		});

		it('should return true for valid absolute IRI values', () => {
			expect(RdfUtils.isAbsoluteIRI('http://example.org/#Alice')).to.be.true;
			expect(RdfUtils.isAbsoluteIRI('urn:lsid:zoobank.org:pub:CDC8D258-8F57-41DC-B560-247E17D3DC8C')).to.be.true;
		});
	});

	context('isRelativeIRI', () => {
		it('should return false for invalid relative IRI values', () => {
			expect(RdfUtils.isRelativeIRI('sh:class')).to.be.true;
			expect(RdfUtils.isRelativeIRI('ex:#Alice')).to.be.true;
		});

		it('should return true for valid relative IRI values', () => {
			expect(RdfUtils.isRelativeIRI('sh :class')).to.be.false;
			expect(RdfUtils.isRelativeIRI('$sh :class')).to.be.false;
			expect(RdfUtils.isRelativeIRI('s h :class')).to.be.false;
			expect(RdfUtils.isRelativeIRI('sh:/class')).to.be.false;
			expect(RdfUtils.isRelativeIRI('sh:/ class')).to.be.false;
			expect(RdfUtils.isRelativeIRI('sh: #class')).to.be.false;
		});
	});

	context('isIRI', () => {
		it('should return false for invalid IRI values', () => {
			expect(RdfUtils.isIRI('http://example.o rg/ #Alice')).to.be.false;
			expect(RdfUtils.isIRI('e x:# Alice')).to.be.false;
		});

		it('should return true for valid IRI values', () => {
			expect(RdfUtils.isIRI('http://example.org/#Alice')).to.be.true;
			expect(RdfUtils.isIRI('<http://example.org/#Alice>')).to.be.true;
			expect(RdfUtils.isIRI('urn:lsid:zoobank.org:pub:CDC8D258-8F57-41DC-B560-247E17D3DC8C')).to.be.true;
			expect(RdfUtils.isIRI('<urn:lsid:zoobank.org:pub:CDC8D258-8F57-41DC-B560-247E17D3DC8C>')).to.be.true;
			expect(RdfUtils.isIRI('ex:#Alice')).to.be.true;
		});
	});

	context('isSkolemIRI', () => {
		it('should return false for non skolemized but valid IRI values', () => {
			expect(RdfUtils.isSkolemIRI('http://example.org/#Alice')).to.be.false;
			expect(RdfUtils.isSkolemIRI('<http://example.org/#Alice>')).to.be.false;
			expect(RdfUtils.isSkolemIRI('urn:lsid:zoobank.org:pub:CDC8D258-8F57-41DC-B560-247E17D3DC8C')).to.be.false;
			expect(RdfUtils.isSkolemIRI('<urn:lsid:zoobank.org:pub:CDC8D258-8F57-41DC-B560-247E17D3DC8C>')).to.be.false;
			expect(RdfUtils.isSkolemIRI('ex:#Alice')).to.be.false;
		});

		it('should return true for valid skolem IRI values', () => {
			expect(RdfUtils.isSkolemIRI('http://example.org/.well-known/genid/1')).to.be.true;
		});
	});

	context('isBlankNode', () => {
		it('should return false for invalid blank node values', () => {
			expect(RdfUtils.isBlankNode('b1-2-3')).to.be.false;
			expect(RdfUtils.isBlankNode('$#%^')).to.be.false;
			expect(RdfUtils.isBlankNode('_b1')).to.be.false;
			expect(RdfUtils.isBlankNode('_:b1$')).to.be.false;
			expect(RdfUtils.isBlankNode(':_b1-1')).to.be.false;
			expect(RdfUtils.isBlankNode('"b1"')).to.be.false;
		});

		it('should return true for valid blank node values', () => {
			expect(RdfUtils.isBlankNode('_:b1')).to.be.true;
			expect(RdfUtils.isBlankNode('b1')).to.be.true;
			expect(RdfUtils.isBlankNode('_:BlankNode1')).to.be.true;
			expect(RdfUtils.isBlankNode('SomeBlankNode')).to.be.true;
		});
	});

	context('isPlainLiteral', () => {
		it('should return false for invalid literal values', () => {
			expect(RdfUtils.isPlainLiteral('http://example.org/#Alice')).to.be.false;
			expect(RdfUtils.isPlainLiteral('_:b1')).to.be.false;
			expect(RdfUtils.isPlainLiteral('"Missing quote literal')).to.be.false;
			expect(RdfUtils.isPlainLiteral('Not quoted value')).to.be.false;
		});

		it('should return true for valid literal values', () => {
			expect(RdfUtils.isPlainLiteral('"some plain string literal"')).to.be.true;
			expect(RdfUtils.isPlainLiteral('"http://example.org/#Alice"')).to.be.true;
			expect(RdfUtils.isPlainLiteral('"_:b1"')).to.be.true;
		});
	});

	context('isLangLiteral', () => {
		it('should return false for invalid lang literal values', () => {
			expect(RdfUtils.isLangLiteral('"some lang string literal"  @en')).to.be.false;
			expect(RdfUtils.isLangLiteral('"some lang string literal"@en2@#')).to.be.false;
			expect(RdfUtils.isLangLiteral('"Missing quote literal')).to.be.false;
			expect(RdfUtils.isLangLiteral('Not quoted value')).to.be.false;
			expect(RdfUtils.isLangLiteral('"Missing quote literal@en')).to.be.false;
			expect(RdfUtils.isLangLiteral('Not quoted value@de')).to.be.false;
			expect(RdfUtils.isLangLiteral('"Just a plain literal without language tag"')).to.be.false;
		});

		it('should return true for valid lang literal values', () => {
			expect(RdfUtils.isLangLiteral('"some lang string literal"@en')).to.be.true;
		});
	});

	context('isTypedLiteral', () => {
		it('should return false for invalid typed literal values', () => {
			expect(RdfUtils.isTypedLiteral('"some lang string literal" ^^  @en')).to.be.false;
			expect(RdfUtils.isTypedLiteral('"some lang string literal"^^ dfa: dff')).to.be.false;
			expect(RdfUtils.isTypedLiteral('"Missing quote literal')).to.be.false;
			expect(RdfUtils.isTypedLiteral('Not quoted value')).to.be.false;
			expect(RdfUtils.isTypedLiteral('"Missing quote literal^^xsd:string')).to.be.false;
			expect(RdfUtils.isTypedLiteral('Not quoted value^^xsd:string')).to.be.false;
			expect(RdfUtils.isTypedLiteral('"Invalid type iri"^^xsd: $$%string')).to.be.false;
		});

		it('should return true for valid typed literal values', () => {
			expect(RdfUtils.isTypedLiteral('"true"^^xsd:boolean')).to.be.true;
			expect(RdfUtils.isTypedLiteral('"true"^^<http://www.w3.org/2001/XMLSchema#boolean>')).to.be.true;
		});
	});

	context('escapeLiteral', () => {
		it('should escape unescaped back slashes and quotes', () => {
			expect(RdfUtils.escapeLiteral('^\\d{3}-\\d{2}-\\d{4}$')).to.equal('^\\\\d{3}-\\\\d{2}-\\\\d{4}$');
			expect(RdfUtils.escapeLiteral('^\\\\d{3}-\\\\d{2}-\\\\d{4}$')).to.equal('^\\\\d{3}-\\\\d{2}-\\\\d{4}$');
		});
	});

	context('isSparqlResultBinding', () => {
		it('should return false for objects not implementing ISparqlQueryResultBinding interface', () => {
			expect(RdfUtils.isSparqlResultBinding({})).to.be.false;
			expect(RdfUtils.isSparqlResultBinding('string value')).to.be.false;
			expect(RdfUtils.isSparqlResultBinding({ type: 'incomplete binding value' })).to.be.false;
			expect(RdfUtils.isSparqlResultBinding({ type: 'uri', value: 1 })).to.be.false;
		});

		it('should return true for objects implementing ISparqlQueryResultBinding interface', () => {
			expect(RdfUtils.isSparqlResultBinding({ type: 'uri', value: 'some value' })).to.be.true;
		});
	});
});