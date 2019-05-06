import { ErrorCodes, ApplicationError } from '../Errors/ApplicationError';
import { DbHelper } from '../db';

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
    public async add(client: DbHelper, diagnosticCode: DiagnosticCode): Promise<number> {
        try {
            let queryResults = await client.query({
                text: `INSERT INTO public.diagnostic_codes(category_name,short_desc,full_desc,icd9_code,icd10_code)
                                VALUES($1,$2,$3,$4,$5) RETURNING id`,
                values: [diagnosticCode.category_name, diagnosticCode.short_desc, diagnosticCode.full_desc, diagnosticCode.icd9_code, diagnosticCode.icd10_code]
            })
            return queryResults.rows[0].id

        } catch (err) { //do nothing, just repackage the error and propagate it
            throw new ApplicationError(
                this.getApplicationErrorCode(err.code),
                err.message,
                err
            )
        }
    }

    /**
     * Given an id, update a particular record that matches this id with the data provided, there's no restriction 
     * on the updatable columns except the id. 
     * @param {DbHelper} client the database client
     * @param {number} id the id of the record to be updated
     * @param {any} data the new update
     * 
     * @returns {Promise<DiagnosticCode>} the udpated record
     */
    public async update(client: DbHelper, id: number, data: any): Promise<DiagnosticCode> {
        try {

            //update the record, we give priority to the newly supplied data from the outside 
            //falling back to the already existing record 
            let queryResults = await client.query({
                text: `
                        WITH to_update AS(
                            SELECT * from public.diagnostic_codes WHERE public.diagnostic_codes.id=$6
                        )
                        UPDATE public.diagnostic_codes SET category_name=COALESCE($1,to_update.category_name),
                                short_desc=COALESCE($2,to_update.short_desc),
                                full_desc=COALESCE($3,to_update.full_desc),
                                icd9_code=COALESCE($4,to_update.icd9_code),
                                icd10_code=COALESCE($5,to_update.icd10_code)
                                FROM to_update
                                WHERE public.diagnostic_codes.id=$6 
                                RETURNING public.diagnostic_codes.*
                    `,
                values: [data.category_name, data.short_desc, data.full_desc, data.icd9_code, data.icd10_code, id]
            })


            if (queryResults.rowCount === 0) {
                throw new ApplicationError(ErrorCodes.E_NOT_FOUND, 'No such object with id ' + id)
            }
            return queryResults.rows[0]
        } catch (err) {
            if (err instanceof ApplicationError) throw err
            throw new ApplicationError(this.getApplicationErrorCode(err.code), err.message, err)
        }
    }

    /**
     * Retrieve a record by id 
     * @param client the database client
     * @param id the id of the record to be retrieved
     */
    public async findById(client: DbHelper, id: number): Promise<DiagnosticCode> {
        try {
            let queryResults = await client.query({
                text: 'SELECT * from public.diagnostic_codes WHERE id=$1',
                values: [id]
            })
            if (queryResults.rowCount === 0) {
                return Promise.reject(new ApplicationError(ErrorCodes.E_NOT_FOUND, 'No such record found'))
            }
            return queryResults.rows[0]
        } catch (err) {
            return Promise.reject(new ApplicationError(this.getApplicationErrorCode(err.code), err.message, err))
        }

    }
    /**
     * Given an id, remove the record whose id corresponds to that id form the database returning 
     * the id if the deletion was successful or an error if no such record exists 
     * @param {DbHelper} client the databse client
     * @param  {number} id the id of the object to be removed
     * @returns {Promise<number>} the id of the deleted record or an error if no such record exists
     */
    public async remove(client: DbHelper, id: number): Promise<any> {

        try {
            let queryResults = await client.query({
                text: 'DELETE FROM public.diagnostic_codes WHERE id=$1 RETURNING id',
                values: [id]
            })
            if (queryResults.rowCount === 0) return Promise.reject(new ApplicationError(ErrorCodes.E_NOT_FOUND, 'No record found'))
            return Promise.resolve(queryResults.rows[0].id)
        } catch (err) {
            return Promise.reject(new ApplicationError(this.getApplicationErrorCode(err.code), err.message, err))
        }

    }





    /**
     * @param postgresErrorCode maps a postgres error code to our application specific error codes
     */
    private getApplicationErrorCode(postgresErrorCode: string) {
        switch (postgresErrorCode) {
            case '23505':
                return ErrorCodes.E_DUPLICATE
            default:
                return ErrorCodes.E_UNKNOWN;
        }
    }
}