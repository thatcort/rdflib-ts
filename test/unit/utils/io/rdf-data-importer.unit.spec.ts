import { IRI } from '../../../../src/model/iri';
import { RdfDataImporter } from '../../../../src/utils/io/rdf-data-importer';

describe('RdfDataImporter - Unit', () => {
	context('constructor', () => {
		it('should set default options for non specified ones', () => {
			let exporter = new RdfDataImporter();
			exporter.options.skolemize.should.be.false;
			exporter.options.importChunkSize.should.equal(1000);
			exporter.options.should.not.haveOwnProperty('defaultGraph');

			exporter = new RdfDataImporter({});
			exporter.options.skolemize.should.be.false;
			exporter.options.importChunkSize.should.equal(1000);
			exporter.options.should.not.haveOwnProperty('defaultGraph');

			exporter = new RdfDataImporter({ skolemize: true });
			exporter.options.skolemize.should.be.true;
			exporter.options.importChunkSize.should.equal(1000);
			exporter.options.should.not.haveOwnProperty('defaultGraph');

			exporter = new RdfDataImporter({ skolemize: true, importChunkSize: 666 });
			exporter.options.skolemize.should.be.true;
			exporter.options.importChunkSize.should.equal(666);
			exporter.options.should.not.haveOwnProperty('defaultGraph');

			exporter = new RdfDataImporter({ skolemize: false, importChunkSize: 666 });
			exporter.options.skolemize.should.be.false;
			exporter.options.importChunkSize.should.equal(666);
			exporter.options.should.not.haveOwnProperty('defaultGraph');

			exporter = new RdfDataImporter({
				skolemize: false,
				importChunkSize: 666,
				defaultGraph: new IRI('rdf:defaultGraph')
			});
			exporter.options.skolemize.should.be.false;
			exporter.options.importChunkSize.should.equal(666);
			exporter.options.defaultGraph.relativeValue.should.equal('defaultGraph');
		});
	});
});
