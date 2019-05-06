
export class ApplicationError {
    readonly code: ErrorCodes
    readonly message: string
    readonly cause?: Error

    constructor(code: ErrorCodes, message: string, cause?: Error) {
        this.code = code
        this.message = message
        this.cause = cause
    }
}

export const enum ErrorCodes {
    E_UNKNOWN,
    E_VALIDATION,
    E_DUPLICATE,
    E_NOT_IMPLEMENTED,
    E_NOT_FOUND
}

