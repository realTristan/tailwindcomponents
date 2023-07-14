import env from "./environments/env.dev"

export default class GithubAuth {
    private readonly CLIENT_ID = env.github_client_id;
    private readonly REDIRECT_URI = env.github_redirect_uri;
    private readonly CLIENT_SECRET = env.github_client_secret;
    private readonly AUTH_REQUEST: any = {
        url: "https://github.com/login/oauth/authorize",
        method: "GET",
    }
    private readonly ACCESS_TOKEN_REQUEST: any = {
        url: "https://github.com/login/oauth/access_token",
        method: "POST",
    }

    // Send a login request
    public openAuthRequest(): void {
        const request = this.AUTH_REQUEST;
        request.url += `?client_id=${this.CLIENT_ID}`;
        request.url += `&redirect_uri=${this.REDIRECT_URI}`;
        window.location.href = request.url;
    }

    // Get the auth code from the url
    public getCodeFromUrl(): string | null {
        const url = new URL(window.location.href);
        return url.searchParams.get("code");
    }

    // Get the access token from the url
    public getAccessTokenFromUrl(): string | null {
        const url = new URL(window.location.href);
        return url.searchParams.get("access_token");
    }

    // Check if the user is logged in
    public codeInUrl(): boolean {
        return this.getCodeFromUrl() !== null;
    }

    // Check if the access token is in the url
    public accessTokenInUrl(): boolean {
        return this.getAccessTokenFromUrl() !== null;
    }

    // Add the access token to the url
    public openAccessTokenRequest(accessToken: string): void {
        const url = new URL(window.location.href);
        url.searchParams.set("access_token", accessToken);
        window.location.href = url.href;
    }

    // Get the access token
    public getAccessToken(code: string): void {
        const request = this.ACCESS_TOKEN_REQUEST;
        request.url += `?client_id=${this.CLIENT_ID}`;
        request.url += `&redirect_uri=${this.REDIRECT_URI}`;
        request.url += `&client_secret=${this.CLIENT_SECRET}`;
        request.url += `&code=${code}`;
        fetch(request.url, {
            method: request.method,
            headers: {
                "Accept": "application/json"
            },
        })
        .then(response => response.json())
        .then(json => {
            let token: string = json.access_token;
            this.openAccessTokenRequest(token);
        })
        .catch(error => console.error(error));
    }

    // Main login function
    public login(): void {
        // Check if the access token is in the url
        if (this.accessTokenInUrl()) {
            return;
        }
        
        // If the user is not logged in, send a login request
        if (!this.codeInUrl()) {
            this.openAuthRequest();
        }

        // Get the access token
        let code: string | null = this.getCodeFromUrl();
        if (code !== null) {
            this.getAccessToken(code);
        }
    }
}