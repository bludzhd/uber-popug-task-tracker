import { Application } from 'express';
import Locals from '../providers/Locals';
import { HighLevelProducer, KafkaClient } from 'kafka-node';
import { IRequest } from '../interfaces/vendors';

export class Producer {
	public host: string;
	public producer: Promise<HighLevelProducer>;

	constructor() {
		this.host = Locals.config().zookeeperKafkaHost;
	}

	mount(_express: Application): Application {
		const getProducer = this.getProducer.bind(this);
		_express.use((req: IRequest, res, next) => {
			req.getProducer = getProducer;
			next();
		});
		return _express;
	}

	async getProducer(): Promise<HighLevelProducer> {
		return (
			this.producer ||
			(this.producer = new Promise((resolve, reject) => {
				const client = new KafkaClient({
					kafkaHost: this.host,
					clientId: 'producer-client',
					connectTimeout: 500,
					connectRetryOptions: {
						retries: 2
					}
				});
				const producer = new HighLevelProducer(client, {
					requireAcks: 1,
					ackTimeoutMs: 100
				});

				console.log('OLCHIK client', client);
				console.log('OLCHIK producer', producer);

				client.on('error', (error) => console.error('Kafka client error:', error));
				producer.on('error', error => {
					console.error(`Kafka producer error ${error}.`);
					reject(error);
				});
				producer.on('ready', function () {
					console.log(`Kafka producer [${this.id}] created.`, {id: this.id});
					resolve(producer);
				});
			}))
		);
	}
}
