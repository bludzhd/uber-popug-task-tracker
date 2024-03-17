import Locals from '../providers/Locals';
import { HighLevelProducer, KafkaClient } from 'kafka-node';

export const name = 'task-tracker-service';

export class Producer {
	public host: string;
	public producer: HighLevelProducer;
	private producerPromise: Promise<HighLevelProducer>;

	constructor() {
		this.host = Locals.config().kafkaHost;
	}

	init() {
		this.producerPromise = new Promise((resolve, reject) => {
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

			client.on('error', (error) => console.error('Kafka client error:', error));
			producer.on('error', error => {
				console.error(`Kafka producer error ${error}.`);
				reject(error);
			});
			producer.on('ready', function () {
				console.log('Kafka producer created.');
				resolve(producer);
			});
		});
	}

	async getInstance(): Promise<HighLevelProducer> {
		if (this.producer) {
			return this.producer;
		}

		this.producer = await this.producerPromise;

		return this.producer;
	}
}
