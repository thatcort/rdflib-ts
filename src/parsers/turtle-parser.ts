// import { ArgumentError } from '../errors/argument-error';
import { RdfFactory } from '../utils/rdf/rdf-factory';
import { RdfUtils } from '../utils/rdf/rdf-utils';
import { PlainLiteral } from '../model/plain-literal';
import { TypedLiteral } from '../model/typed-literal';
import { LangLiteral } from '../model/lang-literal';
import { ReadStream } from 'fs';
import { InvalidOperationError } from '../errors/invalid-operation-error';
import * as fs from 'fs';
import * as n3 from 'n3';
import * as streamToString from 'stream-to-string';
import * as http from 'superagent';

import { NQuad } from '../model/n-quad';
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

                if (prefixes) {
                    for (let prefix in prefixes) {
                        NamespaceManagerInstance.registerNamespace(prefix, prefixes[prefix]);
                    }
                }

                if (triple) {
                    triples.push(triple);
                } else if (!triple) {
                    for (let triple of triples) {                        
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

    public parseReadableStreamAsync(document: ReadStream, quadHandler?: (quad: NQuad) => void): Promise<NQuad[]> {
        return new Promise<NQuad[]>(async (resolve, reject) => {
            let parsedQuads: NQuad[] = [];
            let parser = new n3.Parser();

            try {
                let documentContent = await streamToString(<ReadStream>document);
                let quads = this.parseStringAsync(documentContent, quadHandler);
                resolve(quads);
            } catch (error) {
                reject(error);
            }
        });
    }

    public parseLocalFileAsync(document: string, quadHandler?: (quad: NQuad) => void): Promise<NQuad[]> {
        return new Promise<NQuad[]>(async (resolve, reject) => {
            // try {
            let stream = fs.createReadStream(document);
            let quads = await this.parseReadableStreamAsync(stream, quadHandler);
            resolve(quads);
            // } catch (err) {
            // reject(err);
            // }
        });

    }

    public parseRemoteFileAsync(document: string, quadHandler?: (quad: NQuad) => void): Promise<NQuad[]> {
        return new Promise<NQuad[]>(async (resolve, reject) => {
            http.get(document, async (err, response) => {
                if (err) {
                    return reject(err);
                }

                let documentContent = await streamToString(response);
                let quads = await this.parseStringAsync(documentContent, quadHandler);
                resolve(quads);
            });
        });
    }
}