import "./style.css";
import TodoItem from "./todo-manager/todo-item";
import todoManager from "./todo-manager/todo-list";
import { forms, elements, todoContent, sidebar } from "./ui/ui";

let currentProject = null;

const inbox = todoManager.createProject("Inbox");
elements.inboxItem.setAttribute("data-key", inbox.id);

function switchProject(project) {
	if (currentProject === project) return;
	currentProject = project;
	elements.projectHeading.textContent = currentProject.name;
	todoContent.renderTodos(currentProject.todos);
	sidebar.toggleActiveNavItem(currentProject.id);
}

function addTodoHandler(event) {
	event.preventDefault();

	const todoFormData = new FormData(event.target);
	const todoData = Object.fromEntries(todoFormData);

	const newTodo = new TodoItem(todoData);
	currentProject.addTodo(newTodo);

	todoContent.renderTodos(currentProject.todos);
	todoContent.hideTodoForm();
	event.target.reset();
}

// todo:
function editTodoHandler(event) {
	event.preventDefault();
	console.log("Todo Edit");
}

function projectSubmitHandler(event) {
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

	sidebar.renderProjects(projectsWithoutInbox, switchProject);
	switchProject(newProject);
}

todoContent.addListenerForTodoAdd(addTodoHandler);
todoContent.addListenerForTodoEdit(editTodoHandler);
forms.project.addEventListener("submit", projectSubmitHandler);
elements.inboxItem.addEventListener("click", () => {
	switchProject(inbox);
});

switchProject(inbox);
