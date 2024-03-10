import { Application } from 'express';
import Locals from '../providers/Locals';
import { ConsumerGroup, KafkaClient } from 'kafka-node';

export class Kafka {
	public kafkaClient: KafkaClient;
	public kafkaConsumer: ConsumerGroup;

	constructor() {
		const host = Locals.config().zookeeperKafkaHost;
		this.kafkaClient = new KafkaClient({
			kafkaHost: host,
			clientId: 'consumer-client',
			connectRetryOptions: {
				retries: 2
			}
		});
		this.kafkaConsumer = new ConsumerGroup({
			kafkaHost: host,
			groupId: 'ExampleTestGroup'
		}, ['user-topic']);

		this.kafkaConsumer.on('message', async function(message) {
			console.log('Consumer | Message received:', message);
			const messageBuffer = new Buffer(message.value, 'binary');

			const decodedMessage = type.fromBuffer(messageBuffer.slice(0));
			console.log('Consumer | Decoded Message:', typeof decodedMessage, decodedMessage);

			// todo save user
		});

		this.kafkaClient.on('error', (error) => console.error('Kafka client error:', error));
		this.kafkaConsumer.on('error', (error) => console.error('Kafka consumer error:', error));
	}

	public mount(_express: Application): Application {
		const { kafkaConsumer, kafkaClient } = this;
		kafkaConsumer.on('ready', function () {
			_express.use((req, res, next) => {
				req.kafkaConsumer = kafkaConsumer;
				req.kafkaClient = kafkaClient;
				next();
			});
		});
		return _express;
	}
}
