import '../utils/promises/promisified';

import * as fs from 'fs';
import * as n3 from 'n3';
import * as http from 'superagent';
import * as streamToString from 'stream-to-string';

import { NQuad } from '../model/n-quad';
import { ReadStream } from 'fs';
import { RdfDocumentParser } from './rdf-document-parser';
import { NamespaceManagerInstance } from '../utils/rdf/namespace-manager';

export class TurtleParser extends RdfDocumentParser {

    public parseStringAsync(document: string, quadHandler?: (quad: NQuad) => void): Promise<NQuad[]> {
        return new Promise<NQuad[]>((resolve, reject) => {
            let triples = [];
            let parsedQuads: NQuad[] = [];
            let parser = new n3.Parser();

            parser.parse(document, (err, triple, prefixes) => {
                if (err) {
                    return reject(err);
                }

                // Register namespaces withing namespace manager instance
                // Unfortunately N3Parser provides prefixes at the end 
                // so parsed triples must be stored in memory and converted 
                // to NQuad object at the end, after namespaces are registered
                if (prefixes) {
                    for (let prefix in prefixes) {
                        NamespaceManagerInstance.registerNamespace(prefix, prefixes[prefix]);
                    }
                }

                if (triple) {
                    triples.push(triple);
                } else {
                    // This means parsing is finished, time to convert to NQuads
                    for (let triple of triples) {
                        // Workaround bug in N3Parser
                        // It appends _:b(auto incremented number) to blank nodes
                        // even if they are valid blank nodes like _:b1
                        // regex will just cut that off
                        let quad = new NQuad(triple.subject.replace(/^_:b[0-9]+_/, '_:'), triple.predicate, triple.object.replace(/^_:b[0-9]+_/, '_:'), triple.graph);
                        parsedQuads.push(quad);
                        if (quadHandler) {
                            quadHandler(quad);
                        }
                    }

                    return resolve(parsedQuads);
                }
            });
        });
    }

    public async parseReadableStreamAsync(document: ReadStream, quadHandler?: (quad: NQuad) => void): Promise<NQuad[]> {
        let documentContent = await streamToString(<ReadStream>document);
        return this.parseStringAsync(documentContent, quadHandler);
    }

    public async parseLocalFileAsync(document: string, quadHandler?: (quad: NQuad) => void): Promise<NQuad[]> {
        let documentContent = await fs.readFileAsync(document, 'utf-8');
        return this.parseStringAsync(documentContent, quadHandler);
    }

    public async parseRemoteFileAsync(document: string, quadHandler?: (quad: NQuad) => void): Promise<NQuad[]> {
        let response = await http.get(document).buffer()
        let documentContent = String.fromCharCode.apply(null, response.body);
        return this.parseStringAsync(documentContent, quadHandler);
    }
}