import { WriteStream } from 'fs';
import { NQuad } from '../model/n-quad';


export interface IRdfDataSerializer {
	serializeAsync(quads: NQuad[], output: string | WriteStream): Promise<void>;
}