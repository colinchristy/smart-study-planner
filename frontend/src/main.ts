import './style.css'
import { loadTasks, deleteTask, createTask, updateTaskStatus } from './tasks'
import { showCreateTaskOverlay } from './ui';

const mainList = document.querySelector('#main-task-list') as HTMLDivElement;
const buttonCreateTask = document.querySelector('#button-create-task') as HTMLButtonElement;

buttonCreateTask.addEventListener('click', showCreateTaskOverlay);
// console.log(createTask('C486', '2026-02-15', 'Report 4'));

// for (let i = 1; i < 6; i++) {
//     createTask('C435', `2026-03-${i}`, 'Homework ' + i);
// }
// for (let i = 100; i < 130; i++) {
//     deleteTask(String(i));
// }
loadTasks(mainList);