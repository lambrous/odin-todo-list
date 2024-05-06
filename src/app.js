import "./style.css";
import TodoItem from "./todo-manager/todo-item";
import todoManager from "./todo-manager/todo-list";
import { forms, elements } from "./ui/base";
import { todoUI, sidebarUI } from "./ui/ui";

const inbox = todoManager.createProject("Inbox");
const state = {
	currentProject: inbox,
};

function switchProject(project) {
	if (state.currentProject === project) return;
	state.currentProject = project;
	elements.projectHeading.textContent = state.currentProject.name;
	todoUI.renderTodos(state.currentProject.todos);
}

forms.todo.addEventListener("submit", (e) => {
	e.preventDefault();

	const todoFormData = new FormData(e.target);
	const todoData = Object.fromEntries(todoFormData);

	const newTodo = new TodoItem(todoData);
	state.currentProject.addTodo(newTodo);
	console.log(state.currentProject.todos);

	todoUI.renderTodos(state.currentProject.todos);
	e.target.reset();
});

forms.project.addEventListener("submit", (e) => {
	e.preventDefault();

	const projectData = new FormData(e.target);
	const projectName = projectData.get("name");
	const newProject = todoManager.createProject(projectName);

	e.target.reset();
	e.target.querySelector("input").blur();
	if (!newProject) return;

	const projectsWithoutInbox = todoManager.projects.filter(
		(project) => project !== inbox,
	);

	sidebarUI.renderProjects(projectsWithoutInbox, switchProject);
	switchProject(newProject);
});

elements.inboxItem.addEventListener("click", () => {
	switchProject(inbox);
});
