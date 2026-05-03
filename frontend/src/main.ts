import { API_URL } from './apiUrl';
import { auth } from './auth';
import CalendarView from './calendarView';
import { classManager } from './classes';
import { taskManager } from './tasks'
import { showCreateClassOverlay, showCreateTaskOverlay } from './ui';

import './style.css'

await auth.requireAuth();

await classManager.fetchClasses();

const buttonSignOut = document.querySelector('#button-sign-out') as HTMLButtonElement;

buttonSignOut.addEventListener('click', () => { auth.signOut() });

const usernameElement = document.querySelector('#username') as HTMLElement;
const storedUsername = auth.getUsername();
usernameElement.innerText = (storedUsername) ? storedUsername : '';

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
const calendarViewContainer = document.querySelector('#calendar-view-container') as HTMLDivElement;
export const calendarView = new CalendarView(calendarViewContainer);

taskManager.updateTaskUI(mainList);

const buttonToggleViewType = document.querySelector('#button-toggle-view-type') as HTMLButtonElement;
let isCalendarViewType = false;
calendarViewContainer.classList.add('hide');

buttonToggleViewType.addEventListener('click', () => {
     isCalendarViewType = !isCalendarViewType;

     buttonToggleViewType.innerText = (isCalendarViewType) ? 'List View' : 'Calendar View';
     calendarViewContainer.classList.toggle('hide');
     mainList.classList.toggle('hide');
});

// const response = await fetch(API_URL + 'schedule/', {
//     method: 'POST',
//     headers: {
//         'Authorization': 'Token ' + auth.getToken(),
//         'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//         due_date: "2026-04-30",
//         goal_date: "2026-04-28",
//         hours_needed: 12
//     })
// });
// const data = await response.json();
// console.log(data);

