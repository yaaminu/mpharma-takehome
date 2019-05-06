import { Client } from 'pg'
import { ErrorCodes } from '../Errors/ApplicationError';

/**
 * Provides an interface for manipulating the diagnostic_codes table. 
 * Bear in mind that it only works with postgres.
 */
export class DiagnosticCodeRepository {
    /**
     * Adds a new diagnostic code record into the database.
     * 
     * @param  client the database connection
     * @param  diagnosticCode the new diagnositc
     * 
     * @returns {number}  the id of the newly added diagnostic code
     * 
     * @throws @type {ApplicationError} containing an error code and a detailed message.
     */
    public async add(client: Client, diagnosticCode: DiagnosticCode): Promise<number> {
        try {
            let queryResults = await client.query({
                text: `INSERT INTO public.diagnostic_codes(category_name,short_desc,full_desc,icd9_code,icd10_code)
                                VALUES($1,$2,$3,$4,$5) RETURNING id`,
                values: [diagnosticCode.category_name, diagnosticCode.short_desc, diagnosticCode.full_desc, diagnosticCode.icd9_code, diagnosticCode.icd10_code]
            })
            return queryResults.rows[0].id

        } catch (err) {
            throw {
                code: this.getApplicationErrorCode(err.code),
                message: err.message,
                cause: err
            }
        }
    }

    private getApplicationErrorCode(postgresErrorCode: string) {
        switch (postgresErrorCode) {
            case '23505':
                return ErrorCodes.E_DUPLICATE
            default:
                return ErrorCodes.E_UNKNOWN;
        }
    }
}