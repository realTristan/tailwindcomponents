export default class Params {
    // The params
    private params: { [key: string]: string } = {};

    // Convert the params to a string
    private toString = (): string => {
        let params: string = "?";
        for (const key in this.params) {
            const value: string = this.params[key] || null;
            params += `${key}=${value}&`;
        }
        return params.slice(0, -1);
    }

    // Set the window location
    public setWindowLocation = (): void => {
        window.location.search = this.toString();
    }

    // Get a param
    public get = (value: string): string | null => this.params[value] || null;

    // Delete a param
    public delete = (key: string): void => {
        delete this.params[key];
        this.setWindowLocation();
    }

    // Set a param
    public set = (key: string | object, value: string): void => {
        if (typeof key === "object") {
            for (const k in key) {
                const v: string = key[k] || null;
                this.params[k] = v;
            }
        } else if (typeof key === "string") {
            this.params[key] = value;
        }
        this.setWindowLocation();
    }
}