import { Application } from 'express';
import Locals from '../providers/Locals';
import { HighLevelProducer, KafkaClient } from 'kafka-node';

export class Kafka {
	public kafkaClient: KafkaClient;
	public kafkaProducer: HighLevelProducer;

	constructor() {
		const host = Locals.config().zookeeperKafkaHost;
		console.log('AUTH ZOOKEEPER KAFKA HOST', host);
		this.kafkaClient = new KafkaClient({
			kafkaHost: host,
			clientId: 'producer-client',
			connectRetryOptions: {
				retries: 2
			}
		});
		this.kafkaProducer = new HighLevelProducer(this.kafkaClient);

		this.kafkaClient.on('error', (error) => console.error('Kafka client error:', error));
		this.kafkaProducer.on('error', (error) => console.error('Kafka producer error:', error));
	}

	public mount(_express: Application): Application {
		const { kafkaProducer, kafkaClient } = this;
		kafkaProducer.on('ready', function () {
			_express.use((req, res, next) => {
				req.kafkaProducer = kafkaProducer;
				req.kafkaClient = kafkaClient;
				next();
			});
		});
		return _express;
	}
}
