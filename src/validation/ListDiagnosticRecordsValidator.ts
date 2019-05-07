
import { ValidationError } from '../errors/ValidationError';


export default {
    /**
     *Given an input assert that it has valid properties  or throw a validation error
     * @param input the input to validate
     */
    validate: function (input: ListQueryDTO) {
        if (isNaN(input.limit)) {
            throw new ValidationError('limit must be a number')
        }
        if (input.limit <= 0) {
            throw new ValidationError('limit must be >= 1')
        }

        if (isNaN(input.page)) {
            throw new ValidationError('page  must be a number')
        }

        if (input.page <= 0) {
            throw new ValidationError('page must be >= 1')
        }
    }
}
