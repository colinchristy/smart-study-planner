import './style.css'

const API_URL = 'https://studyplanner.it.com/api/';
const TASKS_URL = API_URL + 'tasks/';



async function getTasks() {
  const response = await fetch(TASKS_URL, {
      method: 'GET'
  });
  const data: unknown = response.json();
  console.log(data);
  
  return data as Task[];
}

type Task = {
  course: String,
  created_at: Date,
  due_date: Date,
  id: Number,
  status: String,
  title: String
}
function createTaskElement(task: Task) {
  return `<div class="task card">
            <div class="task-title-group">
              <div class="class-name">${task.course}</div>
              <div class="task-name">${task.title}</div>
            </div>
            <div class="task-completion-group">
              <div class="task-due-date">Due ${task.due_date}</div>
              <div class="task-checkbox"><input type="checkbox"></div>
            </div>
          </div>`
}


const tasks = await getTasks();
const element = createTaskElement(tasks[0]);
const mainList = document.querySelector('#main-task-list');
if (mainList) {
  mainList.innerHTML = element;
}