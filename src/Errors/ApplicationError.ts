
export interface ApplicationError {
    readonly code: ErrorCodes,
    readonly message: string,
    readonly cause?: Error
}

export const enum ErrorCodes {
    E_UNKNOWN,
    E_VALIDATION,
    E_DUPLICATE,
    E_NOT_IMPLEMENTED
}   

