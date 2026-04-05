import { auth } from "./auth";

document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.querySelector('#button-login');
    loginButton?.addEventListener('click', onLoginButtonPressed);

    const registerButton = document.querySelector('#button-register');
    registerButton?.addEventListener('click', onRegisterButtonPressed);
})

async function onLoginButtonPressed() {
    const inputUsername = document.querySelector('#input-username') as HTMLInputElement;
    const inputPassword = document.querySelector('#input-password') as HTMLInputElement;

    const username = inputUsername.value;
    const password = inputPassword.value;

    const success = await auth.loginUser(username, password);
    if (success) window.location.href = 'index.html';
    else alert('Your username or password is incorrect.');
}

async function onRegisterButtonPressed() {
    const inputUsername = document.querySelector('#input-username') as HTMLInputElement;
    const inputPassword = document.querySelector('#input-password') as HTMLInputElement;

    const username = inputUsername.value;
    const password = inputPassword.value;

    const success = await auth.registerUser(username, password);
    if (success) {
        alert('Account created successfully!');
        window.location.href = 'index.html';
    }
    else alert('Failed to create an account.');
}