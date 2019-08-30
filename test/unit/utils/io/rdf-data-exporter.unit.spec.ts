import { RdfDataExporter } from '../../../../src/utils/io/rdf-data-exporter';

describe('RdfDataExporter - Unit', () => {
	context('constructor', () => {
		it('should set default options for non specified ones', () => {
			let exporter = new RdfDataExporter();
			exporter.options.unskolemize.should.be.false;

			exporter = new RdfDataExporter({});
			exporter.options.unskolemize.should.be.false;

			exporter = new RdfDataExporter({ unskolemize: true });
			exporter.options.unskolemize.should.be.true;

			exporter = new RdfDataExporter({ unskolemize: false });
			exporter.options.unskolemize.should.be.false;
		});
	});
});
