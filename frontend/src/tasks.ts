export type Task = {
  course: String,
  created_at: Date,
  due_date: Date,
  id: Number,
  status: String,
  title: String
}

export const API_URL = 'https://studyplanner.it.com/api/';
export const TASKS_URL = API_URL + 'tasks/';

export async function loadTasks(list: HTMLDivElement) {
  list.innerHTML = 'Loading...';
  const tasks = await getTasks();
  list.innerHTML = '';
  tasks.forEach((task) => {
    const element = createTaskElement(task);
    list.insertAdjacentHTML('beforeend', element);
  })
}
export async function getTasks(): Promise<Task[]> {
  const response = await fetch(TASKS_URL, {
      method: 'GET'
  });
  const data: unknown = response.json();
  console.log(data);
  
  return data as Task[];
}
export async function createTask(course: string, due_date: string, title: string) {
  const response = await fetch(TASKS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        course: course,
        due_date: due_date,
        title: title
    })
  });
  const data: unknown = response.json();
  console.log(data);
  return data != null;
}
export function createTaskElement(task: Task) {
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