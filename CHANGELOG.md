Sunday, April 30, 2017 - v1.0.0
===========================================
	* RDF model classes
	* RDF data factory and validation utils
	* N-Triples, N-Quads, Turtle, TriG, N3, JSON-LD parsers and serializers
	* Remote sparql endpoint implementation of RDF store (Proxy to remote rdf store)
	* In memory rdf store not yet implemented

Sunday, April 30, 2017 - v1.0.1
===========================================
	* Fixed README.md errors

Sunday, April 30, 2017 - v1.0.1
===========================================
	* Fixed TurtleSerializer bug

Thursday, May 4, 2017 - v1.1.0
===========================================
	* Added RdfFactory.createRdfTermFromSparqlResultBinding method
	* Fixed parsing files from remote origin
	* Added Apache Jena Fuseki 2.5.0 exe to enable integration and e2e tests in pipelines

Thursday, May 4, 2017 - v1.1.1
===========================================
	* Fixed tree-kill dependency (was not dev dependency)

Friday, May 5, 2017 - v1.1.2
===========================================
	* Fixed RdfUtils.isLangLiteral bug to return true for lang tags with dash (en-NZ)

Saturday, May 6, 2017 - v1.1.3
===========================================
	* Fixed blank node serialization bug

Saturday, May 6, 2017 - v1.2.0
===========================================
	* Added blank node prefixing feature (ability to append prefix on blank node value during rdf data import)

Saturday, May 6, 2017 - v1.2.1
===========================================
	* Blank node prefixing feature available at export time

Sunday, May 7, 2017 - v1.2.2
===========================================
	* URN iri namespace resolution bug fixed

Sunday, May 7, 2017 - v1.2.3
===========================================
	* Added escaping \n and \t in literals

Tuesday, May 9, 2017 - v1.2.4
===========================================
	* RdfUtils.isLocalFilePath recognizes paths with dots

Wednesday, May 10, 2017 - v1.2.5
===========================================
	* Added missing mkdirp dependency