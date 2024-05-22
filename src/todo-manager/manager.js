import TodoItem from "./todo-item";
import ProjectList from "./project-list";

export { TodoItem, ProjectList };

const getJsonData = () => {
	const todos = TodoItem.todos.map((todo) => {
		return {
			...todo,
			id: todo.id,
			priority: todo.priority,
			dueDate: todo.dueDate,
			project: {
				id: todo.project.id,
			},
		};
	});

	const projects = ProjectList.projects.map((project) => {
		return {
			name: project.name,
			id: project.id,
		};
	});

	return JSON.stringify({ todos, projects });
};

const loadTodos = (jsonData) => {
	const { todos, projects } = JSON.parse(jsonData);

	if (projects) {
		for (const project of projects) {
			new ProjectList(project.name, project.id);
		}
	}

	if (todos) {
		for (const todo of todos) {
			const { project, ...todoData } = todo;
			const projectList = ProjectList.getProjectByID(project.id) ?? null;
			new TodoItem(todoData, projectList);
		}
	}
};

export const todoManager = {
	getJsonData,
	loadTodos,
};
