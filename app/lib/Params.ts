export default class Params {
  public static get = (value: string): string | null =>
    new URLSearchParams(window.location.search).get(value);

  public static readonly set = (obj: any): void => {
    let result: string = "?";
    for (const k in obj) result += `${k}=${obj[k] || null}&`;
    window.location.search = result.slice(0, -1);
  };
}
