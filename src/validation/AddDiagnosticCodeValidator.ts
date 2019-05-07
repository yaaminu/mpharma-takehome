import { isEmpty } from 'validator'
import { ValidationError } from '../errors/ValidationError';

/**
 * Checks that the input is valid throwing a validation error if that's 
 * not the case 
 * @param input the input
 */
export default {
    validate: function validate(input: AddDiagnosticCodeDTO) {
        if (isEmpty(input.category_name, { ignore_whitespace: true })) {
            throw new ValidationError('category_name is required')
        }
        if (isEmpty(input.full_desc, { ignore_whitespace: true })) {
            throw new ValidationError('full_desc is required')
        }

        if (isEmpty(input.short_desc, { ignore_whitespace: true })) {
            throw new ValidationError('short_desc is required')
        }

        if (isEmpty(input.full_code, { ignore_whitespace: true })) {
            throw new ValidationError('full_code is required')
        }

        if (isEmpty(input.revision, { ignore_whitespace: true })) {
            throw new ValidationError('revision is required')
        }

        if (['ICD-9', 'ICD-10'].indexOf(input.revision!!) === -1) {
            throw new ValidationError('revision can either be "ICD-9" or "ICD-10" but was ' + input.revision)
        }

        if (input.revision === 'ICD-9') {
            if (input.full_code.length < 3 || input.full_code.replace('.', '').length > 5) {
                throw new ValidationError('full_code is not a valid ICD-9 code')
            }
        }

        if (input.revision === 'ICD-10') {
            if (input.full_code.length < 3 || input.full_code.replace('.', '').length > 7) {
                throw new ValidationError('full_code is not a valid ICD-10 code')
            }
        }
    }
}