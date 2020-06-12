import Knex from "knex";

export async function up(knex: Knex) {
    return knex.schema.createTable("substancias", table => {
        table.increments("id_substancia").primary();
        table.string("formula_quimica").notNullable();
        table.string("nome").notNullable();
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable("substancias");
}