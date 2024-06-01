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
import "./keybinds.js";

const inbox = {
	name: "Inbox",
	id: null,
};
let currentProject = inbox;
element.inboxItem.dataset.id = inbox.id;

const todoItemHandler = { onTodoComplete: completeTodo(), onTodoDelete };
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
		currentProject.id ? "tag" : "inbox",
	);
	todoContent.renderTodos(
		() => TodoItem.getIncompleteTodosForProject(currentProject.id),
		todoItemHandler,
	);
	completedList.renderItems(
		TodoItem.getCompletedTodosForProject(currentProject.id),
		onUncheck,
	);
	sidebar.toggleActiveNavItem(currentProject.id);
	todoContent.hideTodoForm();
	element.addTodoButton.classList.remove("hidden");
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

function onSubmitTodoEdit(formData, elementID, renderUpdatedList) {
	const selectedTodo = TodoItem.getTodoByID(elementID);
	for (const key in formData) {
		selectedTodo.updateProperty(key, formData[key]);
	}
	renderUpdatedList();
}

function completeTodo(showComplete = true) {
	return (todoID) => {
		const selectedTodo = TodoItem.getTodoByID(todoID);
		selectedTodo.markComplete();
		todoContent.removeTodoElement(todoID);
		if (showComplete) completedList.addItem(selectedTodo, onUncheck);
	};
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
		() => TodoItem.getIncompleteTodosForProject(currentProject.id),
		todoItemHandler,
	);
}

function showOtherList(listGetter, props, options) {
	currentProject = { id: props.id };
	todoContent.updateProjectName(props.name, null, props.icon);
	todoContent.renderTodos(
		listGetter,
		{
			onTodoComplete: completeTodo(false),
			onTodoDelete,
		},
		options,
	);
	sidebar.toggleActiveNavItem(currentProject.id);
	todoContent.hideTodoForm();
	element.addTodoButton.classList.add("hidden");
	element.completedContainer.classList.add("hidden");
	element.addTodoButton.disabled = true;
}

form.project.addEventListener("submit", projectSubmitHandler);
todoContent.registerSubmitListener("addTodo", onSubmitTodoAdd);
todoContent.registerSubmitListener("editTodo", onSubmitTodoEdit);

element.inboxButton.addEventListener("click", () => {
	switchProject();
});

element.todayNavButton.addEventListener("click", () => {
	showOtherList(
		() => TodoItem.incompleteTodosToday.concat(TodoItem.overdueTodos),
		{ name: "Today", id: "today", icon: "today" },
		{ showProject: true, showOverdue: true },
	);
});

element.priorityNavButton.addEventListener("click", () => {
	showOtherList(
		() => TodoItem.incompleteHighPriorityTodos,
		{ name: "High Priority", id: "priority", icon: "flag" },
		{ showProject: true, showPriority: false },
	);
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
	const sessionNavItemButton = element.sidebar.querySelector(
		`.nav-item[data-id="${sessionID}"] .project-btn`,
	);
	sessionNavItemButton.click();
});
