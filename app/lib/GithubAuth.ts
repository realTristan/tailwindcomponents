import env from "./environments/env.dev";

export default class GithubAuth {
  private readonly CLIENT_ID: string = env.github_client_id;
  private readonly REDIRECT_URI: string = env.github_redirect_uri;
  private readonly CLIENT_SECRET: string = env.github_client_secret;

  // Send a login request
  public openAuthRequest(): void {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${this.CLIENT_ID}&redirect_uri=${this.REDIRECT_URI}`;
  }

  // Get the auth code from the url
  public getCodeFromUrl(): string | null {
    const url: URL = new URL(window.location.href);
    return url.searchParams.get("code");
  }

  // Get the access token from the url
  public getAccessTokenFromUrl(): string | null {
    const url: URL = new URL(window.location.href);
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

  // Check if the user is logged in
  public isLoggedIn(): boolean {
    return this.accessTokenInUrl() && this.codeInUrl();
  }

  // Add the access token to the url
  public openAccessTokenRequest(accessToken: string): void {
    const url: URL = new URL(window.location.href);
    url.searchParams.set("access_token", accessToken);
    window.location.href = url.href;
  }

  // Get the access token
  public fetchAccessToken(code: string): void {
    fetch("http://localhost:3000/api/auth", {
      method: "POST",
      body: {
        code: code,
        client_id: this.CLIENT_ID,
        redirect_uri: this.REDIRECT_URI,
      },
    })
      .then((resp) => resp.json())
      .then((json) => this.openAccessTokenRequest(json.access_token))
      .catch((error) => console.error(error));
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
      this.fetchAccessToken(code);
    }
  }
}
