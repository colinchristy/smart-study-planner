import { API_URL } from './apiUrl';
import { requireAuth } from './auth';
import './style.css'
import { loadTasks } from './tasks'
import { showCreateClassOverlay, showCreateTaskOverlay } from './ui';

requireAuth();

const mainList = document.querySelector('#main-task-list') as HTMLDivElement;
const buttonCreateTask = document.querySelector('#button-create-task') as HTMLButtonElement;
const buttonCreateClass = document.querySelector('#button-create-class') as HTMLButtonElement;

buttonCreateTask.addEventListener('click', showCreateTaskOverlay);
buttonCreateClass.addEventListener('click', showCreateClassOverlay);

// console.log(createTask('C486', '2026-02-15', 'Report 4'));

// for (let i = 1; i < 6; i++) {
//     createTask('C435', `2026-03-${i}`, 'Homework ' + i);
// }
// for (let i = 100; i < 130; i++) {
//     deleteTask(String(i));
// }
loadTasks(mainList);

const LOGIN_URL = API_URL + 'login';

const response = await fetch(LOGIN_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: "colinchristy",
    password: "123456"
  })
});
console.log(await response.json());