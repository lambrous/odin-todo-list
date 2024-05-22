import { nanoid } from "nanoid";
import TodoItem from "./todo-item";

export default class ProjectList {
	#id;
	static #projects = new Map();

	constructor(name, id) {
		this.name = name;
		this.id = id ?? `${nanoid(6)}`;
		ProjectList.#projects.set(this.id, this);
	}

	get id() {
		return this.#id;
	}

	set id(value) {
		this.#id = value;
	}

	static get projects() {
		return Array.from(ProjectList.#projects.values());
	}

	static get projectNames() {
		return ProjectList.projects.map((project) => project.name);
	}

	static getProjectByID(id) {
		return ProjectList.#projects.get(id);
	}

	static removeProject(id) {
		const todosToRemove = TodoItem.getTodosForProject(id);
		if (todosToRemove)
			for (const todo of todosToRemove) TodoItem.removeTodo(todo.id);
		ProjectList.#projects.delete(id);
	}
}
