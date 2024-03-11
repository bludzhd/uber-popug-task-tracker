import { ConsumerGroup, KafkaClient } from 'kafka-node';
import Locals from '../providers/Locals';
import { userRegisteredType } from '../schemas/user.registered.v1';

export class Consumer {
	public client: KafkaClient;
	public consumer: ConsumerGroup;

	constructor() {
		const host = Locals.config().zookeeperKafkaHost;
		this.client = new KafkaClient({
			kafkaHost: host,
			clientId: 'consumer-client',
			connectRetryOptions: {
				retries: 2
			}
		});
		this.consumer = new ConsumerGroup({
			kafkaHost: host,
			groupId: 'ExampleTestGroup'
		}, ['user-topic']);
	}

	public init() {
		this.client.on('error', (error) => console.error('Kafka client error:', error));
		this.consumer.on('message', async function(message) {
			console.log('Consumer | Message received:', message);
			const messageBuffer = new Buffer(message.value as string, 'binary');
			const decodedMessage = userRegisteredType.fromBuffer(messageBuffer.slice(0));
			console.log('Consumer | Decoded Message:', typeof decodedMessage, decodedMessage);
		});
		this.consumer.on('error', (error) => console.error('Kafka consumer error:', error));
		this.consumer.on('connect', function () {
			console.log('kafka consumer connect');
		});
	}
}

export default new Consumer();
