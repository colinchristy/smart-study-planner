import './style.css'
import { loadTasks } from './tasks'
import { showCreateTaskOverlay } from './ui';

const mainList = document.querySelector('#main-task-list') as HTMLDivElement;
const buttonCreateTask = document.querySelector('#button-create-task') as HTMLButtonElement;

buttonCreateTask.addEventListener('click', showCreateTaskOverlay);
// console.log(createTask('C486', '2026-02-15', 'Report 4'));

loadTasks(mainList);

