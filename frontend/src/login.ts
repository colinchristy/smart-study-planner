document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.querySelector('#button-login');
    loginButton?.addEventListener('click', onLoginButtonPressed);
})

function onLoginButtonPressed() {
    const inputUsername = document.querySelector('#input-username') as HTMLInputElement;
    const inputPassword = document.querySelector('#input-password') as HTMLInputElement;

    const username = inputUsername.value;
    const password = inputPassword.value;

    if (validLogin(username, password)) window.location.href = 'index.html?authenticated=true';
    else alert('Your username or password is incorrect.');
}

function validLogin (username: string, password: string): boolean {
    return username != '' && password != '';
}
