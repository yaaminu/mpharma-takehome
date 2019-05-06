CREATE TABLE public.diagnostic_codes(
    id serial PRIMARY KEY,
    category_name text NOT NULL,
    icd9_code text UNIQUE NOT NULL,
    icd10_code text UNIQUE NOT NULL, 
    short_desc text NOT NULL,
    full_desc text NOT NULL
);