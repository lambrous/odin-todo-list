import { nanoid } from "nanoid";
import { isValid as isDateValid, isToday } from "date-fns";

export default class TodoItem {
	#id;
	#priority;
	#dueDate;
	static MIN_PRIORITY = 0;
	static MAX_PRIORITY = 3;
	static #todos = new Map();

	constructor(
		{ title, description, dueDate, priority, id, isComplete, completedDate },
		project = null,
	) {
		this.title = title || "New Todo";
		this.description = description;
		this.dueDate = dueDate;
		this.priority = priority;
		this.isComplete = isComplete ?? false;
		this.id = id ?? nanoid(8);
		this.completedDate = completedDate ?? null;

		if (project === null) this.project = { id: null };
		else this.project = project;

		TodoItem.#todos.set(this.id, this);
	}

	get id() {
		return this.#id;
	}

	set id(value) {
		this.#id = value;
	}

	markComplete() {
		this.isComplete = true;
		this.completedDate = new Date().toDateString();
	}

	markIncomplete() {
		this.isComplete = false;
		this.completedDate = null;
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

	get dueDate() {
		return this.#dueDate;
	}

	set dueDate(dateStr) {
		const parseDate = new Date(dateStr);
		this.#dueDate = isDateValid(parseDate) ? dateStr : null;
	}

	static get todos() {
		return Array.from(TodoItem.#todos.values());
	}

	static getTodoByID(id) {
		return TodoItem.#todos.get(id);
	}

	static removeTodo(id) {
		TodoItem.#todos.delete(id);
	}

	static getTodosForProject(projectID) {
		return TodoItem.todos.filter((todo) => todo.project.id === projectID);
	}

	static getCompletedTodosForProject(projectID) {
		return TodoItem.todos.filter(
			(todo) => todo.project.id === projectID && todo.isComplete,
		);
	}

	static getIncompleteTodosForProject(projectID) {
		return TodoItem.todos.filter(
			(todo) => todo.project.id === projectID && !todo.isComplete,
		);
	}

	static get incompleteTodosToday() {
		return TodoItem.todos.filter(
			(todo) => !todo.isComplete && isToday(todo.dueDate),
		);
	}

	static get incompleteHighPriorityTodos() {
		return TodoItem.todos.filter((todo) => {
			return !todo.isComplete && todo.priority === TodoItem.MAX_PRIORITY;
		});
	}
}
