import { DiagnosticCodeRepository } from '../../src/repositories/DiagnosticCodeRepository';
import { randomDiagnosticCode, find } from '../helpers';
import { ErrorCodes } from '../../src/Errors/ApplicationError';
import { DbHelper } from '../../src/db';


const client = new DbHelper()
const repo = new DiagnosticCodeRepository()


describe('DiagnosticCodeRepository', () => {

    beforeAll(async cb => {
        await client.connect()
        cb()
    })

    afterAll(async cb => {
        client.disconnect()
    })

    //Since we don't want to keep data inserted into the db, we just wrap each 
    //test case a transcation that we deliberately rollback. This effectively throws 
    //any changes made to the db during testing.

    beforeEach(async () => {

        await client.beginTransaction()
    })
    afterEach(async () => {
        await client.rollbackTransaction()
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

    describe('Edit', () => {
        it('should update an exisiting record', async cb => {

            //first add the record to be updated
            let tmp = randomDiagnosticCode()
            let newDigCodeId = await repo.add(client, tmp);

            //ensure that it was actually added to the database
            let newDiagnosticCode = await find(client, `SELECT * from public.diagnostic_codes WHERE id=${newDigCodeId}`)

            expect(newDiagnosticCode).toMatchObject({
                ...tmp, id: newDigCodeId
            })

            //define the updte structure, for surity we could add as many fields as is possible with different combinations. 
            //I'm only updationg two fields because but I'm not that paranoid :-)
            let diagnosticCodeUpdate = {
                ...newDiagnosticCode,
                category_name: 'updated category name',
                short_desc: 'Newly updted short discription'
            }

            let updatedDiagnosticCode = await repo.update(client, newDigCodeId, diagnosticCodeUpdate)
            expect(updatedDiagnosticCode).toMatchObject(diagnosticCodeUpdate)
            cb()
        })
        it('When target object does not exist it should return an error code: E_NOT_FOUND', async cb => {
            try {

                let not_exisiting_id = -33
                //assert that it actually does not exist
                let notExisiting = await find(client, `SELECT * from diagnostic_codes WHERE id=${not_exisiting_id}`)
                expect(notExisiting).toBeUndefined() //assert that it's not in the database

                await repo.update(client, not_exisiting_id, {}) //attempt to update that non existent record
                cb('should throw')
            } catch (err) {
                expect(err.code).toBe(ErrorCodes.E_NOT_FOUND)
                cb()
            }
        })
    })
})