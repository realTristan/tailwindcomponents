export default class Params {
  public static set = (obj: any): void => {
    let result: string = "?";
    for (const k in obj) result += `${k}=${obj[k]}&`;
    window.location.search = result.slice(0, -1);
  };
}
