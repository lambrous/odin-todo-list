import { nanoid } from "nanoid";
import { endOfDay, isValid as isDateValid, isPast, isToday } from "date-fns";

export default class TodoItem {
	#id;
	#priority;
	#dueDate;
	static MIN_PRIORITY = 0;
	static MAX_PRIORITY = 3;
	static #todos = new Map();

	constructor(
		{
			title = "New Todo",
			description,
			dueDate,
			priority,
			id,
			isComplete = false,
			completedDate = null,
		},
		project = null,
	) {
		this.title = title;
		this.description = description;
		this.dueDate = dueDate;
		this.priority = priority;
		this.isComplete = isComplete;
		this.id = id ?? nanoid(8);
		this.completedDate = completedDate;
		this.project = project ?? { id: null };

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
			this.#priority = TodoItem.MIN_PRIORITY;
		} else {
			this.#priority = priorityValue;
		}
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
		return TodoItem.todos
			.filter((todo) => todo.project.id === projectID && todo.isComplete)
			.sort((a, b) => new Date(b.completedDate) - new Date(a.completedDate));
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
		return TodoItem.todos.filter(
			(todo) => !todo.isComplete && todo.priority === TodoItem.MAX_PRIORITY,
		);
	}

	static get overdueTodos() {
		return TodoItem.todos
			.filter((todo) => !todo.isComplete && isPast(endOfDay(todo.dueDate)))
			.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
	}
}
