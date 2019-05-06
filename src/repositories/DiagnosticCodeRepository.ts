import { Client } from 'pg'
import {  ErrorCodes } from '../Errors/ApplicationError';

/**
 * Provides an interface for manipulating the diagnostic_codes table. 
 * Bear in mind that it only works with postgres.
 */
export class DiagnosticCodeRepository {
    /**
     * Adds a new diagnostic code record into the database.
     * 
     * @param {Client} client the database connection
     * @param {DiagnosticCode} diagnosticCode the new diagnositc
     * 
     * @returns {DiagnosticCode|ApplicationError} the new diagnostic code or any error that caused 
     * the operation to fail
     */
    public add(client: Client, diagnosticCode: DiagnosticCode): Promise<DiagnosticCode> {
        return new Promise<DiagnosticCode>((res, rej) => {
            rej({
                code: ErrorCodes.E_NOT_IMPLEMENTED,
                message: 'not implemented'
            })
        })
    }
}