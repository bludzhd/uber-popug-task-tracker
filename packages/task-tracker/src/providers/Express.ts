/**
 * Primary file for your Clustered API Server
 *
 * @author Faiz A. Farooqui <faiz@geekyants.com>
 */

import * as express from 'express';

import Locals from './Locals';
import Routes from './Routes';
import Bootstrap from '../middlewares/Kernel';
import ExceptionHandler from '../exception/Handler';
import { Producer as ProducerProvider } from './Producer';

export class Express {
	/**
	 * Create the express object
	 */
	public express: express.Application;
	public producerProvider: ProducerProvider;

	/**
	 * Initializes the express server
	 */
	constructor (producerProvider: ProducerProvider) {
		this.express = express();
		this.producerProvider = producerProvider;

		this.mountDotEnv();
		this.mountMiddlewares();
		this.mountRoutes();
	}

	private mountDotEnv (): void {
		this.express = Locals.init(this.express);
	}

	/**
	 * Mounts all the defined middlewares
	 */
	private mountMiddlewares (): void {
		this.express = Bootstrap.init(this.express, this.producerProvider);
	}

	/**
	 * Mounts all the defined routes
	 */
	private mountRoutes (): void {
		this.express = Routes.mountApi(this.express);
	}

	/**
	 * Starts the express server
	 */
	public init (): any {
		const port: number = Locals.config().port;

		// Registering Exception / Error Handlers
		this.express.use(ExceptionHandler.logErrors);
		this.express.use(ExceptionHandler.clientErrorHandler);
		this.express.use(ExceptionHandler.errorHandler);
		this.express = ExceptionHandler.notFoundHandler(this.express);

		// Start the server on the specified port
		this.express.listen(port, () => {
			return console.log('\x1b[33m%s\x1b[0m', `Server :: Running @ 'http://localhost:${port}'`);
		}).on('error', (_error) => {
			return console.log('Error: ', _error.message);
		});
	}
}
