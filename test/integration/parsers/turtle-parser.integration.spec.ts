import * as fs from 'fs';
import * as path from 'path';
import * as sinon from 'sinon';
import { Server } from 'net';
import { TestHelper } from '../../helpers/test-helper';
import { TurtleParser } from '../../../src/parsers/turtle-parser';

describe('TurtleParser - Integration', () => {
	const parser = new TurtleParser();
	let staticFileServer: Server;

	before(async () => {
		staticFileServer = await TestHelper.startStaticFileServerAsync(
			path.join(__dirname, '../../datasets/ttl'),
			3033
		);
	});

	after(async () => {
		await TestHelper.stopStaticFileServerAsync(staticFileServer);
	});

	it('should be able to load and parse local turtle file', () => {
		const testCase1Promise = parser.parseDocumentAsync(
			path.join(__dirname, '../../datasets/ttl/turtleparser_testcase1_10quads.ttl')
		);
		const testCase3Promise = parser.parseDocumentAsync(
			path.join(__dirname, '../../datasets/ttl/turtleparser_testcase3_21quads.trig')
		);

		return Promise.all([
			testCase1Promise.should.be.fulfilled,
			testCase1Promise.should.eventually.be.ok,
			testCase1Promise.should.eventually.has.lengthOf(10),

			testCase3Promise.should.be.fulfilled,
			testCase3Promise.should.eventually.be.ok,
			testCase3Promise.should.eventually.has.lengthOf(21)
		]);
	});

	it('should be able to load and parse turtle readable stream', () => {
		const testCase1Stream = fs.createReadStream(
			path.join(__dirname, '../../datasets/ttl/turtleparser_testcase1_10quads.ttl')
		);
		const testCase3Stream = fs.createReadStream(
			path.join(__dirname, '../../datasets/ttl/turtleparser_testcase3_21quads.trig')
		);

		const testCase1Promise = parser.parseDocumentAsync(testCase1Stream);
		const testCase3Promise = parser.parseDocumentAsync(testCase3Stream);

		return Promise.all([
			testCase1Promise.should.be.fulfilled,
			testCase1Promise.should.eventually.be.ok,
			testCase1Promise.should.eventually.has.lengthOf(10),

			testCase3Promise.should.be.fulfilled,
			testCase3Promise.should.eventually.be.ok,
			testCase3Promise.should.eventually.has.lengthOf(21)
		]);
	});

	it('should be able to load and parse turtle string', () => {
		const testCase1String = fs.readFileSync(
			path.join(__dirname, '../../datasets/ttl/turtleparser_testcase1_10quads.ttl'),
			'utf-8'
		);
		const testCase3String = fs.readFileSync(
			path.join(__dirname, '../../datasets/ttl/turtleparser_testcase3_21quads.trig'),
			'utf-8'
		);

		const testCase1Promise = parser.parseDocumentAsync(testCase1String);
		const testCase3Promise = parser.parseDocumentAsync(testCase3String);

		return Promise.all([
			testCase1Promise.should.be.fulfilled,
			testCase1Promise.should.eventually.be.ok,
			testCase1Promise.should.eventually.has.lengthOf(10),

			testCase3Promise.should.be.fulfilled,
			testCase3Promise.should.eventually.be.ok,
			testCase3Promise.should.eventually.has.lengthOf(21)
		]);
	});

	it('should be able to load and parse remote turtle file over http protocol', () => {
		const testCase1Promise = parser.parseDocumentAsync(
			`http://localhost:3033/turtleparser_testcase1_10quads.ttl`
		);
		const testCase3Promise = parser.parseDocumentAsync(
			`http://localhost:3033/turtleparser_testcase3_21quads.trig`
		);

		return Promise.all([
			testCase1Promise.should.be.fulfilled,
			testCase1Promise.should.eventually.be.ok,
			testCase1Promise.should.eventually.has.lengthOf(10),

			testCase3Promise.should.be.fulfilled,
			testCase3Promise.should.eventually.be.ok,
			testCase3Promise.should.eventually.has.lengthOf(21)
		]);
	});

	it('should invoke quad handler if specified', async () => {
		const handlerSpy = sinon.spy();
		await parser.parseDocumentAsync(
			path.join(__dirname, '../../datasets/ttl/turtleparser_testcase1_10quads.ttl'),
			handlerSpy
		);

		handlerSpy.called.should.be.true;
		handlerSpy.callCount.should.be.equal(10);
	});

	it('should reject if invalid input provided (file does not exist, remote file does not exist, invalid json format', () => {
		const testCase1Promise = parser.parseDocumentAsync('http://localhost:3053/unknownfile.ttl');
		const testCase2Promise = parser.parseDocumentAsync('test/datasets/ttl/unknownfile.n3');
		const testCase3Promise = parser.parseDocumentAsync(
			fs.createReadStream('notexistingfile.txt')
		);
		const testCase4Promise = parser.parseDocumentAsync(
			fs.createReadStream(
				path.join(__dirname, '../../datasets/ttl/turtleparser_testcase2_invalid.ttl')
			)
		);
		const testCase5Promise = parser.parseDocumentAsync(
			'a sh:NodeShape ; \\nsh:targetClass ex:Person ; '
		);
		const testCase6Promise = parser.parseDocumentAsync(null);

		return Promise.all([
			testCase1Promise.should.be.rejected,
			testCase2Promise.should.be.rejected,
			testCase3Promise.should.be.rejected,
			testCase4Promise.should.be.rejected,
			testCase5Promise.should.be.rejected,
			testCase6Promise.should.be.rejected
		]);
	});
});
