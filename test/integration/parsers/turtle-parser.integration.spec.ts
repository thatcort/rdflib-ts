import 'mocha';
import * as chai from 'chai';
import * as sinon from 'sinon';
import * as chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);
chai.should();

import * as fs from 'fs';

import { Server } from 'net';
import { TestHelper } from '../../helpers/test-helper';
import { TurtleParser } from '../../../src/parsers/turtle-parser';

process.env.LOCALHOST = process.env.DOCKERHOST || 'localhost';

describe('TurtleParser - Integration', () => {
	let parser = new TurtleParser();
	let staticFileServer: Server;

	before(async () => {
		staticFileServer = await TestHelper.startStaticFileServerAsync('test/datasets/ttl', 3033);
	});

	after(async () => {
		await TestHelper.stopStaticFileServerAsync(staticFileServer);
	});

	it('should be able to load and parse local turtle file', () => {
		let testCase1Promise = parser.parseDocumentAsync('test/datasets/ttl/turtleparser_testcase1_10quads.ttl');
		let testCase3Promise = parser.parseDocumentAsync('test/datasets/ttl/turtleparser_testcase3_21quads.trig');

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
		let testCase1Stream = fs.createReadStream('test/datasets/ttl/turtleparser_testcase1_10quads.ttl');
		let testCase3Stream = fs.createReadStream('test/datasets/ttl/turtleparser_testcase3_21quads.trig');

		let testCase1Promise = parser.parseDocumentAsync(testCase1Stream);
		let testCase3Promise = parser.parseDocumentAsync(testCase3Stream);

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
		let testCase1String = fs.readFileSync('test/datasets/ttl/turtleparser_testcase1_10quads.ttl', 'utf-8');
		let testCase3String = fs.readFileSync('test/datasets/ttl/turtleparser_testcase3_21quads.trig', 'utf-8');

		let testCase1Promise = parser.parseDocumentAsync(testCase1String);
		let testCase3Promise = parser.parseDocumentAsync(testCase3String);

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
		let testCase1Promise = parser.parseDocumentAsync(`http://${process.env.LOCALHOST}:3033/turtleparser_testcase1_10quads.ttl`);
		let testCase3Promise = parser.parseDocumentAsync(`http://${process.env.LOCALHOST}:3033/turtleparser_testcase3_21quads.trig`);

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
		let handlerSpy = sinon.spy();
		await parser.parseDocumentAsync('test/datasets/ttl/turtleparser_testcase1_10quads.ttl', handlerSpy);

		handlerSpy.called.should.be.true;
		handlerSpy.callCount.should.be.equal(10);
	});

	it('should reject if invalid input provided (file does not exist, remote file does not exist, invalid json format', () => {
		let testCase1Promise = parser.parseDocumentAsync('http://localhost:3053/unknownfile.ttl');
		let testCase2Promise = parser.parseDocumentAsync('test/datasets/ttl/unknownfile.n3');
		let testCase3Promise = parser.parseDocumentAsync(fs.createReadStream('notexistingfile.txt'));
		let testCase4Promise = parser.parseDocumentAsync(fs.createReadStream('test/datasets/ttl/turtleparser_testcase2_invalid.ttl'));
		let testCase5Promise = parser.parseDocumentAsync('a sh:NodeShape ; \\nsh:targetClass ex:Person ; ');
		let testCase6Promise = parser.parseDocumentAsync(null);

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