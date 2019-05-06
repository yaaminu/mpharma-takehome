interface DiagnosticCode {
    readonly id: number,
    readonly categoryName: string,
    readonly shortDescription: string,
    readonly fullDescription: string,
    readonly icd9Code: string,
    readonly icd10Code: string
}

