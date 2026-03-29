import { API_URL } from "./apiUrl";
import { createTaskElement } from "./ui";

export type Task = {
  course: string,
  created_at: Date,
  due_date: Date,
  id: number,
  status: string,
  title: string
}

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

export async function updateTaskStatus(id: string, newStatus: string) {
  const response = await fetch(TASKS_URL + id, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      status: newStatus
    })
  });
  console.log(response);
  const data: unknown = response.json();
  console.log(data);
  return response.ok && response.status == 200;
}

export async function deleteTask(id: string) {
  const response = await fetch(TASKS_URL + id, {
    method: 'DELETE',
  });
  console.log(response);
  return response.ok && response.status == 204;
}