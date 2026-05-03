import { classManager } from "./classes";
import { type Task, taskManager } from "./tasks";

export function showOverlay(content: HTMLDivElement) {
    const overlay: HTMLDivElement = document.createElement('div');
    overlay.id = 'overlay';
    overlay.appendChild(content);
    document.body.append(overlay);
}
export function createTaskElement(task: Task) {
  return `<div class="task card" task-id="${task.id}">
            <div class="task-title-group">
              <div class="class-name" style="background-color:${classManager.getClassColorByName(task.course)}">${task.course}</div>
              <div class="task-name">${task.title}</div>
            </div>
            <div class="task-completion-group">
              <div class="task-due-date">Due ${task.due_date}</div>
              <input type="checkbox" ${(task.status == "completed") ? 'checked' : ''}>
            </div>
          </div>`
}
export function getCreateTaskContent() {
    const classes = classManager.getClasses();
    let classesSelectOptions = '';

    classes.forEach((c) => {
        classesSelectOptions += `<option value="${c.name}">${c.name}</option>`
    })

    const content: HTMLDivElement = document.createElement('div');
    content.innerHTML = `<div style="font-size: 2rem;">New Task</div>
                        <label for="class">Class</label>
                        <select name="class" id="select-class">
                            ${classesSelectOptions}
                        </select>
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
    createButton.addEventListener('click', onCreateTaskClicked);
}
export function getCreateClassContent() {
    const content: HTMLDivElement = document.createElement('div');
    content.innerHTML = `<div style="font-size: 2rem;">New Class</div>
                        <label for="course">Course Name</label>
                        <input type="text" name="course" id="input-course">
                        <label for="color">Color</label>
                        <div class="flex flex-row gap-05" style="justify-content: space-between">
                            <input type="radio" id="color-red" name="color" value="hsl(0, 50%, 50%)" checked>
                            <label class="color-label" for="color-red"></label>
                            <input type="radio" id="color-orange" name="color" value="hsl(20, 50%, 50%)">
                            <label class="color-label" for="color-orange"></label>
                            <input type="radio" id="color-yellow" name="color" value="hsl(55, 91%, 30%)">
                            <label class="color-label" for="color-yellow"></label>
                            <input type="radio" id="color-green" name="color" value="hsl(127, 52%, 42%)">
                            <label class="color-label" for="color-green"></label>
                            <input type="radio" id="color-blue" name="color" value="hsl(210, 50%, 50%)">
                            <label class="color-label" for="color-blue"></label>
                            <input type="radio" id="color-indigo" name="color" value="hsl(237, 50%, 50%)">
                            <label class="color-label" for="color-indigo"></label>
                            <input type="radio" id="color-purple" name="color" value="hsl(263, 50%, 50%)">
                            <label class="color-label" for="color-purple"></label>
                            <input type="radio" id="color-pink" name="color" value="hsl(304, 50%, 50%)">
                            <label class="color-label" for="color-pink"></label>
                        </div>
                        <button type="submit" id="button-overlay-create-class">Create</button>`;
    return content;
}
export function showCreateClassOverlay() {
    showOverlay(getCreateClassContent());
    const createButton = document.querySelector('#button-overlay-create-class') as HTMLButtonElement;
    createButton.addEventListener('click', onCreateClassClicked);
}
export function hideOverlay() {
    const overlay = document.querySelector('#overlay');
    if (overlay) overlay.remove();
}

async function onCreateTaskClicked() {
    const selectClass = document.querySelector('#select-class') as HTMLSelectElement;
    const inputTitle = document.querySelector('#input-title') as HTMLInputElement;
    const inputDueDate = document.querySelector('#input-due-date') as HTMLInputElement;

    const classValue = selectClass.value;
    const title = inputTitle.value;
    const dueDate = inputDueDate.value;
    console.log(classValue, title, dueDate);
    if (!await taskManager.createTask(classValue, dueDate, title)) {
        alert('An error occurred when creating a task. Please make sure to fill out all fields.');
        return;
    }

    alert(`Task "${classValue} - ${title}" created successfully.`);

    hideOverlay();

    const mainList = document.querySelector('#main-task-list') as HTMLDivElement;
    taskManager.updateTaskUI(mainList);
}
async function onCreateClassClicked() {
    const inputCourse = document.querySelector('#input-course') as HTMLInputElement;
    const colorRadioButtons = document.getElementsByName('color') as unknown as HTMLInputElement[];

    const course = inputCourse.value;
    let color = 'hsl(237, 50%, 50%)';
    colorRadioButtons.forEach((radio) => {
        if (radio.checked) {
            color = radio.value;
        }
    });

    if (!await classManager.createClass(course, color)) {
        alert('An error occurred when creating a class.');
        return;
    }

    alert(`Class "${course}" created successfully.`);

    hideOverlay();
}
function selectTaskCard(taskCard: HTMLElement) {
    unselectTaskCard();
    taskCard.classList.add('selected');
    taskManager.setLastSelectedTaskId(Number(taskCard.getAttribute('task-id')));
}
function unselectTaskCard() {
    const oldSelectedTaskCard = document.querySelector('.task.card.selected');
    if (oldSelectedTaskCard) oldSelectedTaskCard.classList.remove('selected');
    taskManager.setLastSelectedTaskId(-1);
}
document.addEventListener('click', async (e) => {
    if (!e || !e?.target) return;

    const target = e.target as HTMLElement;

    if (target.id == 'overlay') {
        hideOverlay();
    }
    if (!target.closest('#context-menu')) {
        removeExistingContextMenu();
    }

    // Check if clicked off calendar-task-info
    if (!target.closest('#calendar-task-info')) {
        removeExistingCalendarTaskInfo();
    }

    // Check if clicked within task card
    const clickedTaskCard = target.closest('.task.card') as HTMLElement;
    if (clickedTaskCard) {
        selectTaskCard(clickedTaskCard);

        const clickedCheckbox = target.closest('input[type="checkbox"]') as HTMLInputElement;
        if (clickedCheckbox) {
            const taskId = clickedTaskCard.getAttribute('task-id') as string;
            const newStatus = (clickedCheckbox.checked) ? 'completed' : 'pending';

            await taskManager.updateTaskStatus(taskId, newStatus);
            
            const mainList = document.querySelector('#main-task-list') as HTMLDivElement;
            taskManager.updateTaskUI(mainList);
        }
        else {
            renderContextMenu(e.clientX, e.clientY);
        }
    }

    // Check if clicked calendar-task-span
    const clickedTaskSpan = target.closest('.calendar-task-span') as HTMLSpanElement;
    if (clickedTaskSpan) {
        const taskId = Number(clickedTaskSpan.getAttribute('task-id'));
        const task = taskManager.getTask(taskId);
        if (task) {
            renderCalendarTaskInfo(e.clientX, e.clientY, task);
        }
    }
    
});
function getContextMenuContent() {
    const content = document.createElement('div');
    content.innerHTML = `
        <div class="context-menu-item" id="item-edit-task">Edit Task</div>
        <div class="context-menu-item warning" id="item-delete-task">Delete Task</div>
        `;
    content.id = 'context-menu';
    return content;
}
function renderContextMenu(x: number, y: number) {
    removeExistingContextMenu();
    const contextMenu = getContextMenuContent();
    document.body.append(contextMenu);
    // contextMenu.style.position = 'absolute';
    contextMenu.style.top = String(y) + "px";
    contextMenu.style.left = String(x) + "px";

    // Set functionality for options

    const editTaskDiv = document.querySelector('#item-edit-task') as HTMLElement;
    editTaskDiv.addEventListener('click', showEditTaskOverlay);

    const deleteTaskDiv = document.querySelector('#item-delete-task') as HTMLElement;
    deleteTaskDiv.addEventListener('click', showDeleteWarningOverlay);
}
function removeExistingContextMenu() {
    const contextMenu = document.querySelector('#context-menu') as HTMLElement;
    if (contextMenu) contextMenu.remove();
}

function getCalendarTaskInfoContent(task: Task) {
    const content: HTMLDivElement = document.createElement('div');
    content.innerHTML = `
            <div class="task-title-group">
              <div class="class-name">${task.course}</div>
              <div class="task-name">${task.title}</div>
            </div>
            <div class="task-completion-group">
              <div class="task-due-date">Due ${task.due_date}</div>
              <input type="checkbox" ${(task.status == "completed") ? 'checked' : ''}>
            </div>`
    content.id = 'calendar-task-info';
    content.classList.add('task', 'card');
    content.setAttribute('task-id', String(task.id));
    return content;
}
function renderCalendarTaskInfo(x: number, y: number, task: Task) {
    removeExistingCalendarTaskInfo();
    const calendarTaskInfo = getCalendarTaskInfoContent(task);

    document.body.append(calendarTaskInfo);

    const height = calendarTaskInfo.offsetHeight;
    const width = calendarTaskInfo.offsetWidth;
    const yPosition = (window.innerHeight < y + height) ? y - height : y;
    const xPosition = (window.innerWidth < x + width) ? x - width : x;
    calendarTaskInfo.style.top = String(yPosition) + "px";
    calendarTaskInfo.style.left = String(xPosition) + "px";
}
function removeExistingCalendarTaskInfo() {
    const calendarTaskInfo = document.querySelector('#calendar-task-info') as HTMLElement;
    if (calendarTaskInfo) calendarTaskInfo.remove();
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
    const id = taskManager.getLastSelectedTaskId();

    if (!id) return;

    console.log(await taskManager.deleteTask(String(id)));
    const mainList = document.querySelector('#main-task-list') as HTMLDivElement;
    taskManager.updateTaskUI(mainList);
    hideOverlay();
}
function getEditTaskContent() {
    const classes = classManager.getClasses();
    let classesSelectOptions = '';

    classes.forEach((c) => {
        classesSelectOptions += `<option value="${c.name}">${c.name}</option>`
    })

    const content: HTMLDivElement = document.createElement('div');
    content.innerHTML = `<div style="font-size: 2rem;">Edit Task</div>
                        <label for="class">Class</label>
                        <select name="class" id="select-class">
                            ${classesSelectOptions}
                        </select>
                        <label for="title">Title</label>
                        <input type="text" name="title" id="input-title">
                        <label for="due-date">Due Date</label>
                        <input type="date" name="due-date" id="input-due-date">
                        <button type="submit" id="button-overlay-edit-task">Save Edits</button>`;
    return content;
}
function showEditTaskOverlay() {
    removeExistingContextMenu();
    showOverlay(getEditTaskContent());

    // Get existing task data
    const selectedTask = document.querySelector('.task.card.selected') as HTMLElement;

    const className = selectedTask.querySelector('.class-name')?.textContent;
    const taskName = selectedTask.querySelector('.task-name')?.textContent;
    const taskDueDate = selectedTask.querySelector('.task-due-date')?.textContent.slice(4);

    if (!className || !taskName || !taskDueDate) {
        alert("An error occurred when trying to load task data.");
        return;
    }

    // Fill in data and set up button
    const selectClass = document.querySelector('#select-class') as HTMLSelectElement;
    selectClass.value = className;
    const inputTitle = document.querySelector('#input-title') as HTMLInputElement;
    inputTitle.value = taskName;
    const inputDueDate = document.querySelector('#input-due-date') as HTMLInputElement;
    inputDueDate.value = taskDueDate;

    const saveEditsButton = document.querySelector('#button-overlay-edit-task') as HTMLButtonElement;
    saveEditsButton.addEventListener('click', onEditTaskClicked);
}
async function onEditTaskClicked() {
    const id = taskManager.getLastSelectedTaskId();

    if (!id) {
        alert("Error: 'id' for task not found.");
        return;
    }

    const task = taskManager.getTask(id);

    if (!task ) {
        alert("Error: Could not find task for id.");
        return;
    }

    const className = task.course;
    const taskName = task.title;
    const taskDueDate = task.due_date as unknown as String;

    const selectClass = document.querySelector('#select-class') as HTMLSelectElement;
    const inputTitle = document.querySelector('#input-title') as HTMLInputElement;
    const inputDueDate = document.querySelector('#input-due-date') as HTMLInputElement;

    const classValue = selectClass.value;
    const title = inputTitle.value;
    const dueDate = inputDueDate.value;

    // Check if the values are different
    if (className == classValue && taskName == title && taskDueDate == dueDate) {
        alert("No changes made!")
        hideOverlay();
        return;
    }


    if (!await taskManager.updateTaskData(String(id), classValue, dueDate, title)) {
        alert('An error occurred when creating a task. Please make sure to fill out all fields.');
        return;
    }

    alert('Edits saved successfully.');

    hideOverlay();

    const mainList = document.querySelector('#main-task-list') as HTMLDivElement;
    taskManager.updateTaskUI(mainList);
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
let scrolling = false;
document.addEventListener(
    'scroll',
    () => {
        if (scrolling) {
            return;
        }
        scrolling = true;
        
        removeExistingContextMenu();
        setTimeout(() => {
            scrolling = false;
        }, 300);
    },
    { passive: true }
);