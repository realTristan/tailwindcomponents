import Params from "./Params";

export default class GithubAuth {
  private readonly CLIENT_ID: string = "Iv1.2a8798736f1f1aa0";
  private readonly IS_PRODUCTION: boolean = true;
  private readonly HOME_URI: string = this.IS_PRODUCTION
    ? "https://tailwindcomponents-gules.vercel.app"
    : "http://localhost:3000";

  // Get values from the url params
  private get = (value: string): string | null =>
    new URLSearchParams(window.location.search).get(value);

  // Errors
  public readonly error = (): string | null => this.get("error");
  public readonly errorDescription = (): string | null =>
    this.get("error_description");
  public readonly errorUri = (): string | null => this.get("error_uri");

  // Access
  public readonly code = (): string | null => this.get("code");
  public readonly scope = (): string | null => this.get("scope");
  public readonly expiresIn = (): string | null => this.get("expires_in");
  public readonly tokenType = (): string | null => this.get("token_type");
  public readonly accessToken = (): string | null => this.get("access_token");
  public readonly refreshToken = (): string | null => this.get("refresh_token");
  public readonly refreshTokenExpiresIn = (): string | null =>
    this.get("refresh_token_expires_in");

  // Open the auth window
  private readonly openAuthWindow = (): void => {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${this.CLIENT_ID}&redirect_uri=${this.HOME_URI}`;
  };

  // Check if the user is logged in
  public readonly isLoggedIn = (): boolean => this.accessToken() !== null;
  public readonly errorOccurred = (): boolean => this.error() !== null;

  // Set the url params
  private readonly setUrlParams = (json: any): void => Params.set(json);

  // Get the access token
  private readonly fetchAccessToken = (code: string): void => {
    fetch(`${this.HOME_URI}/api/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: code,
        client_id: this.CLIENT_ID,
        redirect_uri: this.HOME_URI,
      }),
    })
      .then((resp) => resp.json())
      .then((json) => this.setUrlParams(json))
      .catch((error) => console.log(error));
  };

  // Main login function
  public login(): void {
    if (this.isLoggedIn()) return;

    let code: string | null = this.code();

    if (code === null) this.openAuthWindow();

    if (code !== null) this.fetchAccessToken(code);
  }
}
