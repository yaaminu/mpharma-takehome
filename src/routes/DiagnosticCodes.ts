import { Router } from 'express'
import { DbHelper } from '../db';
import { DiagnosticCodeRepository } from '../repositories/DiagnosticCodeRepository';




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
        this.router.post('/diagnostic_codes', async (req, res, next) => {
            // let newDiagnosticCode = req.body
            //TODO validate

            //notice we don't handle errors here, 
            // let newlyAddedDiagCodeId = await self.diagnosticCodesRepo.add(self.client, newDiagnosticCode)
            res.status(201).json({
                id: 8,
                status: 201,
                message: 'Success'
            })
        })

    }


    public getRouter(): Router {
        return this.router
    }
}