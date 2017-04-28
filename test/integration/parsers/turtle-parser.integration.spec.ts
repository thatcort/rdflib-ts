
import * as fs from 'fs';
import { TurtleParser } from '../../../src/parsers/turtle-parser';
import 'mocha';
import * as chaiAsPromised from 'chai-as-promised';
import * as chai from 'chai';
import * as sinon from 'sinon';

chai.use(chaiAsPromised);
import { expect } from 'chai';

describe('TurtleParser - Integration', () => {
	let parser = new TurtleParser();

	it('should be able to load and parse local turtle file', () => {
		let testCase1Promise = parser.parseDocumentAsync('test/datasets/ttl/turtleparser_testcase1_10quads.ttl');
		let testCase3Promise = parser.parseDocumentAsync('test/datasets/ttl/turtleparser_testcase3_21quads.trig');

		return Promise.all([
			expect(testCase1Promise).to.be.fulfilled,
			expect(testCase1Promise).to.eventually.be.ok,
			expect(testCase1Promise).to.eventually.has.lengthOf(10),

			expect(testCase3Promise).to.be.fulfilled,
			expect(testCase3Promise).to.eventually.be.ok,
			expect(testCase3Promise).to.eventually.has.lengthOf(21)
		]);
	});

	it('should be able to load and parse turtle readable stream', () => {
		let testCase1Stream = fs.createReadStream('test/datasets/ttl/turtleparser_testcase1_10quads.ttl');
		let testCase3Stream = fs.createReadStream('test/datasets/ttl/turtleparser_testcase3_21quads.trig');

		let testCase1Promise = parser.parseDocumentAsync(testCase1Stream);
		let testCase3Promise = parser.parseDocumentAsync(testCase3Stream);

		return Promise.all([
			expect(testCase1Promise).to.be.fulfilled,
			expect(testCase1Promise).to.eventually.be.ok,
			expect(testCase1Promise).to.eventually.has.lengthOf(10),

			expect(testCase3Promise).to.be.fulfilled,
			expect(testCase3Promise).to.eventually.be.ok,
			expect(testCase3Promise).to.eventually.has.lengthOf(21)
		]);
	});

	it('should be able to load and parse turtle string', () => {
		let testCase1String = fs.readFileSync('test/datasets/ttl/turtleparser_testcase1_10quads.ttl', 'utf-8');
		let testCase3String = fs.readFileSync('test/datasets/ttl/turtleparser_testcase3_21quads.trig', 'utf-8');

		let testCase1Promise = parser.parseDocumentAsync(testCase1String);
		let testCase3Promise = parser.parseDocumentAsync(testCase3String);

		return Promise.all([
			expect(testCase1Promise).to.be.fulfilled,
			expect(testCase1Promise).to.eventually.be.ok,
			expect(testCase1Promise).to.eventually.has.lengthOf(10),

			expect(testCase3Promise).to.be.fulfilled,
			expect(testCase3Promise).to.eventually.be.ok,
			expect(testCase3Promise).to.eventually.has.lengthOf(21)
		]);
	});

	it('should be able to load and parse remote jsonld file over http protocol', () => {
		let testCase1Promise = parser.parseDocumentAsync('http://localhost:3033/test/datasets/ttl/turtleparser_testcase1_10quads.ttl');
		let testCase3Promise = parser.parseDocumentAsync('http://localhost:3033/test/datasets/ttl/turtleparser_testcase3_21quads.trig');

		return Promise.all([
			expect(testCase1Promise).to.be.fulfilled,
			expect(testCase1Promise).to.eventually.be.ok,
			expect(testCase1Promise).to.eventually.has.lengthOf(10),

			expect(testCase3Promise).to.be.fulfilled,
			expect(testCase3Promise).to.eventually.be.ok,
			expect(testCase3Promise).to.eventually.has.lengthOf(21)
		]);
	});

	it('should invoke quad handler if specified', async () => {
		let handlerSpy = sinon.spy();
		await parser.parseDocumentAsync('test/datasets/ttl/turtleparser_testcase1_10quads.ttl', handlerSpy);

		expect(handlerSpy.called).to.be.true;
		expect(handlerSpy.callCount).to.be.equal(10);
	});

	it('should reject if invalid input provided (file does not exist, remote file does not exist, invalid json format', () => {
		let testCase1Promise = parser.parseDocumentAsync('http://localhost:3053/unknownfile.ttl');
		let testCase2Promise = parser.parseDocumentAsync('test/datasets/ttl/unknownfile.n3');
		let testCase3Promise = parser.parseDocumentAsync(fs.createReadStream('notexistingfile.txt'));
		let testCase4Promise = parser.parseDocumentAsync(fs.createReadStream('test/datasets/ttl/turtleparser_testcase2_invalid.ttl'));
		let testCase5Promise = parser.parseDocumentAsync('a sh:NodeShape ; \\nsh:targetClass ex:Person ; ');
		let testCase6Promise = parser.parseDocumentAsync(null);

		return Promise.all([
			expect(testCase1Promise).to.be.rejected,
			expect(testCase2Promise).to.be.rejected,
			expect(testCase3Promise).to.be.rejected,
			expect(testCase4Promise).to.be.rejected,
			expect(testCase5Promise).to.be.rejected,
			expect(testCase6Promise).to.be.rejected
		]);
	});
});