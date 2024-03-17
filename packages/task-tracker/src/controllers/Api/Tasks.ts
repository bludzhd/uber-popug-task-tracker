class Tasks {
	public static create(req, res, next): any {
		console.log('create task');
		return res.status(501).json({
			status: 'not implemented'
		});
	}
}

export default Tasks;
