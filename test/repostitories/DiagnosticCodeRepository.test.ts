import { Client } from 'pg'
import { DiagnosticCodeRepository } from '../../src/repositories/DiagnosticCodeRepository';

var client = new Client();

describe('DiagnosticCodeRepository', () => {
    beforeAll(cb => {
        client.connect().then(() => {
            cb()
        }).catch(err => {
            cb(err)
        })

    })
    describe('Add', () => {
        it('should successfully add the new diagnostic code', async (cb) => {
            let repo = new DiagnosticCodeRepository()
            try {
                await repo.add(client, {
                    categoryName: 'Category Name',
                    icd10Code: 'icd10Code',
                    icd9Code: 'icd9Code',
                    shortDescription: 'Short description',
                    fullDescription: 'full description',
                    id: -1
                })
                cb()
            } catch (err) {
                cb(err)
            }
        })
    })
})