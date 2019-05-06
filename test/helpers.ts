import { DbHelper } from "../src/db";

export function randomDiagnosticCode(): DiagnosticCode {

    //TODO use a real world diagnostic code source.
    return {
        category_name: 'Category Name',
        icd10_code: 'icd10Code',
        icd9_code: 'icd9Code',
        short_desc: 'Short description',
        full_desc: 'full description'
    }
}


export async function find(client: DbHelper, query: any): Promise<any> {
    try {
        let result = await client.query(query)
        return result.rows[0]
    } catch (err) {
        return null
    }
}