import { ConsumerGroup, KafkaClient } from 'kafka-node';
import Locals from '../providers/Locals';
import { userRegisteredType } from '../schemas/user.registered.v1';
import User from '../models/User';

export class Consumer {
	public client: KafkaClient;
	public consumer: ConsumerGroup;

	constructor() {
		const host = Locals.config().kafkaHost;
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
		}, ['user-stream']);
	}

	public init() {
		this.client.on('error', (error) => console.error('Kafka client error:', error));
		this.consumer.on('message', async function(message) {
			console.log('Consumer | Message received:', message);
			const messageBuffer = new Buffer(message.value as string, 'binary');
			const decodedMessage = userRegisteredType.fromBuffer(messageBuffer.slice(0));
			console.log('Consumer | Decoded Message:', typeof decodedMessage, decodedMessage);
			const { eventName, data } = decodedMessage;
			switch (eventName) {
				case 'user-registered':
					try {
						const user = new User({
							publicId: data.publicId,
							email: data.email,
							role: data.role
						});
						await user.save();
					} catch (error) {
						console.log('todo handle error', error);
					}
					break;
				default:
					// todo store event in error db
			}
		});
		this.consumer.on('error', (error) => console.error('Consumer | Error:', error));
		this.consumer.on('connect', function () {
			console.log('kafka consumer connect');
		});
	}
}

export default new Consumer();
