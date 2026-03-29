import { API_URL } from "./apiUrl";

const CLASSES_URL = API_URL + 'classes';

export async function createClass(name: string) {
  const response = await fetch(CLASSES_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name
    })
  });
  console.log(response);
  const data: unknown = response.json();
  console.log(data);
  return response.ok && response.status == 201;
}