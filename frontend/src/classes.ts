import { API_URL } from "./apiUrl";
import { auth } from "./auth";

const CLASSES_URL = API_URL + 'classes';

export async function getClasses() {
  const response = await fetch(CLASSES_URL, {
    method: 'GET',
    headers: {
      'Authorization': 'Token ' + auth.getToken(),
    }
  });
  console.log(response);
  const data: unknown = response.json();
  console.log(data);
  return data;
}
export async function createClass(name: string) {
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
  console.log(response);
  const data: unknown = response.json();
  console.log(data);
  return response.ok && response.status == 200;
}