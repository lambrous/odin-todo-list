class TodoItem {
	#priority;
	static MIN_PRIORITY = 0;
	static MAX_PRIORITY = 3;

	constructor({ title, description, dueDate, priority }) {
		this.title = title;
		this.description = description;
		this.dueDate = dueDate;
		this.priority = priority;
		this.isComplete = false;
	}

	markComplete() {
		this.isComplete = true;
	}

	updateProperty(property, value) {
		if (property in this) {
			this[property] = value;
		}
	}

	get priority() {
		return this.#priority;
	}

	set priority(value) {
		if (
			typeof value !== "number" ||
			value < TodoItem.MIN_PRIORITY ||
			value > TodoItem.MAX_PRIORITY
		) {
			return;
		}
		this.#priority = value;
	}
}

export default TodoItem;
