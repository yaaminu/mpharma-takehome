import { Client } from 'pg'
import { DiagnosticCodeRepository } from '../../src/repositories/DiagnosticCodeRepository';
import { randomDiagnosticCode } from '../helpers';
import { ErrorCodes } from '../../src/Errors/ApplicationError';


const client = new Client();
const repo = new DiagnosticCodeRepository()


describe('DiagnosticCodeRepository', () => {
    beforeAll(async cb => {
        await client.connect()
        cb()
    })
    afterAll(async cb => {
        client.end()
    })


    beforeEach(async () => {
        await client.query('BEGIN')
    })
    afterEach(async () => {
        await client.query('ROLLBACK')
    })


    describe('Add', () => {

        it('should successfully add the new diagnostic code', async (cb) => {
            let testDiagnosticCode = randomDiagnosticCode()
            try {
                let id = await repo.add(client, testDiagnosticCode)
                expect(id).toBeGreaterThan(0)

                //check that the object was actually inserted into the db
                let queryResults = await client.query(`SELECT * from public.diagnostic_codes WHERE id = ${id}`)
                expect(queryResults.rowCount).toBe(1)
                expect(queryResults.rows[0]).toMatchObject({ ...testDiagnosticCode, id: id })
                cb()
            } catch (err) {
                cb(err)
            }
        })

        it('should return error when a duplicate rocorded is added', async cb => {
            //we don't handle validation errors at the repository level but we 
            //expect the repository to handle database errors that could not be caught at validation
            // like duplicate entries and the return appropriate error . 

            let testDiagnosticCode = randomDiagnosticCode()
            let id = await repo.add(client, testDiagnosticCode)
            expect(id).toBeGreaterThan(0)
            let queryResults = await client.query(`SELECT * from public.diagnostic_codes WHERE id = ${id}`)
            expect(queryResults.rows[0]).toMatchObject({ ...testDiagnosticCode, id: id })

            try {
                await repo.add(client, testDiagnosticCode)
                cb('Should throw when a duplicate record is inserted')
            } catch (err) {
                expect(err.code).toBe(ErrorCodes.E_DUPLICATE)
                expect(err.cause).not.toBeNull()
                cb()
            }
        })
    })
})