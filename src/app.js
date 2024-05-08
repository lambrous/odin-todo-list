import "./style.css";
import TodoItem from "./todo-manager/todo-item";
import todoManager from "./todo-manager/todo-list";
import { forms, elements, todoUI, sidebarUI } from "./ui/ui";

const state = {
	currentProject: null,
};

const inbox = todoManager.createProject("Inbox");
elements.inboxItem.setAttribute("data-key", inbox.id);

function switchProject(project) {
	if (state.currentProject === project) return;
	state.currentProject = project;
	elements.projectHeading.textContent = state.currentProject.name;
	todoUI.renderTodos(state.currentProject.todos);
	sidebarUI.toggleActiveNavItem(state.currentProject.id);
}

function handleTodoSubmit(event) {
	event.preventDefault();

	const todoFormData = new FormData(event.target);
	const todoData = Object.fromEntries(todoFormData);

	const newTodo = new TodoItem(todoData);
	state.currentProject.addTodo(newTodo);

	todoUI.renderTodos(state.currentProject.todos);
	todoUI.hideTodoForm();
	event.target.reset();
}

function handleProjectSubmit(event) {
	event.preventDefault();

	const projectData = new FormData(event.target);
	const projectName = projectData.get("name");
	const newProject = todoManager.createProject(projectName);

	event.target.reset();
	event.target.querySelector("input").blur();
	if (!newProject) return;

	const projectsWithoutInbox = todoManager.projects.filter(
		(project) => project !== inbox,
	);

	sidebarUI.renderProjects(projectsWithoutInbox, switchProject);
	switchProject(newProject);
}

forms.todo.addEventListener("submit", handleTodoSubmit);
forms.project.addEventListener("submit", handleProjectSubmit);
elements.inboxItem.addEventListener("click", () => {
	switchProject(inbox);
});

switchProject(inbox);
