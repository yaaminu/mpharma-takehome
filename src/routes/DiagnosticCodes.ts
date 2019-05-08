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
                    full_code: req.body.full_code || '',
                    revision: req.body.revision || ''
                }

                AddDiagnosticCodeValidator.validate(newDiagnosticCode) //might throw

                //notice we don't handle errors here, 
                let newlyAddedDiagCodeId = await self.diagnosticCodesRepo.add(self.client, newDiagnosticCode)
                res.status(201).json({
                    value: newlyAddedDiagCodeId,
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
                return res.status(200).json({ ...listResults, status: 200, message: 'success' })
            } catch (err) {
                return next(err)
            }
        })

        this.router.get('/:id', async (req, res, next) => {
            try {
                let diagnosticCode = await self.diagnosticCodesRepo.findById(self.client, req.params.id)
                return res.status(200).json({ value: diagnosticCode, status: 200, message: 'success' })
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
                    full_code: req.body.full_code,
                    revision: req.body.revision
                }

                UpdateDiagnosticCodeValidator.validate(update) //might throw
                let updateRecord = await self.diagnosticCodesRepo.update(self.client, req.params.id, update)
                return res.status(200).json({
                    status: 200,
                    value: updateRecord,
                    message: 'success'
                })
            } catch (err) {
                return next(err)
            }
        })

        this.router.delete('/:id', async (req, res, next) => {
            try {
                let deletedItemId = await self.diagnosticCodesRepo.remove(self.client, req.params.id)
                return res.status(200).json({
                    message: 'success',
                    value: deletedItemId,
                    status: 200
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