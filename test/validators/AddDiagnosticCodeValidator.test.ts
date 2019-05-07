import { randomDiagnosticCode } from "../helpers";
import AddDiagnosticCodeValidator from '../../src/validation/AddDiagnosticCodeValidator'
import { ErrorCodes } from "../../src/errors/ApplicationError";


describe('AddDiagnosticCodeValidator', () => {

    describe('validate', () => {
        it('valid input should not raise any exception', cb => {
            let input = randomDiagnosticCode()
            expect(() => { AddDiagnosticCodeValidator.validate(input) }).not.toThrow()
            cb()
        })

        it('should ensure that full_code is not missing', cb => {
            let input = randomDiagnosticCode()
            try {
                AddDiagnosticCodeValidator.validate({ ...input, full_code: '' })
                cb('validation must fail when full_code is missing')
            } catch (err) {
                expect(err.code).toBe(ErrorCodes.E_VALIDATION)
                expect(err.message).toBe('full_code is required')
                cb()
            }
        })

        it('should ensure that category_name is not missing', cb => {
            let input = randomDiagnosticCode()
            try {
                AddDiagnosticCodeValidator.validate({ ...input, category_name: '' })
                cb('validation must fail when category_name is missing')
            } catch (err) {
                expect(err.code).toBe(ErrorCodes.E_VALIDATION)
                expect(err.message).toBe('category_name is required')
                cb()
            }
        })

        it('should ensure that full_desc is not missing', cb => {
            let input = randomDiagnosticCode()
            try {
                AddDiagnosticCodeValidator.validate({ ...input, full_desc: '' })
                cb('validation must fail when full_desc is missing')
            } catch (err) {
                expect(err.code).toBe(ErrorCodes.E_VALIDATION)
                expect(err.message).toBe('full_desc is required')
                cb()
            }
        })

        it('should ensure that short_desc is not missing', cb => {
            let input = randomDiagnosticCode()
            try {
                AddDiagnosticCodeValidator.validate({ ...input, short_desc: '' })
                cb('validation must fail when short_desc is missing')
            } catch (err) {
                expect(err.code).toBe(ErrorCodes.E_VALIDATION)
                expect(err.message).toBe('short_desc is required')
                cb()
            }
        })

        it('should ensure that revision is not missing', cb => {
            let input = randomDiagnosticCode()
            try {
                AddDiagnosticCodeValidator.validate({ ...input, revision: '' })
                cb('validation must fail when revision is missing')
            } catch (err) {
                expect(err.code).toBe(ErrorCodes.E_VALIDATION)
                expect(err.message).toBe('revision is required')
                cb()
            }
        })

        it('should ensure that revision is either ICD-9 or ICD-10', cb => {
            let input = randomDiagnosticCode()
            try {
                AddDiagnosticCodeValidator.validate({ ...input, revision: 'bad-revision' })
                cb('validation must fail when revision is neither ICD-9 nor ICD-10')
            } catch (err) {
                expect(err.code).toBe(ErrorCodes.E_VALIDATION)
                expect(err.message).toBe('revision can either be "ICD-9" or "ICD-10" but was ' + 'bad-revision')
                cb()
            }
        })

        it('When revision is ICD-9, it should ensure that full_code is a valid ICD-9 code', cb => {
            let input = randomDiagnosticCode()
            try {
                AddDiagnosticCodeValidator.validate({ ...input, revision: 'ICD-9', full_code: 'A00.223' })
                cb('Must ensure that ICD-9 codes are valid')
            } catch (err) {
                expect(err.code).toBe(ErrorCodes.E_VALIDATION)
                expect(err.message).toBe('full_code is not a valid ICD-9 code')
            }

            try {
                AddDiagnosticCodeValidator.validate({ ...input, revision: 'ICD-9', full_code: 'af' })
                cb('Must ensure that ICD-9 codes are valid')
            } catch (err) {
                expect(err.code).toBe(ErrorCodes.E_VALIDATION)
                expect(err.message).toBe('full_code is not a valid ICD-9 code')
            }
            cb()

            try {
                AddDiagnosticCodeValidator.validate({ ...input, revision: 'ICD-9', full_code: '32' })
                cb('Must ensure that ICD-9 codes are valid')
            } catch (err) {
                expect(err.code).toBe(ErrorCodes.E_VALIDATION)
                expect(err.message).toBe('full_code is not a valid ICD-9 code')
            }
            cb()
        })


        it('When revision is ICD-10, it should ensure that full_code is a valid ICD-10 code', cb => {
            let input = randomDiagnosticCode()
            try {
                AddDiagnosticCodeValidator.validate({ ...input, revision: 'ICD-10', full_code: 'A00.22321' })
                cb('Must ensure that ICD-10 codes are valid')
            } catch (err) {
                expect(err.code).toBe(ErrorCodes.E_VALIDATION)
                expect(err.message).toBe('full_code is not a valid ICD-10 code')
            }

            try {
                AddDiagnosticCodeValidator.validate({ ...input, revision: 'ICD-10', full_code: 'af' })
                cb('Must ensure that ICD-10 codes are valid')
            } catch (err) {
                expect(err.code).toBe(ErrorCodes.E_VALIDATION)
                expect(err.message).toBe('full_code is not a valid ICD-10 code')
            }
            cb()

            try {
                AddDiagnosticCodeValidator.validate({ ...input, revision: 'ICD-10', full_code: '32' })
                cb('Must ensure that ICD-10 codes are valid')
            } catch (err) {
                expect(err.code).toBe(ErrorCodes.E_VALIDATION)
                expect(err.message).toBe('full_code is not a valid ICD-10 code')
            }
            cb()
        })
    })
})