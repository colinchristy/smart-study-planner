import { API_URL } from "./apiUrl";
import { auth } from "./auth";
import { calendarView } from "./main";
import { createTaskElement } from "./ui";

export type Task = {
  course: string,
  created_at: Date,
  due_date: Date,
  id: number,
  status: string,
  title: string
}

const TASKS_URL = API_URL + 'tasks/';
class TaskManager {
  private tasks: Task[];

  public constructor() {
    this.tasks = [];
  }

  private async fetchTasks(): Promise<Task[]> {
    const response = await fetch(TASKS_URL, {
      method: 'GET',
      headers: {
        'Authorization': 'Token ' + auth.getToken(),
      }
    });
    const data: Task[] = await response.json();
    this.tasks = data;

    return data;
  }
  public async updateTaskUI(list: HTMLDivElement) {
    calendarView.updateView();
    await this.updateTasksList(list);
  }
  private async updateTasksList(list: HTMLDivElement) {
    list.innerHTML = 'Loading...';
    const tasks = await this.getTasks();
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
  public async getTasks(): Promise<Task[]> {
    if (this.tasks.length == 0) {
      await this.fetchTasks();
    }
    return this.tasks;
  }
  public getTask(id: number) {
    const task = this.tasks.find((t) => t.id == id);
    if (task)
      return task;
    return null;
  }

  public async createTask(course: string, due_date: string, title: string) {
    const response = await fetch(TASKS_URL, {
      method: 'POST',
      headers: {
        'Authorization': 'Token ' + auth.getToken(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        course: course,
        due_date: due_date,
        title: title
      })
    });
    console.log(response);
    const data = await response.json();
    console.log(data);
    const success = response.ok && response.status == 201;
    if (success) {
      this.tasks.push(data);
    }
    return success;
  }

  public async updateTaskData(id: string, course: string, due_date: string, title: string) {
    const response = await fetch(TASKS_URL + id, {
      method: 'PUT',
      headers: {
        'Authorization': 'Token ' + auth.getToken(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        course: course,
        due_date: due_date,
        title: title
      })
    });
    console.log(response);
    const data = await response.json();
    console.log(data);
    const success = response.ok && response.status == 200;
    if (success) {
      this.tasks = this.tasks.filter((task) => task.id != Number(id));
      this.tasks.push(data);
    }
    return success;
  }

  async updateTaskStatus(id: string, newStatus: string) {
    const response = await fetch(TASKS_URL + id, {
      method: 'PUT',
      headers: {
        'Authorization': 'Token ' + auth.getToken(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status: newStatus
      })
    });
    console.log(response);
    const data = await response.json();
    console.log(data);
    const success = response.ok && response.status == 200;
    if (success) {
      this.tasks = this.tasks.filter((task) => task.id != Number(id));
      this.tasks.push(data);
    }
    return success;
  }

  async deleteTask(id: string) {
    const response = await fetch(TASKS_URL + id, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Token ' + auth.getToken(),
      }
    });
    console.log(response);
    const success = response.ok && response.status == 204;
    if (success) {
      this.tasks = this.tasks.filter((task) => task.id != Number(id));
    }
    return success;
  }
}

export const taskManager = new TaskManager();






