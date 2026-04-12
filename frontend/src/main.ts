import { auth } from './auth';
import { classManager } from './classes';
import './style.css'
import { loadTasks, createTask } from './tasks'
import { showCreateClassOverlay, showCreateTaskOverlay } from './ui';

await auth.requireAuth();

await classManager.fetchClasses();

const buttonSignOut = document.querySelector('#button-sign-out') as HTMLButtonElement;

buttonSignOut.addEventListener('click', () => { auth.signOut() });

const greetingElement = document.querySelector('#user-greeting') as HTMLElement;
const storedUsername = auth.getUsername();
const greeting = (storedUsername) ? `Hello ${storedUsername}!` : 'Hello student!';
greetingElement.innerText = greeting;

const mainList = document.querySelector('#main-task-list') as HTMLDivElement;
const buttonCreateTask = document.querySelector('#button-create-task') as HTMLButtonElement;
const buttonCreateClass = document.querySelector('#button-create-class') as HTMLButtonElement;

if (classManager.getClasses().length == 0) buttonCreateTask.disabled = true;
buttonCreateTask.addEventListener('click', showCreateTaskOverlay);
buttonCreateClass.addEventListener('click', showCreateClassOverlay);

// console.log(createTask('C486', '2026-02-15', 'Report 4'));

// for (let i = 11; i < 20; i++) {
//     createTask('C486', `2026-04-${i}`, 'Homework ' + i);
// }
// for (let i = 100; i < 130; i++) {
//     deleteTask(String(i));
// }
loadTasks(mainList);