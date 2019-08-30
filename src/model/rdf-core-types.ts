import { IRI } from './iri';
import { BlankNode } from './blank-node';
import { LangLiteral } from './lang-literal';
import { TypedLiteral } from './typed-literal';
import { PlainLiteral } from './plain-literal';

export type Literal = PlainLiteral | TypedLiteral | LangLiteral;

export type RdfSubject = IRI | BlankNode;
export type RdfPredicate = IRI;
export type RdfObject = IRI | BlankNode | Literal;

export type RdfNode = RdfSubject | RdfObject;
export type NonBlankNode = IRI | Literal;
export type RdfProperty = RdfPredicate;

export type RdfTerm = RdfSubject | RdfPredicate | RdfObject;
