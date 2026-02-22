export type Task = {
  course: string,
  created_at: Date,
  due_date: Date,
  id: number,
  status: string,
  title: string
}

export const API_URL = 'https://studyplanner.it.com/api/';
export const TASKS_URL = API_URL + 'tasks/';

export async function loadTasks(list: HTMLDivElement) {
  list.innerHTML = 'Loading...';
  const tasks = await getTasks();
  list.innerHTML = '';
  tasks.sort((a, b) => {
    if (a.due_date < b.due_date) return -1;
    if (a.due_date == b.due_date) return 0;
    return 1;
  });
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
  console.log(response);
  const data: unknown = response.json();
  console.log(data);
  return response.ok && response.status == 201;
}
export function createTaskElement(task: Task) {
  return `<div class="task card" task-id="${task.id}">
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