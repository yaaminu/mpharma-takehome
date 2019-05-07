import { DiagnosticCodeRepository } from '../../src/repositories/DiagnosticCodeRepository';
import { randomDiagnosticCode, find, bulkInsertDiagnosticCodes } from '../helpers';
import { ErrorCodes } from '../../src/errors/ApplicationError';
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

    describe('FindById', () => {
        it('should retrieve a record if it exists', async cb => {
            let diagnosticCode = randomDiagnosticCode()
            let queryResults = await client.query({
                text: `INSERT INTO public.diagnostic_codes(category_name,short_desc,full_desc,full_code,revision)
                                VALUES($1,$2,$3,$4,$5) RETURNING id`,
                values: [diagnosticCode.category_name, diagnosticCode.short_desc, diagnosticCode.full_desc, diagnosticCode.full_code, diagnosticCode.revision]
            })
            let id = queryResults.rows[0].id
            expect(id).toBeGreaterThan(0)

            //check that we it's actually able to retrieve the record
            let retrievedDiagnosticCode = await repo.findById(client, id)
            expect(retrievedDiagnosticCode).not.toBeNull()
            expect(retrievedDiagnosticCode).toMatchObject({ ...diagnosticCode, id: id })
            cb()
        })

        it('should return a not found error code when no matching record is found', async cb => {
            try {

                let not_exisiting_id = -37383
                //assert that it actually does not exist
                let notExisiting = await find(client, `SELECT * from diagnostic_codes WHERE id=${not_exisiting_id}`)
                expect(notExisiting).toBeUndefined() //assert that it's not in the database

                await repo.findById(client, not_exisiting_id) //attempt to retreive that non existent record
                cb('should throw')
            } catch (err) {
                expect(err.code).toBe(ErrorCodes.E_NOT_FOUND)
                cb()
            }
        })

    })

    describe('Delete', () => {
        it('should delete the record if it exists in the system', async cb => {
            let diagnosticCode = randomDiagnosticCode()

            let queryResults = await client.query({
                text: `INSERT INTO public.diagnostic_codes(category_name,short_desc,full_desc,full_code,revision)
                                VALUES($1,$2,$3,$4,$5) RETURNING id`,
                values: [diagnosticCode.category_name, diagnosticCode.short_desc, diagnosticCode.full_desc, diagnosticCode.full_code, diagnosticCode.revision]
            })
            expect(queryResults.rowCount > 0)
            expect(queryResults.rows[0].id).toBeGreaterThan(0)

            let deletedRecordId = await repo.remove(client, queryResults.rows[0].id)

            expect(deletedRecordId).toBe(queryResults.rows[0].id)

            //check that it was actually removed from the database
            queryResults = await client.query({
                text: `SELECT id from public.diagnostic_codes where id = ${deletedRecordId}`
            })
            expect(queryResults.rowCount).toBe(0)
            cb()
        })

        it('When no record exists with the provided id, it should return an E_NOT_FOUND error code', async cb => {
            try {

                let not_exisiting_id = -822
                //assert that it actually does not exist
                let notExisiting = await find(client, `SELECT * from diagnostic_codes WHERE id=${not_exisiting_id}`)
                expect(notExisiting).toBeUndefined() //assert that it's not in the database

                await repo.remove(client, not_exisiting_id) //attempt to retreive that non existent record
                cb('should throw')
            } catch (err) {
                expect(err.code).toBe(ErrorCodes.E_NOT_FOUND)
                cb()
            }
        })
    })

    describe('list', () => {

        it('Given a limit and a page number, it should be able to list items in batches of that limit #1', async cb => {

            let count = (await client.query('SELECT count(1) from diagnostic_codes')).rows[0].count
            expect(count).toBe("0")

            await bulkInsertDiagnosticCodes(client, 100); //inserts fake 100 diagnostic codes

            //ensure that we have actually 100 entries
            count = (await client.query('SELECT count(1) from diagnostic_codes')).rows[0].count
            expect(count).toBe("100")

            let i = 0
            while (++i <= 5) {
                let listQuery = {
                    limit: 20,
                    page: i
                }
                let diagnosticCodesResponse = await repo.list(client, listQuery)
                expect(diagnosticCodesResponse.limit).toBe(20)
                expect(diagnosticCodesResponse.page).toBe(i)
                expect(diagnosticCodesResponse.values.length).toBe(20)
            }
            cb()
        })


        it('Given a limit and a page number, it should be able to list items in batches of that limit #2', async cb => {

            let count = (await client.query('SELECT count(1) from diagnostic_codes')).rows[0].count
            expect(count).toBe("0")

            await bulkInsertDiagnosticCodes(client, 100); //inserts fake 100 diagnostic codes

            //ensure that we have actually 100 entries
            count = (await client.query('SELECT count(1) from diagnostic_codes')).rows[0].count
            expect(count).toBe("100")

            let i = 0
            while (++i <= 25) {
                let listQuery = {
                    limit: 4,
                    page: i
                }
                let diagnosticCodesResponse = await repo.list(client, listQuery)
                expect(diagnosticCodesResponse.limit).toBe(4)
                expect(diagnosticCodesResponse.page).toBe(i)
                expect(diagnosticCodesResponse.values.length).toBe(4)
            }
            cb()
        })


        it('Should return an empty results when page number exceeds available data', async cb => {

            let count = (await client.query('SELECT count(1) from diagnostic_codes')).rows[0].count
            expect(count).toBe("0")

            await bulkInsertDiagnosticCodes(client, 5); //inserts fake 5 diagnostic codes

            //ensure that we have actually 5 entries 
            count = (await client.query('SELECT count(1) from public.diagnostic_codes')).rows[0].count
            expect(count).toBe("5")

            let results = await repo.list(client, { limit: 20, page: 2 })
            expect(results.limit).toBe(20)
            expect(results.page).toBe(2)
            expect(results.values.length).toBe(0)


            results = await repo.list(client, { limit: 5, page: 2 })
            expect(results.limit).toBe(5)
            expect(results.page).toBe(2)
            expect(results.values.length).toBe(0)
            cb()
        })

        it('should return the total number of pages', async cb => {
            let count = (await client.query('SELECT count(1) from diagnostic_codes')).rows[0].count
            expect(count).toBe("0")

            await bulkInsertDiagnosticCodes(client, 27); //inserts fake 27 diagnostic codes

            //ensure that we have actually 27 entries 
            count = (await client.query('SELECT count(1) from public.diagnostic_codes')).rows[0].count
            expect(count).toBe("27")

            let results = await repo.list(client, { limit: 5, page: 1 })
            expect(results.limit).toBe(5)
            expect(results.page).toBe(1)
            expect(results.values.length).toBe(5)
            expect(results.totalPageCount).toBe(6)
            cb()

            // cb('fail')
        })
    })
})