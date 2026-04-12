import { API_URL } from "./apiUrl";

class AuthManager {
    private token: string;
    private username: string;

    public constructor() {
        const storageToken = localStorage.getItem('token');
        this.token = (storageToken) ? storageToken : '';

        const storageUsername = localStorage.getItem('username');
        this.username = (storageUsername) ? storageUsername : '';
    }

    public getToken(): string {
        return this.token;
    }
    public setToken(token: string) {
        this.token = token;
        localStorage.setItem('token', token);
    }
    private async verifyToken(): Promise<boolean> {
        console.log("Verifying token...");
        const response = await fetch(API_URL + 'classes/', {
            method: 'GET',
            headers: {
                'Authorization': 'Token ' + this.token,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();

        return data?.length != null;
    }
    public async requireAuth() {
        // If not authenticated, kick to the login page
        if (!this.token || !await this.verifyToken()) window.location.href = 'login.html';
    }

    public async registerUser(username: string, password: string): Promise<boolean> {
        if (username == '' || password == '') return false;

        const REGISTER_URL = API_URL + 'register/';

        const response = await fetch(REGISTER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });
        const data = await response.json();
        console.log('Registering user');
        console.log(data);
        if (data?.message != "User created successfully") return false;

        await this.loginUser(username, password);
        return true;
    }

    public async loginUser(username: string, password: string): Promise<boolean> {
        if (username == '' || password == '') return false;

        const LOGIN_URL = API_URL + 'login/';

        const response = await fetch(LOGIN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });
        const data = await response.json();

        if (!data?.token) return false;

        this.setToken(data.token);
        this.setUsername(username);
        return true;
    }
    public getUsername() {
        return this.username;
    }
    public setUsername(username: string) {
        this.username = username;
        localStorage.setItem('username', username);
    }

    public signOut() {
        this.setToken('');
        window.location.href = 'login.html';
    }
}

export const auth = new AuthManager()