import 'mocha';
import * as chai from 'chai';

let should = chai.should();

import { RdfUtils } from '../../../../src/utils/rdf/rdf-utils';

describe('RdfUtils - Unit', () => {
	context('isUUID', () => {
		it('should return false for invalid UUID values', () => {
			RdfUtils.isUUID('not a UUID value').should.be.false;
			RdfUtils.isUUID('123456').should.be.false;
			RdfUtils.isUUID('11111111-2222-2222-2222-22221456798').should.be.false;
			RdfUtils.isUUID('11111111-22232-2222-2222-22221456798s').should.be.false;
			RdfUtils.isUUID('11111111-22#2-2222-2222-22221456798s').should.be.false;
		});

		it('should return true for valid UUID values', () => {
			RdfUtils.isUUID('3931d860-1266-11e7-93ae-92361f002671').should.be.true;
			RdfUtils.isUUID('91abdf53-ce3c-4359-8753-8d7fc3d4e3b2').should.be.true;
		});
	});

	context('isUrl', () => {
		it('should return false for invalid URL values', () => {
			RdfUtils.isUrl('http://foo.com/blah_blah').should.be.true;
			RdfUtils.isUrl('http://foo.com/blah_blah/').should.be.true;
			RdfUtils.isUrl('http://foo.com/blah_blah_(wikipedia)').should.be.true;
			RdfUtils.isUrl('http://foo.com/blah_blah_(wikipedia)_(again)').should.be.true;
			RdfUtils.isUrl('http://www.example.com/wpstyle/?p=364').should.be.true;
			RdfUtils.isUrl('https://www.example.com/foo/?bar=baz&inga=42&quux').should.be.true;
			RdfUtils.isUrl('http://✪df.ws/123').should.be.true;
			RdfUtils.isUrl('http://userid:password@example.com:8080').should.be.true;
			RdfUtils.isUrl('http://userid:password@example.com:8080/').should.be.true;
			RdfUtils.isUrl('http://userid@example.com').should.be.true;
			RdfUtils.isUrl('http://userid@example.com/').should.be.true;
			RdfUtils.isUrl('http://userid@example.com:8080').should.be.true;
			RdfUtils.isUrl('http://userid@example.com:8080/').should.be.true;
			RdfUtils.isUrl('http://userid:password@example.com').should.be.true;
			RdfUtils.isUrl('http://userid:password@example.com/').should.be.true;
			RdfUtils.isUrl('http://142.42.1.1/').should.be.true;
			RdfUtils.isUrl('http://142.42.1.1:8080/').should.be.true;
			RdfUtils.isUrl('http://➡.ws/䨹').should.be.true;
			RdfUtils.isUrl('http://⌘.ws').should.be.true;
			RdfUtils.isUrl('http://⌘.ws/').should.be.true;
			RdfUtils.isUrl('http://foo.com/blah_(wikipedia)#cite-1').should.be.true;
			RdfUtils.isUrl('http://foo.com/blah_(wikipedia)_blah#cite-1').should.be.true;
			RdfUtils.isUrl('http://foo.com/unicode_(✪)_in_parens').should.be.true;
			RdfUtils.isUrl('http://foo.com/(something)?after=parens').should.be.true;
			RdfUtils.isUrl('http://☺.damowmow.com/').should.be.true;
			RdfUtils.isUrl('http://code.google.com/events/#&product=browser').should.be.true;
			RdfUtils.isUrl('http://j.mp').should.be.true;
			RdfUtils.isUrl('ftp://foo.bar/baz').should.be.true;
			RdfUtils.isUrl('ftps://foo.bar/baz').should.be.true;
			RdfUtils.isUrl('sftp://foo.bar/baz').should.be.true;
			RdfUtils.isUrl('http://foo.bar/?q=Test%20URL-encoded%20stuff').should.be.true;
			RdfUtils.isUrl('http://مثال.إختبار').should.be.true;
			RdfUtils.isUrl('http://例子.测试').should.be.true;
			RdfUtils.isUrl('http://उदाहरण.परीक्षा').should.be.true;
			RdfUtils.isUrl('http://1337.net').should.be.true;
			RdfUtils.isUrl('http://a.b-c.de').should.be.true;
			RdfUtils.isUrl('http://223.255.255.254').should.be.true;
			RdfUtils.isUrl('www.example.org').should.be.true;
			RdfUtils.isUrl('http://localhost:3033/test/datasets/jsonld/shacl_1_4_example_data_graph.json').should.be.true;
			RdfUtils.isUrl('file://localhost/c:/WINDOWS/clock.avi').should.be.true;
			RdfUtils.isUrl('file:///c:/WINDOWS/clock.avi').should.be.true;
		});

		it('should return true for valid URL values', () => {
			RdfUtils.isUrl('not a url').should.be.false;
			RdfUtils.isUrl('http://').should.be.false;
			RdfUtils.isUrl('http://.').should.be.false;
			RdfUtils.isUrl('http://..').should.be.false;
			RdfUtils.isUrl('http://../').should.be.false;
			RdfUtils.isUrl('http://?').should.be.false;
			RdfUtils.isUrl('http://??').should.be.false;
			RdfUtils.isUrl('http://??/').should.be.false;
			RdfUtils.isUrl('http://#').should.be.false;
			RdfUtils.isUrl('http://##').should.be.false;
			RdfUtils.isUrl('http://##/').should.be.false;
			RdfUtils.isUrl('http://foo.bar?q=Spaces should be encoded').should.be.false;
			RdfUtils.isUrl('//').should.be.false;
			RdfUtils.isUrl('//a').should.be.false;
			RdfUtils.isUrl('///a').should.be.false;
			RdfUtils.isUrl('///').should.be.false;
			RdfUtils.isUrl('http:///a').should.be.false;
			RdfUtils.isUrl('foo.com').should.be.false;
			RdfUtils.isUrl('rdar://1234').should.be.false;
			RdfUtils.isUrl('h://test').should.be.false;
			RdfUtils.isUrl('http:// shouldfail.com').should.be.false;
			RdfUtils.isUrl(':// should fail').should.be.false;
			RdfUtils.isUrl('http://foo.bar/foo(bar)baz quux').should.be.false;
			RdfUtils.isUrl('http://-error-.invalid/').should.be.false;
			RdfUtils.isUrl('http://-a.b.co').should.be.false;
			RdfUtils.isUrl('http://a.b-.co').should.be.false;
			RdfUtils.isUrl('http://0.0.0.0').should.be.false;
			RdfUtils.isUrl('http://10.1.1.0').should.be.false;
			RdfUtils.isUrl('http://10.1.1.255').should.be.false;
			RdfUtils.isUrl('http://224.1.1.1').should.be.false;
			RdfUtils.isUrl('http://1.1.1.1.1').should.be.false;
			RdfUtils.isUrl('http://123.123.123').should.be.false;
			RdfUtils.isUrl('http://3628126748').should.be.false;
			RdfUtils.isUrl('http://.www.foo.bar/').should.be.false;
			RdfUtils.isUrl('http://.www.foo.bar./').should.be.false;
			RdfUtils.isUrl('http://10.1.1.1').should.be.false;
			RdfUtils.isUrl('http://10.1.1.254').should.be.false;
		});
	});

	context('isUrn', () => {
		it('should return false for invalid URN values', () => {
			RdfUtils.isUrn('not a urn').should.be.false;
			RdfUtils.isUrn('urn: without prefix').should.be.false;
		});

		it('should return true for valid URN values', () => {
			RdfUtils.isUrn('urn:isbn:0451450523').should.be.true;
			RdfUtils.isUrn('urn:isan:0000-0000-9E59-0000-O-0000-0000-2').should.be.true;
			RdfUtils.isUrn('urn:ISSN:0167-6423').should.be.true;
			RdfUtils.isUrn('urn:ietf:rfc:2648').should.be.true;
			RdfUtils.isUrn('urn:mpeg:mpeg7:schema:2001').should.be.true;
			RdfUtils.isUrn('urn:oid:2.16.840').should.be.true;
			RdfUtils.isUrn('urn:uuid:6e8bc430-9c3a-11d9-9669-0800200c9a66').should.be.true;
			RdfUtils.isUrn('urn:nbn:de:bvb:19-146642').should.be.true;
			RdfUtils.isUrn('urn:lex:eu:council:directive:2010-03-09;2010-19-UE').should.be.true;
			RdfUtils.isUrn('urn:lsid:zoobank.org:pub:CDC8D258-8F57-41DC-B560-247E17D3DC8C').should.be.true;
			RdfUtils.isUrn('<urn:lsid:zoobank.org:pub:CDC8D258-8F57-41DC-B560-247E17D3DC8C>').should.be.true;
		});
	});

	context('isLocalFilePath', () => {
		it('should return false for invalid file path values', () => {
			RdfUtils.isLocalFilePath('not a valid file path').should.be.false;
			RdfUtils.isLocalFilePath('no_extension').should.be.false;
			RdfUtils.isLocalFilePath('/no_extension').should.be.false;
			RdfUtils.isLocalFilePath('/some/path/no_extension').should.be.false;
		});

		it('should return true for valid file path values', () => {
			RdfUtils.isLocalFilePath('file.txt').should.be.true;
			RdfUtils.isLocalFilePath('/some/path/file.tsx').should.be.true;
			RdfUtils.isLocalFilePath('D:/test/files/file.json').should.be.true;
		});
	});

	context('isAbsoluteIRI', () => {
		it('should return false for invalid absolute IRI values', () => {
			RdfUtils.isAbsoluteIRI('_:b1').should.be.false;
			RdfUtils.isAbsoluteIRI('invalid absolute iri').should.be.false;
			RdfUtils.isAbsoluteIRI('http:/invalid-absolute.iri').should.be.false;
			RdfUtils.isAbsoluteIRI('http://invalid- absolute.iri').should.be.false;
			RdfUtils.isAbsoluteIRI('http://invalid-absolute .iri').should.be.false;
		});

		it('should return true for valid absolute IRI values', () => {
			RdfUtils.isAbsoluteIRI('http://example.org/#Alice').should.be.true;
			RdfUtils.isAbsoluteIRI('urn:lsid:zoobank.org:pub:CDC8D258-8F57-41DC-B560-247E17D3DC8C').should.be.true;
		});
	});

	context('isRelativeIRI', () => {
		it('should return false for invalid relative IRI values', () => {
			RdfUtils.isRelativeIRI('sh:class').should.be.true;
			RdfUtils.isRelativeIRI('ex:#Alice').should.be.true;
		});

		it('should return true for valid relative IRI values', () => {
			RdfUtils.isRelativeIRI('sh :class').should.be.false;
			RdfUtils.isRelativeIRI('$sh :class').should.be.false;
			RdfUtils.isRelativeIRI('s h :class').should.be.false;
			RdfUtils.isRelativeIRI('sh:/class').should.be.false;
			RdfUtils.isRelativeIRI('sh:/ class').should.be.false;
			RdfUtils.isRelativeIRI('sh: #class').should.be.false;
		});
	});

	context('isIRI', () => {
		it('should return false for invalid IRI values', () => {
			RdfUtils.isIRI('http://example.o rg/ #Alice').should.be.false;
			RdfUtils.isIRI('e x:# Alice').should.be.false;
		});

		it('should return true for valid IRI values', () => {
			RdfUtils.isIRI('http://example.org/#Alice').should.be.true;
			RdfUtils.isIRI('<http://example.org/#Alice>').should.be.true;
			RdfUtils.isIRI('urn:lsid:zoobank.org:pub:CDC8D258-8F57-41DC-B560-247E17D3DC8C').should.be.true;
			RdfUtils.isIRI('<urn:lsid:zoobank.org:pub:CDC8D258-8F57-41DC-B560-247E17D3DC8C>').should.be.true;
			RdfUtils.isIRI('ex:#Alice').should.be.true;
		});
	});

	context('isSkolemIRI', () => {
		it('should return false for non skolemized but valid IRI values', () => {
			RdfUtils.isSkolemIRI('http://example.org/#Alice').should.be.false;
			RdfUtils.isSkolemIRI('<http://example.org/#Alice>').should.be.false;
			RdfUtils.isSkolemIRI('urn:lsid:zoobank.org:pub:CDC8D258-8F57-41DC-B560-247E17D3DC8C').should.be.false;
			RdfUtils.isSkolemIRI('<urn:lsid:zoobank.org:pub:CDC8D258-8F57-41DC-B560-247E17D3DC8C>').should.be.false;
			RdfUtils.isSkolemIRI('ex:#Alice').should.be.false;
		});

		it('should return true for valid skolem IRI values', () => {
			RdfUtils.isSkolemIRI('http://example.org/.well-known/genid/1').should.be.true;
		});
	});

	context('isBlankNode', () => {
		it('should return false for invalid blank node values', () => {
			RdfUtils.isBlankNode('b1-2-3').should.be.false;
			RdfUtils.isBlankNode('$#%^').should.be.false;
			RdfUtils.isBlankNode('_b1').should.be.false;
			RdfUtils.isBlankNode('_:b1$').should.be.false;
			RdfUtils.isBlankNode(':_b1-1').should.be.false;
			RdfUtils.isBlankNode('"b1"').should.be.false;
		});

		it('should return true for valid blank node values', () => {
			RdfUtils.isBlankNode('_:b1').should.be.true;
			RdfUtils.isBlankNode('b1').should.be.true;
			RdfUtils.isBlankNode('_:BlankNode1').should.be.true;
			RdfUtils.isBlankNode('SomeBlankNode').should.be.true;
		});
	});

	context('isPlainLiteral', () => {
		it('should return false for invalid literal values', () => {
			RdfUtils.isPlainLiteral('http://example.org/#Alice').should.be.false;
			RdfUtils.isPlainLiteral('_:b1').should.be.false;
			RdfUtils.isPlainLiteral('"Missing quote literal').should.be.false;
			RdfUtils.isPlainLiteral('Not quoted value').should.be.false;
		});

		it('should return true for valid literal values', () => {
			RdfUtils.isPlainLiteral('"some plain string literal"').should.be.true;
			RdfUtils.isPlainLiteral('"http://example.org/#Alice"').should.be.true;
			RdfUtils.isPlainLiteral('"_:b1"').should.be.true;
		});
	});

	context('isLangLiteral', () => {
		it('should return false for invalid lang literal values', () => {
			RdfUtils.isLangLiteral('"some lang string literal"  @en').should.be.false;
			RdfUtils.isLangLiteral('"some lang string literal"@en2@#').should.be.false;
			RdfUtils.isLangLiteral('"Missing quote literal').should.be.false;
			RdfUtils.isLangLiteral('Not quoted value').should.be.false;
			RdfUtils.isLangLiteral('"Missing quote literal@en').should.be.false;
			RdfUtils.isLangLiteral('Not quoted value@de').should.be.false;
			RdfUtils.isLangLiteral('"Just a plain literal without language tag"').should.be.false;
		});

		it('should return true for valid lang literal values', () => {
			RdfUtils.isLangLiteral('"some lang string literal"@en').should.be.true;
		});
	});

	context('isTypedLiteral', () => {
		it('should return false for invalid typed literal values', () => {
			RdfUtils.isTypedLiteral('"some lang string literal" ^^  @en').should.be.false;
			RdfUtils.isTypedLiteral('"some lang string literal"^^ dfa: dff').should.be.false;
			RdfUtils.isTypedLiteral('"Missing quote literal').should.be.false;
			RdfUtils.isTypedLiteral('Not quoted value').should.be.false;
			RdfUtils.isTypedLiteral('"Missing quote literal^^xsd:string').should.be.false;
			RdfUtils.isTypedLiteral('Not quoted value^^xsd:string').should.be.false;
			RdfUtils.isTypedLiteral('"Invalid type iri"^^xsd: $$%string').should.be.false;
		});

		it('should return true for valid typed literal values', () => {
			RdfUtils.isTypedLiteral('"true"^^xsd:boolean').should.be.true;
			RdfUtils.isTypedLiteral('"true"^^<http://www.w3.org/2001/XMLSchema#boolean>').should.be.true;
		});
	});

	context('escapeLiteral', () => {
		it('should escape unescaped back slashes and quotes', () => {
			RdfUtils.escapeLiteral('^\\d{3}-\\d{2}-\\d{4}$').should.equal('^\\\\d{3}-\\\\d{2}-\\\\d{4}$');
			RdfUtils.escapeLiteral('^\\\\d{3}-\\\\d{2}-\\\\d{4}$').should.equal('^\\\\d{3}-\\\\d{2}-\\\\d{4}$');
		});
	});

	context('isSparqlResultBinding', () => {
		it('should return false for objects not implementing ISparqlQueryResultBinding interface', () => {
			RdfUtils.isSparqlResultBinding({}).should.be.false;
			RdfUtils.isSparqlResultBinding('string value').should.be.false;
			RdfUtils.isSparqlResultBinding({ type: 'incomplete binding value' }).should.be.false;
			RdfUtils.isSparqlResultBinding({ type: 'uri', value: 1 }).should.be.false;
		});

		it('should return true for objects implementing ISparqlQueryResultBinding interface', () => {
			RdfUtils.isSparqlResultBinding({ type: 'uri', value: 'some value' }).should.be.true;
		});
	});
});