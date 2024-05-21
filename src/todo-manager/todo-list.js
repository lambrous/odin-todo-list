import { nanoid } from "nanoid";
import TodoItem from "./todo-item";

class TodoList {
	#todos = new Map();
	#id;

	constructor(name, id) {
		this.name = name;
		this.id = id ?? `${nanoid(6)}`;
	}

	get todos() {
		return Array.from(this.#todos.values());
	}

	get completedTodos() {
		return this.todos.filter((todo) => todo.isComplete);
	}

	get incompleteTodos() {
		return this.todos.filter((todo) => !todo.isComplete);
	}

	get id() {
		return this.#id;
	}

	set id(value) {
		this.#id = value;
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

class TodoManager {
	#projects = new Map();

	get projects() {
		return Array.from(this.#projects.values());
	}

	get projectNames() {
		return this.projects.map((project) => project.name);
	}

	createProject(name, id) {
		const trimmedName = name.trim();
		if (!trimmedName) return null;
		const project = new TodoList(trimmedName, id);
		this.#projects.set(project.id, project);
		return project;
	}

	removeProject(id) {
		this.#projects.delete(id);
	}

	getProjectByID(id) {
		return this.#projects.get(id);
	}

	get jsonData() {
		const projectsData = this.projects.map((project) => {
			return {
				name: project.name,
				id: project.id,
				todos: project.todos.map((todo) => {
					return {
						...todo,
						id: todo.id,
						priority: todo.priority,
						dueDate: todo.dueDate,
						completedDate: todo.completedDate,
					};
				}),
			};
		});
		return JSON.stringify(projectsData);
	}

	loadTodos(json) {
		const projects = JSON.parse(json);

		for (const project of projects) {
			const todoList = this.createProject(project.name, project.id);
			for (const todo of project.todos) {
				const todoItem = new TodoItem(todo);
				todoList.addTodo(todoItem);
			}
		}
	}
}

export default new TodoManager();
