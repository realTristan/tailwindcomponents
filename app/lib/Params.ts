export default class Params {
  // The params
  private params: any = {};

  // Convert the params to a string
  private toString = (): string => {
    let params: string = "?";
    for (const key in this.params) {
      const value: any | null = this.params[key];
      params += `${key}=${value}&`;
    }
    return params.slice(0, -1);
  };

  // Set the window location
  public setWindowLocation = (): void => {
    window.location.search = this.toString();
  };

  // Get a param
  public get = (value: string): string | null => this.params[value];

  // Delete a param
  public delete = (key: string): void => {
    delete this.params[key];
    this.setWindowLocation();
  };

  // Set a param with a key and value
  public set = (key: string, value: string): void => {
    this.params[key] = value;
    this.setWindowLocation();
  };

  // Set a param with an object
  public setObj = (key: any): void => {
    for (const k in key) {
      this.params[k] = key[k] || null;
    }
    this.setWindowLocation();
  };
}
