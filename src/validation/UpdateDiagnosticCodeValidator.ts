import { isEmpty } from 'validator'
import { ValidationError } from '../Errors/ValidationError';

/**
 * Checks that the input is valid throwing a validation error if that's 
 * not the case 
 * @param input the input
 */
export default {
    validate: function validate(input: UpdateDiagnosticCodeDTO) {
        if (isEmpty(input.category_name || '', { ignore_whitespace: true }) &&
            isEmpty(input.full_desc || '', { ignore_whitespace: true }) &&
            isEmpty(input.short_desc || '', { ignore_whitespace: true }) &&
            isEmpty(input.icd9_code || '', { ignore_whitespace: true }) &&
            isEmpty(input.icd10_code || '', { ignore_whitespace: true })) {
                
            throw new ValidationError('At least on field should be supplied')
        }
    }
}