export async function requireAuth() {
    // Check if user is authenticated (test for now)
    const paramsString = window.location.search;
    const params = new URLSearchParams(paramsString);

    
    // If not authenticated, kick to the login page
    if (!params.get('authenticated')) window.location.href = 'login.html';
}