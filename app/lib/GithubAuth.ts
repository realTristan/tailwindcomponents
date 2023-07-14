import Params from "./Params";

export default class GithubAuth {
  private readonly CLIENT_ID: string = "Iv1.2a8798736f1f1aa0";
  private readonly REDIRECT_URI: string = "http://localhost:3000";

  // Get values from the url params
  private get = (value: string): string | null =>
    new URLSearchParams(window.location.search).get(value);

  public readonly scope = (): string | null => this.get("scope");
  public readonly authCode = (): string | null => this.get("code");
  public readonly expiresIn = (): string | null => this.get("expires_in");
  public readonly tokenType = (): string | null => this.get("token_type");
  public readonly accessToken = (): string | null => this.get("access_token");
  public readonly refreshToken = (): string | null => this.get("refresh_token");
  public readonly refreshTokenExpiresIn = (): string | null =>
    this.get("refresh_token_expires_in");

  // Open the auth window
  private readonly openAuthWindow = (): void =>
    (window.location.href = `https://github.com/login/oauth/authorize?client_id=${this.CLIENT_ID}&redirect_uri=${this.REDIRECT_URI}`);

  // Check if the user is logged in
  public readonly isLoggedIn = (): boolean => this.accessToken() !== null;

  // Set the url params
  private readonly setUrlParams = (json: any): void => new Params().set(json);

  // Get the access token
  private readonly fetchAccessToken = (code: string): void => {
    fetch("http://localhost:3000/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: code,
        client_id: this.CLIENT_ID,
        redirect_uri: this.REDIRECT_URI,
      }),
    })
      .then((resp) => resp.json())
      .then((json) => setUrlParams(json))
      .catch((error) => console.log(error));
  };

  // Main login function
  public login(): void {
    if (this.isLoggedIn()) return;

    let auth_code: string | null = this.authCode();

    if (auth_code === null) this.openAuthWindow();

    if (auth_code !== null) this.fetchAccessToken(auth_code);
  }
}
