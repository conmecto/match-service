export default class CustomError {
    private status: number;
    private error: string;
    private message?: string;
    private path?: string;

    constructor(status: number, error: string, message?: string) {
        this.status = status;
        this.error = error;
        this.message = message;
    }

    get errorObject() {
        return {
            status: this.status,
            error: this.error,
            message: this.message,
            path: this.path
        }
    }

    set apiPath(path: string) {
        this.path = path;
    }
}