import { isEmpty } from 'validator'
import { ValidationError } from '../Errors/ValidationError';

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

        if (isEmpty(input.icd9_code, { ignore_whitespace: true })) {
            throw new ValidationError('icd9_code is required')
        }

        if (isEmpty(input.icd10_code, { ignore_whitespace: true })) {
            throw new ValidationError('icd10_code is required')
        }
    }
}