import User from '../../models/User';

class Reassignment {
	static async perform(req, res, next): Promise<any> {
		console.log('PPerform reassignment: get all users with role EMPLOYEE, get all tasks, randomly reassign assignee');

		// what if there are 1 mln employees?
		const employees = await User.find({ role: 'employee' });
		console.log('employees', JSON.stringify(employees, null, 2));

		return res.json({
			'status': 'wip'
		});
	}
}

export default Reassignment;
