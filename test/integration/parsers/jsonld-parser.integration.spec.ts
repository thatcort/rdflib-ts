import * as sinon from 'sinon';
import * as path from 'path';

import * as fs from 'fs';

import { Server } from 'net';
import { TestHelper } from '../../helpers/test-helper';
import { JsonLDParser } from '../../../src/parsers/jsonld-parser';

describe('JsonLDParser - Integration', () => {
	const parser = new JsonLDParser();
	let staticFileServer: Server;

	before(async () => {
		staticFileServer = await TestHelper.startStaticFileServerAsync(
			path.join(__dirname, '../../datasets/jsonld'),
			3033
		);
	});

	after(async () => {
		await TestHelper.stopStaticFileServerAsync(staticFileServer);
	});

	it('should be able to load and parse local jsonld file', () => {
		const testCase1Promise = parser.parseDocumentAsync(
			path.join(__dirname, '../../datasets/jsonld/jsonldparser_testcase1_10quads.json')
		);
		const testCase2Promise = parser.parseDocumentAsync(
			path.join(__dirname, '../../datasets/jsonld/jsonldparser_testcase2_21quads.json')
		);

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
		const testCase1Stream = fs.createReadStream(
			path.join(__dirname, '../../datasets/jsonld/jsonldparser_testcase1_10quads.json')
		);
		const testCase2Stream = fs.createReadStream(
			path.join(__dirname, '../../datasets/jsonld/jsonldparser_testcase2_21quads.json')
		);

		const testCase1Promise = parser.parseDocumentAsync(testCase1Stream);
		const testCase2Promise = parser.parseDocumentAsync(testCase2Stream);

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
		const testCase1String = fs.readFileSync(
			path.join(__dirname, '../../datasets/jsonld/jsonldparser_testcase1_10quads.json'),
			'utf-8'
		);
		const testCase2String = fs.readFileSync(
			path.join(__dirname, '../../datasets/jsonld/jsonldparser_testcase2_21quads.json'),
			'utf-8'
		);

		const testCase1Promise = parser.parseDocumentAsync(testCase1String);
		const testCase2Promise = parser.parseDocumentAsync(testCase2String);

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
		const testCase1Promise = parser.parseDocumentAsync(
			`http://localhost:3033/jsonldparser_testcase1_10quads.json`
		);
		const testCase2Promise = parser.parseDocumentAsync(
			`http://localhost:3033/jsonldparser_testcase2_21quads.json`
		);

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
		const handlerSpy = sinon.spy();
		await parser.parseDocumentAsync(
			path.join(__dirname, '../../datasets/jsonld/jsonldparser_testcase1_10quads.json'),
			handlerSpy
		);

		handlerSpy.called.should.be.true;
		handlerSpy.callCount.should.be.equal(10);
	});

	it('should reject if invalid input provided (file does not exist, remote file does not exist, invalid json format', () => {
		const testCase1Promise = parser.parseDocumentAsync(
			'http://localhost:3053/unknownfile.json'
		);
		const testCase2Promise = parser.parseDocumentAsync('test/datasets/jsonld/unknownfile.json');
		const testCase3Promise = parser.parseDocumentAsync(
			fs.createReadStream('non existing file.json')
		);
		const testCase4Promise = parser.parseDocumentAsync(
			'rdf": "http:\\www.w3.org\\1999\\02\\22-rdf-syntax-ns#",\r\n    "rdfs'
		);
		const testCase5Promise = parser.parseDocumentAsync(null);

		return Promise.all([
			testCase1Promise.should.be.rejected,
			testCase2Promise.should.be.rejected,
			testCase3Promise.should.be.rejected,
			testCase4Promise.should.be.rejected,
			testCase5Promise.should.be.rejected
		]);
	});
});
