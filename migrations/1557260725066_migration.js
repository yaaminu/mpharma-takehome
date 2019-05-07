exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable("diagnostic_codes", {
        id: "id",
        category_name: { type: "text", notNull: true },
        full_code: { type: "text", notNull: true, unique: true },
        revision: { type: "text", notNull: true },
        short_desc: { type: "text", notNull: true },
        full_desc: { type: "text", notNull: true }
    })

    pgm.addConstraint("diagnostic_codes",
        "revision_must_either_be_ICD_9_or_ICD_10",
        "CHECK(revision = ANY(ARRAY['ICD-9','ICD-10']))")

    pgm.addConstraint("diagnostic_codes",
        "full_code_length",
        //accomodate the period
        "CHECK(length(full_code) >= 3 AND length(full_code) <= 8)")
};

exports.down = (pgm) => {
    pgm.dropTable("diagnostic_codes")
};
