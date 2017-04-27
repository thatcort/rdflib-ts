// import { Readable } from 'stream';
// import { ArgumentError } from '../errors/argument-error';
// import { ReadStream } from 'fs';
// import * as fs from 'fs';
// import * as n3 from 'N3';
// import * as path from 'path';
// import * as http from 'superagent';

// import { NQuad } from '../model/n-quad';
// import { RdfFactory } from '../utils/rdf/rdf-factory';
// import { IRdfDocumentParser, RdfDocumentOriginType, RdfDocumentParser } from './rdf-document-parser';
// import { NamespaceManagerInstance } from '../utils/rdf/namespace-manager';

// export class TurtleParser extends RdfDocumentParser {

//     public parseDocumentAsync(document: string | ReadStream, quadHandler?: (quad: NQuad) => void): Promise<NQuad[]> {
//         return new Promise<NQuad[]>((resolve, reject) => {
//             let parsedQuads: NQuad[] = [];

//             if (!document) {
//                 return reject(new ArgumentError('Document can not be null, undefined or empty string'));
//             }

//             try {
//                 let originType = this.resolveOriginType(document);
//                 let n3ParserOptions = undefined;

//                 if (originType === RdfDocumentOriginType.LocalFile && path.extname(<string>document) === '.n3') {
//                     n3ParserOptions = { format: 'N3' };
//                 }

//                 let documentStream = await this.resolveDocumentStreamAsync(document, originType);



//                 parser.parse(fs.createReadStream(filePath), (err, triple, prefixes) => {
//                     if (err) {
//                         return reject(err);
//                     }

//                     if (prefixes) {
//                         for (let prefix in prefixes) {
//                             NamespaceManagerInstance.registerNamespace(prefix, prefixes[prefix]);
//                         }
//                     }

//                     if (!triple) {
//                         return resolve(parsedQuads);
//                     }

//                     let quad = new NQuad(triple.subject, triple.predicate, triple.object, triple.graph);
//                     parsedQuads.push(quad);
//                     if (quadHandler) {
//                         quadHandler(quad);
//                     }
//                 });
//             } catch (err) {
//                 reject(err);
//             }
//         });
//     }

//     private resolveDocumentStreamAsync(document: string | ReadStream, documentOriginType?: RdfDocumentOriginType): Promise<ReadStream> {
// 		return new Promise<ReadStream>(async (resolve, reject) => {
// 			try {
// 				switch (documentOriginType.valueOf()) {
// 					case RdfDocumentOriginType.LocalFile: {
// 						return resolve(fs.createReadStream(<string>document));
// 					}
// 					case RdfDocumentOriginType.ReadableStream: {
// 						return resolve(<ReadStream>document);
// 					}
// 					case RdfDocumentOriginType.RemoteFile: {
// 						http.get(<string>document, (err, response) => {
//                             if (err) {
//                                 return reject(err);
//                             }

//                             let stream = new Readable();
//                             stream.push(JSON.stringify(response.body));
//                             stream.push(null);
// 							return err ? reject(err) : resolve(stream);
// 						});

// 						break;
// 					}
// 					case RdfDocumentOriginType.String: {
// 						return resolve(JSON.parse(<string>document));
// 					}
// 				}
// 			} catch (error) {
// 				reject(error);
// 			}
// 		});
// 	}
// }