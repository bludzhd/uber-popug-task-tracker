/**
 * Defines Custom method types over Express's Request
 *
 * @author Faiz A. Farooqui <faiz@geeekyants.com>
 */

import { Request } from 'express';
import { ConsumerGroup } from 'kafka-node';

export interface IRequest extends Request {
	flash(message: string, callback: any): any;

	logIn(user: any, callback: any): any;
	user(): any;
	logout(): void;

	kafkaConsumer: ConsumerGroup;
}
