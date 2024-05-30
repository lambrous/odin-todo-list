import { element } from "./ui/base";

const userAgent = navigator.userAgent;
const isAppleDevice =
	/iPad|iPhone|iPod/.test(userAgent) || userAgent.includes("Macintosh");

document.addEventListener("keydown", (event) => {
	if (
		(event.ctrlKey && event.key === "k" && !isAppleDevice) ||
		(isAppleDevice && event.metaKey && event.key === "k")
	) {
		event.preventDefault();
		element.addTodoButton.click();
	}
});

const addTodoKbd = element.addTodoButton.querySelector("code");
addTodoKbd.textContent = isAppleDevice ? "⌘ K" : "Ctrl + K";
