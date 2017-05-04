import * as del from 'del';
import * as http from 'superagent';
import * as path from 'path';
import * as kill from 'tree-kill';
import * as express from 'express';
import * as child_process from 'child_process';

import { Server } from 'net';

export class TestHelper {
	public static startStaticFileServerAsync(rootFolder: string, port: number): Promise<Server> {
		return new Promise<Server>((resolve, reject) => {
			let server = express().use('/', express.static(rootFolder)).listen(port, (err, res) => {
				return err ? reject(err) : resolve(server);
			});
		});
	}

	public static stopStaticFileServerAsync(server: Server): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			server.close((err, res) => {
				return err ? reject(err) : resolve(res);
			});
		});
	}

	public static async spawnFusekiServerAsync(): Promise<number> {
		let fusekiDir = path.resolve(process.cwd(), './test/3rdParty/apache-jena-fuseki-2.5.0');
		let fusekiBase = path.join(fusekiDir, 'run');
		let fusekiScript = path.join(fusekiDir, /^win/.test(process.platform) ? 'fuseki-server.bat' : 'fuseki-server.sh');

		process.env.FUSEKI_HOME = fusekiDir;
		process.env.FUSEKI_BASE = fusekiBase;

		await del(fusekiBase);
		let pid = child_process.spawn(require.resolve(fusekiScript), [],
			{
				env: process.env,
				detached: true,
				cwd: fusekiDir,
				stdio: 'ignore'
			}).pid;

		// Give server time to get up and running
		await TestHelper.delay(4000);
		return pid;
	}

	public static async createStoreOnFusekiServerAsync(storeName: string): Promise<void> {
		await http.post('http://localhost:3030/$/datasets')
			.send({ dbName: storeName, dbType: 'mem' })
			.set('Content-Type', 'application/x-www-form-urlencoded');
	}

	public static async deleteStoreOnFusekiServerAsync(storeName: string): Promise<void> {
		await http.delete(`http://localhost:3030/$/datasets/${storeName}`);
	}

	public static async delay(ms: number): Promise<void> {
		return new Promise<void>(resolve => setTimeout(resolve, ms));
	}

	public static killProcess(pid: number): void {
		kill(pid);
	}
}