function removeFromArray(array) {
	return (item) => {
		const index = array.indexOf(item);
		if (index === -1) return;
		array.splice(index, 1);
	};
}

class TodoList {
	#todos = [];

	constructor(name) {
		this.name = name;
	}

	get todos() {
		return this.#todos;
	}

	addTodo(todo) {
		this.todos.push(todo);
	}

	removeTodo = removeFromArray(this.todos);
}

class ProjectsManager {
	#projects = [];

	get projects() {
		return this.#projects;
	}

	get projectNames() {
		return this.projects.map((list) => list.name);
	}

	createProject(name) {
		const trimmedName = name.trim();
		if (!trimmedName) return null;
		const project = new TodoList(trimmedName);
		this.projects.push(project);
		return project;
	}

	removeList = removeFromArray(this.projects);
}

export default new ProjectsManager();
