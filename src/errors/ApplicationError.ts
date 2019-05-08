
export class ApplicationError {
    readonly code: ErrorCodes
    readonly message: string
    readonly cause?: Error

    constructor(code: ErrorCodes, message: string, cause?: Error) {
        this.code = code
        this.message = message
        this.cause = cause
    }

    public get status(): number {
        switch (this.code) {
            case ErrorCodes.E_DUPLICATE:
            case ErrorCodes.E_VALIDATION:
                return 401;
            case ErrorCodes.E_NOT_FOUND:
                return 404;
            case ErrorCodes.E_UNKNOWN:
            case ErrorCodes.E_NOT_IMPLEMENTED:
                return 500;
            default:
                return 500;
        }
    }

}

export const enum ErrorCodes {
    E_UNKNOWN = "E_UNKNOWN",
    E_VALIDATION = "E_VALIDATION",
    E_DUPLICATE = "E_DUPLICATE",
    E_NOT_IMPLEMENTED = "E_NOT_IMPLEMENTED",
    E_NOT_FOUND = "E_NOT_FOUND"
}

