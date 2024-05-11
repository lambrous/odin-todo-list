import { nanoid } from "nanoid";

class TodoList {
	#todos = new Map();
	#id = nanoid(5);

	constructor(name) {
		this.name = name;
	}

	get todos() {
		return Array.from(this.#todos.values());
	}

	get id() {
		return this.#id;
	}

	getTodoByID(id) {
		return this.#todos.get(id);
	}

	addTodo(todo) {
		this.#todos.set(todo.id, todo);
	}

	removeTodo(id) {
		this.#todos.delete(id);
	}
}

class ProjectsManager {
	#projects = new Map();

	get projects() {
		return Array.from(this.#projects.values());
	}

	get projectNames() {
		return this.projects.map((project) => project.name);
	}

	createProject(name) {
		const trimmedName = name.trim();
		if (!trimmedName) return null;
		const project = new TodoList(trimmedName);
		this.#projects.set(project.id, project);
		return project;
	}

	removeProject(id) {
		this.#projects.delete(id);
	}
}

export default new ProjectsManager();
