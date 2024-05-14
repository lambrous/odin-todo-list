import { nanoid } from "nanoid";

class TodoItem {
	#id = nanoid(7);
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

	get id() {
		return this.#id;
	}

	markComplete() {
		this.isComplete = true;
	}

	toggleCompletion() {
		this.isComplete = !this.isComplete;
	}

	updateProperty(property, value) {
		if (property in this) {
			this[property] = value;
		}
	}

	get priority() {
		return this.#priority;
	}

	set priority(value = 0) {
		const priorityValue = +value;
		if (
			Number.isNaN(priorityValue) ||
			priorityValue < TodoItem.MIN_PRIORITY ||
			priorityValue > TodoItem.MAX_PRIORITY
		) {
			this.#priority = 0;
		}
		this.#priority = priorityValue;
	}
}

export default TodoItem;
