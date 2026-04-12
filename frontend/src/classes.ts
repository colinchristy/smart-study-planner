import { API_URL } from "./apiUrl";
import { auth } from "./auth";

const CLASSES_URL = API_URL + 'classes/';

type ClassType = {
  id: number;
  name: string;
}

class ClassManager {
  private classes: ClassType[];

  public constructor() {
    this.classes = [];
  }

  public async fetchClasses() {
    const response = await fetch(CLASSES_URL, {
      method: 'GET',
      headers: {
        'Authorization': 'Token ' + auth.getToken(),
      }
    });
    console.log(response);
    const data: ClassType[] = await response.json() as ClassType[];
    if (data) this.setClasses(data);
  }

  public getClasses(): ClassType[] {
    return this.classes;
  }

  /**
   * Set the classes locally. Removes any duplicate named classes.
   * @param classes Classes to be stored locally.
   */
  private setClasses(classes: ClassType[]) {
    this.classes = [];
    const classesSet = new Set();

    classes.forEach((c) => {
      if (!classesSet.has(c.name)) {
        classesSet.add(c.name);
        this.classes.push(c);
      }
    })

    console.log("Classes set to: " + JSON.stringify(this.classes));

    // Make sure that createNewTask button is enabled
    const buttonCreateTask = document.querySelector('#button-create-task') as HTMLButtonElement;
    if (this.classes.length > 0) buttonCreateTask.disabled = false;
  }

  public async createClass(name: string) {
    const response = await fetch(CLASSES_URL, {
      method: 'POST',
      headers: {
        'Authorization': 'Token ' + auth.getToken(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name
      })
    });
    console.log("Create class response: ");
    console.log(response);
    const data = await response.json();
    console.log("Create class data: ");
    console.log(data);
    if (!response.ok || response.status != 201) return false;

    await this.fetchClasses();
    return data;
  }
}

export const classManager = new ClassManager();