CREATE TABLE public.diagnostic_codes(
    id serial PRIMARY KEY,
    category_name text NOT NULL,
    full_code text UNIQUE NOT NULL,
    revision text NOT NULL,
    short_desc text NOT NULL,
    full_desc text NOT NULL

    CONSTRAINT revision_must_either_be_ICD_9_or_ICD_10  CHECK(revision = ANY(ARRAY['ICD-9','ICD-10']))
    CONSTRAINT full_code_length CHECK(length(full_code) >= 3 AND length(full_code) <= 8) -- accomodate the period
);

