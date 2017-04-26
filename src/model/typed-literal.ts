import { ArgumentError } from '../errors/argument-error';
import { XsdStringIRI } from './constants';
import { IRI } from './iri';
import { PlainLiteral } from './plain-literal';

export class TypedLiteral extends PlainLiteral {
	private _dataType: IRI;

	public constructor(value: string, dataType?: string | IRI) {
		super(value);

		if (dataType && typeof dataType === 'string') {
			this.dataType = new IRI(dataType);
		} else {
			this.dataType = dataType as IRI || this.dataType || XsdStringIRI;
		}
	}

	public get dataType(): IRI {
		return this._dataType;
	}

	public set dataType(dataType: IRI) {
		if (!dataType) {
			throw new ArgumentError('Literal data type can not be null or undefined');
		}

		this._dataType = dataType;
	}

	public get value(): string {
		return this._value;
	}

	public set value(value: string) {
		if (value == null) {
			throw new ArgumentError('Literal value can not be null or undefined');
		}

		let [plain, dataType] = value.split('"^^');

		super.value = plain;
		if (dataType) {
			this.dataType = new IRI(dataType);
		}
	}

	public toString(): string {
		return `${super.toString()}^^${this.dataType.toString()}`;
	}
}