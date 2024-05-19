import { element } from "./base";

const { confirmDialog } = element;
const dialogText = confirmDialog.querySelector(".dialog-text");
const confirmButton = confirmDialog.querySelector("#confirm-btn");
const cancelButton = confirmDialog.querySelector("#cancel-btn");

cancelButton.addEventListener("click", () => {
	confirmDialog.close();
});

export function addConfirmation(
	callback,
	text = {
		confirm: "Yes",
		message: "Confirm?",
	},
) {
	dialogText.textContent = text.message;
	confirmButton.textContent = text.confirm;

	return (args) => {
		const listener = () => {
			callback(args);
			confirmDialog.close();
		};

		confirmDialog.showModal();
		confirmButton.addEventListener("click", listener, { once: true });
		confirmDialog.addEventListener("close", () => {
			confirmButton.removeEventListener("click", listener);
		});
	};
}
