document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.querySelector('#button-login');
    loginButton?.addEventListener('click', () => {
        window.location.href = 'index.html?authenticated=true';
    });
})