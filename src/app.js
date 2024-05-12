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

function onTodoAdd(formData) {
	const newTodo = new TodoItem(formData);
	currentProject.addTodo(newTodo);
	todoContent.renderTodos(currentProject.todos);
}

function onTodoEdit(formData) {
	const todoToEditID = todoContent.getSelectedTodoElementID();
	const todoToEdit = currentProject.getTodoByID(todoToEditID);
	todoToEdit.title = formData.title;

	todoContent.editTodoItem(todoToEdit);
}

forms.project.addEventListener("submit", projectSubmitHandler);
todoContent.registerSubmitListener("addTodo", onTodoAdd);
todoContent.registerSubmitListener("editTodo", onTodoEdit);
elements.inboxItem.addEventListener("click", () => {
	switchProject(inbox);
});

switchProject(inbox);
