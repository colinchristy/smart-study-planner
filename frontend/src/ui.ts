import { createTask, loadTasks } from "./tasks";

export function showOverlay(content: HTMLDivElement) {
    const overlay: HTMLDivElement = document.createElement('div');
    overlay.id = 'overlay';
    overlay.appendChild(content);
    document.body.append(overlay);
    document.addEventListener('click', (e) => {
        if (e) {
            if (e.target) {
                const target = e.target as HTMLElement;
                if (target.id == 'overlay') {
                    hideOverlay();
                }
            }
        }
    })
}
export function getCreateTaskContent() {
    const content: HTMLDivElement = document.createElement('div');
    content.innerHTML = `<div style="font-size: 2rem;">New Task</div>
                        <label for="course">Course</label>
                        <input type="text" name="course" id="input-course">
                        <label for="title">Title</label>
                        <input type="text" name="title" id="input-title">
                        <label for="due-date">Due Date</label>
                        <input type="date" name="due-date" id="input-due-date">
                        <button type="submit" id="button-overlay-create-task">Create</button>`;
    return content;
}
export function showCreateTaskOverlay() {
    showOverlay(getCreateTaskContent());
    const createButton = document.querySelector('#button-overlay-create-task') as HTMLButtonElement;
    createButton.addEventListener('click', onCreateClicked);
}
export function hideOverlay() {
    const overlay = document.querySelector('#overlay');
    if (overlay) overlay.remove();
}

async function onCreateClicked() {
    const inputCourse = document.querySelector('#input-course') as HTMLInputElement;
    const inputTitle = document.querySelector('#input-title') as HTMLInputElement;
    const inputDueDate = document.querySelector('#input-due-date') as HTMLInputElement;

    const course = inputCourse.value;
    const title = inputTitle.value;
    const dueDate = inputDueDate.value;
    console.log(course, title, dueDate);
    console.log(await createTask(course, dueDate, title));

    hideOverlay();

    const mainList = document.querySelector('#main-task-list') as HTMLDivElement;
    loadTasks(mainList);
}