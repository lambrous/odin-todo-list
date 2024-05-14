import "./style.css";
import TodoItem from "./todo-manager/todo-item";
import todoManager from "./todo-manager/todo-list";
import { form, element, todoContent, sidebar } from "./ui/ui";

let currentProject = null;

const inbox = todoManager.createProject("Inbox");
element.inboxItem.setAttribute("data-key", inbox.id);

const todoItemHandler = { onTodoComplete };

function switchProject(project) {
	if (currentProject === project) return;
	currentProject = project;
	element.projectHeading.textContent = currentProject.name;
	todoContent.renderTodos(currentProject.todos, todoItemHandler);
	sidebar.toggleActiveNavItem(currentProject.id);
	todoContent.hideTodoForm();
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

function onSubmitTodoAdd(formData) {
	const newTodo = new TodoItem(formData);
	currentProject.addTodo(newTodo);
	todoContent.renderTodos(currentProject.todos, todoItemHandler);
}

function onSubmitTodoEdit(formData, targetElement) {
	const todoToEditID = targetElement.id;
	const todoToEdit = currentProject.getTodoByID(todoToEditID);

	for (const key in formData) {
		todoToEdit.updateProperty(key, formData[key]);
	}

	targetElement.updateTitle(todoToEdit.title);
}

function onTodoComplete(todoID, toggleButton) {
	const todoItem = currentProject.getTodoByID(todoID);
	todoItem.toggleCompletion();
	toggleButton(todoItem.isComplete);
}

form.project.addEventListener("submit", projectSubmitHandler);
todoContent.registerSubmitListener("addTodo", onSubmitTodoAdd);
todoContent.registerSubmitListener("editTodo", onSubmitTodoEdit);
element.inboxItem.addEventListener("click", () => {
	switchProject(inbox);
});

switchProject(inbox);
