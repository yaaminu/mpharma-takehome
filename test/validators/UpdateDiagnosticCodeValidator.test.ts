import { randomDiagnosticCode } from "../helpers";
import UpdateDiagnosticCodeValidator from "../../src/validation/UpdateDiagnosticCodeValidator";
import { ErrorCodes } from "../../src/errors/ApplicationError";


describe('UpdateDiagnosticCodeValidator', () => {
    describe('Validate', () => {
        it('valid input should not raise any exception', cb => {
            let input = randomDiagnosticCode()
            expect(() => { UpdateDiagnosticCodeValidator.validate(input) }).not.toThrow()
            cb()
        })

        it('It should allow updates with at least one field', cb => {
            expect(() => {
                UpdateDiagnosticCodeValidator.validate({
                    full_code: 'A00.333'
                })
            }).not.toThrow()

            expect(() => {
                UpdateDiagnosticCodeValidator.validate({
                    short_desc: 'Short description'
                })
            }).not.toThrow()

            expect(() => {
                UpdateDiagnosticCodeValidator.validate({
                    revision: 'ICD-9',
                    full_code: '000.32'
                })
            }).not.toThrow()


            cb()
        })

        it('should not allow input with no fields to update', cb => {
            let input = {
            }
            try {
                UpdateDiagnosticCodeValidator.validate(input)
                cb('expected an exception to be raised but none was raised')
            } catch (err) {
                expect(err.code).toBe(ErrorCodes.E_VALIDATION)
                expect(err.message).toBe('At least on field should be supplied')
                cb()
            }
        })

        it('should ensure that revision is either ICD-9 or ICD-10', cb => {
            let input = randomDiagnosticCode()
            try {
                UpdateDiagnosticCodeValidator.validate({ ...input, revision: 'bad-revision' })
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
                UpdateDiagnosticCodeValidator.validate({ ...input, revision: 'ICD-9', full_code: 'A00.223' })
                cb('Must ensure that ICD-9 codes are valid')
            } catch (err) {
                expect(err.code).toBe(ErrorCodes.E_VALIDATION)
                expect(err.message).toBe('full_code is not a valid ICD-9 code')
            }

            try {
                UpdateDiagnosticCodeValidator.validate({ ...input, revision: 'ICD-9', full_code: 'af' })
                cb('Must ensure that ICD-9 codes are valid')
            } catch (err) {
                expect(err.code).toBe(ErrorCodes.E_VALIDATION)
                expect(err.message).toBe('full_code is not a valid ICD-9 code')
            }
            cb()

            try {
                UpdateDiagnosticCodeValidator.validate({ ...input, revision: 'ICD-9', full_code: '32' })
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
                UpdateDiagnosticCodeValidator.validate({ ...input, revision: 'ICD-10', full_code: 'A00.22321' })
                cb('Must ensure that ICD-10 codes are valid')
            } catch (err) {
                expect(err.code).toBe(ErrorCodes.E_VALIDATION)
                expect(err.message).toBe('full_code is not a valid ICD-10 code')
            }

            try {
                UpdateDiagnosticCodeValidator.validate({ ...input, revision: 'ICD-10', full_code: 'af' })
                cb('Must ensure that ICD-10 codes are valid')
            } catch (err) {
                expect(err.code).toBe(ErrorCodes.E_VALIDATION)
                expect(err.message).toBe('full_code is not a valid ICD-10 code')
            }
            cb()

            try {
                UpdateDiagnosticCodeValidator.validate({ ...input, revision: 'ICD-10', full_code: '32' })
                cb('Must ensure that ICD-10 codes are valid')
            } catch (err) {
                expect(err.code).toBe(ErrorCodes.E_VALIDATION)
                expect(err.message).toBe('full_code is not a valid ICD-10 code')
            }
            cb()
        })
    })
})