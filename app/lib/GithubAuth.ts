import Params from "./Params";
import config from "./Config";

export default class GithubAuth {
  public readonly error = (): string | null => Params.get("error");

  public readonly errorUri = (): string | null => Params.get("error_uri");

  public readonly errorDescription = (): string | null => Params.get("error_description");

  public readonly code = (): string | null => Params.get("code");

  public readonly scope = (): string | null => Params.get("scope");

  public readonly tokenType = (): string | null => Params.get("token_type");

  public readonly accessToken = (): string | null => Params.get("access_token");

  public readonly refreshToken = (): string | null => Params.get("refresh_token");

  public readonly expiresIn = (): string | null => Params.get("expires_in");

  public readonly refreshTokenExpiresIn = (): string | null => Params.get("refresh_token_expires_in");

  public readonly expiresAt = (): string | null => Params.get("expires_at");

  public readonly refreshTokenExpiresAt = (): string | null => Params.get("refresh_token_expires_at");

  public readonly uploadData = (): any => {
    return {
      access_token: this.accessToken(),
      refresh_token: this.refreshToken(),
      expires_at: this.expiresAt(),
      refresh_token_expires_at: this.refreshTokenExpiresAt(),
    }
  }

  private readonly openAuthWindow = (): void => {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${config.client_id}&redirect_uri=${config.home_uri}`;
  };

  public readonly isLoggedIn = (): boolean => this.accessToken() !== null;

  public readonly errorOccurred = (): boolean => this.error() !== null;

  private readonly setUrlParams = (json: any): void => Params.set(json);

  private readonly fetchAccessToken = (code: string): void => {
    fetch(`${config.home_uri}/api/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: code,
        client_id: config.client_id,
        redirect_uri: config.home_uri,
      }),
    })
      .then((resp) => resp.json())
      .then((json) => this.setUrlParams(json))
      .catch((error) => console.log(error));
  };

  public login(): void {
    if (this.isLoggedIn()) return;

    let code: string | null = this.code();

    if (code === null) this.openAuthWindow();

    if (code !== null) this.fetchAccessToken(code);
  }
}
