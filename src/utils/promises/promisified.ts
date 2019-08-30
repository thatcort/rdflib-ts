import * as fs from 'fs';
import * as mkdirp from 'mkdirp';
import * as bluebird from 'bluebird';

bluebird.promisifyAll(fs);
bluebird.promisifyAll(mkdirp);

declare module 'fs' {
	export function statAsync(path: string | Buffer): Promise<Stats>;
	export function readFileAsync(filename: string, encoding: string): Promise<string>;
	export function writeFileAsync(
		filename: string,
		data: any,
		options?: { encoding?: string; mode?: number; flag?: string }
	): Promise<void>;
}
