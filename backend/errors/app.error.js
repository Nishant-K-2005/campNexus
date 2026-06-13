export class AppError extends Error {
    constructor(msg, code){
        super(msg)
        this.status = code
    }
}