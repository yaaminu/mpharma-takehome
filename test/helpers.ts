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


export async function bulkInsertDiagnosticCodes(client: DbHelper, count: number): Promise<AddDiagnosticCodeDTO[]> {
    let bulkData: AddDiagnosticCodeDTO[] = []

    while (count-- > 0) {
        let diagnosticCode = {
            category_name: 'category name' + count, short_desc: 'short desc ' + count, full_desc: 'full description of the drug' + count,
            icd9_code: '001.0_' + count, icd10_code: 'A001.0_' + count
        }
        bulkData.push(diagnosticCode)
        await client.query({
            text: `INSERT INTO public.diagnostic_codes(category_name,short_desc,full_desc,icd9_code,icd10_code)
                        VALUES($1,$2,$3,$4,$5) RETURNING id`,
            values: [diagnosticCode.category_name, diagnosticCode.short_desc, diagnosticCode.full_desc, diagnosticCode.icd9_code, diagnosticCode.icd10_code]
        })
    }
    return bulkData

}