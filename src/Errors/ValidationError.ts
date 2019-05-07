import { ApplicationError, ErrorCodes } from "./ApplicationError";

export class ValidationError extends ApplicationError {
    constructor(message: string, cause?: Error) {
        super(ErrorCodes.E_VALIDATION, message, cause)
    }
}