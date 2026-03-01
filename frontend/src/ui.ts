import { createTask, deleteTask, loadTasks, updateTaskStatus, type Task } from "./tasks";

export function showOverlay(content: HTMLDivElement) {
    const overlay: HTMLDivElement = document.createElement('div');
    overlay.id = 'overlay';
    overlay.appendChild(content);
    document.body.append(overlay);
}
export function createTaskElement(task: Task) {
  return `<div class="task card" task-id="${task.id}">
            <div class="task-title-group">
              <div class="class-name">${task.course}</div>
              <div class="task-name">${task.title}</div>
            </div>
            <div class="task-completion-group">
              <div class="task-due-date">Due ${task.due_date}</div>
              <input type="checkbox" ${(task.status == "completed") ? 'checked' : ''}>
            </div>
          </div>`
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
function selectTaskCard(taskCard: HTMLElement) {
    unselectTaskCard();
    taskCard.classList.add('selected');
}
function unselectTaskCard() {
    const oldSelectedTaskCard = document.querySelector('.task.card.selected');
    if (oldSelectedTaskCard) oldSelectedTaskCard.classList.remove('selected');
}
document.addEventListener('click', (e) => {
    if (!e || !e?.target) return;

    const target = e.target as HTMLElement;

    // if (!target.closest('#context-menu')) {
    //     unselectTaskCard();
    // }

    // Check if clicked within task card
    const clickedTaskCard = target.closest('.task.card') as HTMLElement;
    if (clickedTaskCard) {
        selectTaskCard(clickedTaskCard);

        const clickedCheckbox = target.closest('input[type="checkbox"]') as HTMLInputElement;
        if (clickedCheckbox) {
            const taskId = clickedTaskCard.getAttribute('task-id') as string;
            const newStatus = (clickedCheckbox.checked) ? 'completed' : 'pending';

            updateTaskStatus(taskId, newStatus);
        }
    }
    
    if (target.id == 'overlay') {
        hideOverlay();
    }
    if (!target.closest('#context-menu')) {
        removeExistingContextMenu();
    }
});
function getContextMenuContent() {
    const content = document.createElement('div');
    content.innerHTML = '<div class="context-menu-item warning" id="item-delete-task">Delete Task</div>';
    content.id = 'context-menu';
    return content;
}
function renderContextMenu(x: number, y: number) {
    removeExistingContextMenu();
    const contextMenu = getContextMenuContent();
    document.body.append(contextMenu);
    contextMenu.style.position = 'absolute';
    contextMenu.style.top = String(y) + "px";
    contextMenu.style.left = String(x) + "px";

    const deleteTaskDiv = document.querySelector('#item-delete-task') as HTMLElement;
    deleteTaskDiv.addEventListener('click', showDeleteWarningOverlay);
}
function removeExistingContextMenu() {
    const contextMenu = document.querySelector('#context-menu') as HTMLElement;
    if (contextMenu) contextMenu.remove();
}
function getDeleteWarningContent(titleGroupContents: string) {
    const content: HTMLDivElement = document.createElement('div');
    content.innerHTML = `<div style="font-size: 2rem;">Delete Task</div>
                        <div style="margin: 1rem 0">${titleGroupContents}</div>
                        <div class="group-two-horizontal">
                            <button type="submit" id="button-overlay-confirm-delete-task" class="warning" width="50%">Delete</button>
                            <button id="button-overlay-cancel-delete-task" width="50%">Cancel</button>
                        </div>`;
    return content;
}
function showDeleteWarningOverlay() {
    removeExistingContextMenu();
    const selectedTaskTitleGroup = (document.querySelector('.task.card.selected > .task-title-group') as HTMLElement) 
    showOverlay(getDeleteWarningContent(selectedTaskTitleGroup.outerHTML));

    
    const confirmDeleteButton = document.querySelector('#button-overlay-confirm-delete-task') as HTMLButtonElement;
    confirmDeleteButton.addEventListener('click', onConfirmDeleteClicked);
    const cancelDeleteButton = document.querySelector('#button-overlay-cancel-delete-task') as HTMLButtonElement;
    cancelDeleteButton.addEventListener('click', hideOverlay);
}
async function onConfirmDeleteClicked() {
    const selectedTask = document.querySelector('.task.card.selected') as HTMLElement;
    const id = selectedTask.getAttribute('task-id');

    if (!id) return;

    console.log(await deleteTask(id));
    
    selectedTask.remove();
    hideOverlay();
}
document.addEventListener('contextmenu', (e) => {
    if (!e || !e?.target) return;
    e.preventDefault();
    
    removeExistingContextMenu();

    const target = e.target as HTMLElement;
    const clickedTaskCard = target.closest('.task.card') as HTMLElement;
    if (clickedTaskCard) {
        selectTaskCard(clickedTaskCard);
        renderContextMenu(e.clientX, e.clientY);
    }
});