import "./style.css";
import TodoItem from "./todo-manager/todo-item";
import todoManager from "./todo-manager/todo-list";
import {
	form,
	element,
	todoContent,
	sidebar,
	confirmDialog,
	completedList,
} from "./ui/ui";

let currentProject = null;

const inbox = todoManager.createProject("Inbox");
element.inboxItem.dataset.id = inbox.id;

const todoItemHandler = { onTodoComplete, onTodoDelete };
const projectItemHandler = {
	onClick: switchProject,
	onDelete: confirmDialog.addConfirmation(onProjectDelete, {
		message: "Are you sure you want to proceed?",
		confirm: "Delete",
	}),
};

function switchProject(project, canModify = true) {
	if (currentProject === project) return;
	currentProject = project;
	todoContent.updateProjectName(
		currentProject.name,
		canModify && projectNameChangeHandler,
	);
	todoContent.renderTodos(currentProject.incompleteTodos, todoItemHandler);
	completedList.renderItems(currentProject.completedTodos, onUncheck);
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

	sidebar.renderProjects(projectsWithoutInbox, projectItemHandler);
	switchProject(newProject);
}

function onSubmitTodoAdd(formData) {
	const newTodo = new TodoItem(formData);
	currentProject.addTodo(newTodo);
	todoContent.addTodoElement(newTodo, todoItemHandler);
}

function onSubmitTodoEdit(formData, targetElement) {
	const todoItem = currentProject.getTodoByID(targetElement.id);
	for (const key in formData) {
		todoItem.updateProperty(key, formData[key]);
	}
	targetElement.updateContent(todoItem, todoItemHandler);
}

function onTodoComplete(todoID) {
	const todoItem = currentProject.getTodoByID(todoID);
	todoItem.markComplete();
	todoContent.removeTodoElement(todoID);
	completedList.addItem(todoItem, onUncheck);
}

function onTodoDelete(todoID) {
	currentProject.removeTodo(todoID);
	todoContent.removeTodoElement(todoID);
}

function onProjectDelete(projectID) {
	todoManager.removeProject(projectID);
	sidebar.removeProjectItem(projectID);

	if (projectID === currentProject.id) {
		switchProject(inbox, false);
	}
}

function projectNameChangeHandler(event) {
	const updatedName = event.target.value;
	currentProject.name = updatedName;
	sidebar.updateProjectName(currentProject.id, currentProject.name);
}

function onUncheck(todoID) {
	const todoItem = currentProject.getTodoByID(todoID);
	todoItem.markIncomplete();
	completedList.removeItem(todoID);
	todoContent.renderTodos(currentProject.incompleteTodos, todoItemHandler);
}

form.project.addEventListener("submit", projectSubmitHandler);
todoContent.registerSubmitListener("addTodo", onSubmitTodoAdd);
todoContent.registerSubmitListener("editTodo", onSubmitTodoEdit);
element.inboxButton.addEventListener("click", () => {
	switchProject(inbox, false);
});

switchProject(inbox, false);
