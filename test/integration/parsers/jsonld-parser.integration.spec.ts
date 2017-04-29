import 'mocha';
import * as chai from 'chai';
import * as sinon from 'sinon';
import * as chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);
chai.should();

import * as fs from 'fs';

import { JsonLDParser } from '../../../src/parsers/jsonld-parser';

describe('JsonLDParser - Integration', () => {
	let parser = new JsonLDParser();

	it('should be able to load and parse local jsonld file', () => {
		let testCase1Promise = parser.parseDocumentAsync('test/datasets/jsonld/jsonldparser_testcase1_10quads.json');
		let testCase2Promise = parser.parseDocumentAsync('test/datasets/jsonld/jsonldparser_testcase2_21quads.json');

		return Promise.all([
			testCase1Promise.should.be.fulfilled,
			testCase1Promise.should.eventually.be.ok,
			testCase1Promise.should.eventually.has.lengthOf(10),

			testCase2Promise.should.be.fulfilled,
			testCase2Promise.should.eventually.be.ok,
			testCase2Promise.should.eventually.has.lengthOf(21)
		]);
	});

	it('should be able to load and parse jsonld readable stream', () => {
		let testCase1Stream = fs.createReadStream('test/datasets/jsonld/jsonldparser_testcase1_10quads.json');
		let testCase2Stream = fs.createReadStream('test/datasets/jsonld/jsonldparser_testcase2_21quads.json');

		let testCase1Promise = parser.parseDocumentAsync(testCase1Stream);
		let testCase2Promise = parser.parseDocumentAsync(testCase2Stream);

		return Promise.all([
			testCase1Promise.should.be.fulfilled,
			testCase1Promise.should.eventually.be.ok,
			testCase1Promise.should.eventually.has.lengthOf(10),

			testCase2Promise.should.be.fulfilled,
			testCase2Promise.should.eventually.be.ok,
			testCase2Promise.should.eventually.has.lengthOf(21)
		]);
	});

	it('should be able to load and parse jsonld string', () => {
		let testCase1String = fs.readFileSync('test/datasets/jsonld/jsonldparser_testcase1_10quads.json', 'utf-8');
		let testCase2String = fs.readFileSync('test/datasets/jsonld/jsonldparser_testcase2_21quads.json', 'utf-8');

		let testCase1Promise = parser.parseDocumentAsync(testCase1String);
		let testCase2Promise = parser.parseDocumentAsync(testCase2String);

		return Promise.all([
			testCase1Promise.should.be.fulfilled,
			testCase1Promise.should.eventually.be.ok,
			testCase1Promise.should.eventually.has.lengthOf(10),

			testCase2Promise.should.be.fulfilled,
			testCase2Promise.should.eventually.be.ok,
			testCase2Promise.should.eventually.has.lengthOf(21)
		]);
	});

	it('should be able to load and parse remote jsonld file over http protocol', () => {
		let testCase1Promise = parser.parseDocumentAsync('http://localhost:3033/test/datasets/jsonld/jsonldparser_testcase1_10quads.json');
		let testCase2Promise = parser.parseDocumentAsync('http://localhost:3033/test/datasets/jsonld/jsonldparser_testcase2_21quads.json');

		return Promise.all([
			testCase1Promise.should.be.fulfilled,
			testCase1Promise.should.eventually.be.ok,
			testCase1Promise.should.eventually.has.lengthOf(10),

			testCase2Promise.should.be.fulfilled,
			testCase2Promise.should.eventually.be.ok,
			testCase2Promise.should.eventually.has.lengthOf(21)
		]);
	});

	it('should invoke quad handler if specified', async () => {
		let handlerSpy = sinon.spy();
		await parser.parseDocumentAsync('test/datasets/jsonld/jsonldparser_testcase1_10quads.json', handlerSpy);

		handlerSpy.called.should.be.true;
		handlerSpy.callCount.should.be.equal(10);
	});

	it('should reject if invalid input provided (file does not exist, remote file does not exist, invalid json format', () => {
		let testCase1Promise = parser.parseDocumentAsync('http://localhost:3053/unknownfile.json');
		let testCase2Promise = parser.parseDocumentAsync('test/datasets/jsonld/unknownfile.json');
		let testCase3Promise = parser.parseDocumentAsync(fs.createReadStream('non existing file.json'));
		let testCase4Promise = parser.parseDocumentAsync('rdf": "http:\\www.w3.org\\1999\\02\\22-rdf-syntax-ns#",\r\n    "rdfs');
		let testCase5Promise = parser.parseDocumentAsync(null);

		return Promise.all([
			testCase1Promise.should.be.rejected,
			testCase2Promise.should.be.rejected,
			testCase3Promise.should.be.rejected,
			testCase4Promise.should.be.rejected,
			testCase5Promise.should.be.rejected
		]);
	});
});
