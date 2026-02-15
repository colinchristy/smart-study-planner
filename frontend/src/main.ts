import './style.css'
import { loadTasks, createTask } from './tasks'

const mainList = document.querySelector('#main-task-list') as HTMLDivElement;


// console.log(createTask('C486', '2026-02-15', 'Report 4'));

loadTasks(mainList);

