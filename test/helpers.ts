import { DbHelper } from "../src/db";

export function randomDiagnosticCode(): AddDiagnosticCodeDTO {
    //TODO use a real world diagnostic code source.
    return {
        category_name: 'Category Name',
        full_code: '000.20',
        revision: 'ICD-9',
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
            category_name: 'category name' + count, short_desc: 'short desc ' + count, full_desc: 'full description of the diagnosis' + count,
            revision: count % 2 === 0 ? 'ICD-9' : 'ICD-10', full_code: 'A001.0' + count
        }
        bulkData.push(diagnosticCode)
        await client.query({
            text: `INSERT INTO public.diagnostic_codes(category_name,short_desc,full_desc,full_code,revision)
                        VALUES($1,$2,$3,$4,$5) RETURNING id`,
            values: [diagnosticCode.category_name, diagnosticCode.short_desc, diagnosticCode.full_desc, diagnosticCode.full_code, diagnosticCode.revision]
        })
    }
    return bulkData

}