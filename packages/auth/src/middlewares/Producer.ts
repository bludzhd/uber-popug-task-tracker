import { Application } from 'express';
import { Producer as ProducerProvider } from '../providers/Producer';
import { IRequest } from '../interfaces/vendors';

export class Producer {
	public producerProvider: ProducerProvider;

	constructor(producerProvider: ProducerProvider) {
		this.producerProvider = producerProvider;
	}

	mount(_express: Application): Application {
		const { producerProvider } = this;
		const getProducer = producerProvider.getInstance.bind(producerProvider);
		_express.use((req: IRequest, res, next) => {
			req.getProducer = getProducer;
			next();
		});
		return _express;
	}
}
