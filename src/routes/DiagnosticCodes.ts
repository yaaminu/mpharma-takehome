import { Router } from 'express'
import { DbHelper } from '../db';
import { DiagnosticCodeRepository } from '../repositories/DiagnosticCodeRepository';
import AddDiagnosticCodeValidator from '../validation/AddDiagnosticCodeValidator';
import UpdateDiagnosticCodeValidator from '../validation/UpdateDiagnosticCodeValidator';
import ListDiagnosticRecordsValidator from '../validation/ListDiagnosticRecordsValidator';




export default class DiagnosticCodesRouter {
    private readonly client: DbHelper
    private readonly router: Router
    private readonly diagnosticCodesRepo: DiagnosticCodeRepository

    constructor(client: DbHelper) {
        this.client = client
        this.router = Router()
        this.diagnosticCodesRepo = new DiagnosticCodeRepository()
        this.mountRoutes()
    }

    private mountRoutes() {
        let self = this
        this.router.post('/', async (req, res, next) => {
            try {
                let newDiagnosticCode: AddDiagnosticCodeDTO = {
                    category_name: req.body.category_name || '',
                    full_desc: req.body.full_desc || '',
                    short_desc: req.body.short_desc || '',
                    icd9_code: req.body.icd9_code || '',
                    icd10_code: req.body.icd10_code || ''
                }

                AddDiagnosticCodeValidator.validate(newDiagnosticCode) //might throw

                //notice we don't handle errors here, 
                let newlyAddedDiagCodeId = await self.diagnosticCodesRepo.add(self.client, newDiagnosticCode)
                res.status(201).json({
                    id: newlyAddedDiagCodeId,
                    status: 201,
                    message: 'Success'
                })
            } catch (err) {
                next(err)
            }
        })

        
        this.router.get('/', async (req, res, next) => {
            try {
                let listQuery = {
                    limit: req.query.limit || 20,
                    page: req.query.page || 1
                }

                ListDiagnosticRecordsValidator.validate(listQuery)
                let listResults = await self.diagnosticCodesRepo.list(self.client, listQuery)
                return res.status(200).json(listResults)
            } catch (err) {
                return next(err)
            }
        })

        this.router.get('/:id', async (req, res, next) => {
            try {
                let diagnosticCode = await self.diagnosticCodesRepo.findById(self.client, req.params.id)
                return res.status(200).json(diagnosticCode)
            } catch (err) {
                return next(err)
            }
        })

        this.router.put('/:id', async (req, res, next) => {
            try {
                let update = {
                    category_name: req.body.category_name,
                    full_desc: req.body.full_desc,
                    short_desc: req.body.short_desc,
                    icd9_code: req.body.icd9_code,
                    icd10_code: req.body.icd10_code
                }

                UpdateDiagnosticCodeValidator.validate(update) //might throw
                let updateRecord = await self.diagnosticCodesRepo.update(self.client, req.params.id, update)
                return res.status(200).json(updateRecord)
            } catch (err) {
                return next(err)
            }
        })

        this.router.delete('/:id', async (req, res, next) => {
            try {
                let deletedItemId = await self.diagnosticCodesRepo.remove(self.client, req.params.id)
                return res.status(200).json({
                    message: 'Deleted successfully',
                    id: deletedItemId
                })
            } catch (err) {
                return next(err)
            }
        })


    }


    public getRouter(): Router {
        return this.router
    }
}