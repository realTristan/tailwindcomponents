export default class Params {
  // The params
  private params: any = {};

  // Convert the params to a string
  private toString = (): string => {
    let result: string = "?";
    for (const key in this.params) result += `${key}=${this.params[key]}&`;
    return result.slice(0, -1);
  };

  // Set the window location
  public setWindowLocation = (): void => {
    window.location.search = this.toString();
  };

  // Set a param with an object
  public set = (key: any): void => {
    for (const k in key) this.params[k] = key[k] || null;
    this.setWindowLocation();
  };
}
