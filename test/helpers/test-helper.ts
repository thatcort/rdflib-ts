import * as http from 'superagent';
import * as kill from 'tree-kill';
import * as express from 'express';

import { Server } from 'net';

export class TestHelper {
	public static startStaticFileServerAsync(rootFolder: string, port: number): Promise<Server> {
		return new Promise<Server>((resolve, reject) => {
			const server = express()
				.use('/', express.static(rootFolder))
				.listen(port, (err, res) => {
					return err ? reject(err) : resolve(server);
				});
		});
	}

	public static stopStaticFileServerAsync(server: Server): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			server.close(err => {
				return err ? reject(err) : resolve();
			});
		});
	}

	public static async createStoreOnFusekiServerAsync(storeName: string): Promise<void> {
		await http
			.post(`http://localhost:3030/$/datasets`)
			.auth('admin', 'pass123')
			.send({ dbName: storeName, dbType: 'mem' })
			.set('Content-Type', 'application/x-www-form-urlencoded');
	}

	public static async deleteStoreOnFusekiServerAsync(storeName: string): Promise<void> {
		await http.delete(`http://localhost:3030/$/datasets/${storeName}`).auth('admin', 'pass123');
	}

	public static async delay(ms: number): Promise<void> {
		return new Promise<void>(resolve => setTimeout(resolve, ms));
	}

	public static killProcess(pid: number): void {
		kill(pid);
	}
}
