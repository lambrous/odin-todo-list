import "./style.css";
import { TodoItem, ProjectList, todoManager } from "./todo-manager/manager";
import {
	form,
	element,
	todoContent,
	sidebar,
	confirmDialog,
	completedList,
} from "./ui/ui";

const inbox = {
	name: "Inbox",
	id: null,
};
let currentProject = inbox;
element.inboxItem.dataset.id = inbox.id;

const todoItemHandler = { onTodoComplete, onTodoDelete };
const projectItemHandler = {
	onClick: switchProject,
	onDelete: confirmDialog.addConfirmation(onProjectDelete, {
		message: "Are you sure you want to proceed?",
		confirm: "Delete",
	}),
};

function switchProject(project) {
	if (currentProject === project) return;
	currentProject = project || inbox;

	todoContent.updateProjectName(
		currentProject.name,
		currentProject.id && projectNameChangeHandler,
	);
	todoContent.renderTodos(
		TodoItem.getIncompleteTodosForProject(currentProject.id),
		todoItemHandler,
	);
	completedList.renderItems(
		TodoItem.getCompletedTodosForProject(currentProject.id),
		onUncheck,
	);
	sidebar.toggleActiveNavItem(currentProject.id);
	todoContent.hideTodoForm();
}

function projectSubmitHandler(event) {
	event.preventDefault();

	const projectData = new FormData(event.target);
	const projectName = projectData.get("name");
	const newProject = new ProjectList(projectName);

	event.target.reset();
	event.target.querySelector("input").blur();
	if (!newProject) return;

	sidebar.renderProjects(ProjectList.projects, projectItemHandler);
	switchProject(newProject);
}

function onSubmitTodoAdd(formData) {
	const newTodo = new TodoItem(formData, currentProject);
	todoContent.addTodoElement(newTodo, todoItemHandler);
}

function onSubmitTodoEdit(formData, targetElement) {
	const selectedTodo = TodoItem.getTodoByID(targetElement.id);
	for (const key in formData) {
		selectedTodo.updateProperty(key, formData[key]);
	}
	targetElement.updateContent(selectedTodo, todoItemHandler);
}

function onTodoComplete(todoID) {
	const selectedTodo = TodoItem.getTodoByID(todoID);
	selectedTodo.markComplete();
	todoContent.removeTodoElement(todoID);
	completedList.addItem(selectedTodo, onUncheck);
}

function onTodoDelete(todoID) {
	TodoItem.removeTodo(todoID);
	todoContent.removeTodoElement(todoID);
}

function onProjectDelete(projectID) {
	ProjectList.removeProject(projectID);
	sidebar.removeProjectItem(projectID);

	if (projectID === currentProject.id) {
		switchProject();
	}
}

function projectNameChangeHandler(event) {
	const updatedName = event.target.value;
	currentProject.name = updatedName;
	sidebar.updateProjectName(currentProject.id, currentProject.name);
}

function onUncheck(todoID) {
	const selectedTodo = TodoItem.getTodoByID(todoID);
	selectedTodo.markIncomplete();
	completedList.removeItem(todoID);
	todoContent.renderTodos(
		TodoItem.getIncompleteTodosForProject(currentProject.id),
		todoItemHandler,
	);
}

form.project.addEventListener("submit", projectSubmitHandler);
todoContent.registerSubmitListener("addTodo", onSubmitTodoAdd);
todoContent.registerSubmitListener("editTodo", onSubmitTodoEdit);
element.inboxButton.addEventListener("click", () => {
	switchProject();
});

window.addEventListener("beforeunload", () => {
	localStorage.setItem("todos", todoManager.getJsonData());
	localStorage.setItem("session", currentProject.id);
});

window.addEventListener("load", () => {
	const todosData = localStorage.getItem("todos");
	if (todosData) todoManager.loadTodos(todosData);

	sidebar.renderProjects(ProjectList.projects, projectItemHandler);

	const sessionID = localStorage.getItem("session");
	const sessionProject = ProjectList.getProjectByID(sessionID);

	switchProject(sessionID && sessionProject);
});
