import { Batch } from "../academic/batches.model";
import { Program } from "../academic/programs.model";

Program.hasMany(Batch, {
    foreignKey: "program_id",
    as: "batches",
});

Batch.belongsTo(Program, {
    foreignKey: "program_id",
    as: "program",
});
