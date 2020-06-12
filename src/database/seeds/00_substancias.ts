import Knex from "knex";

export async function seed(knex: Knex) {
    await knex("substancias").insert([
        { formula_quimica: "H2O", nome: "Água" },
        { formula_quimica: "C2H5OH", nome: "Etanol" },
        { formula_quimica: "C4H10", nome: "n-Butano" },
        { formula_quimica: "CH3OH", nome: "Metanol" },
        { formula_quimica: "C4H10", nome: "Isobutano" },
        { formula_quimica: "C6H6", nome: "Benzeno" },
        { formula_quimica: "C7H8", nome: "Tolueno" },
        { formula_quimica: "C8H10", nome: "Etilbenzeno" },
        { formula_quimica: "C3H6O", nome: "Acetona" },
        { formula_quimica: "C2H6O", nome: "Éter Dimetílico" },
        { formula_quimica: "(C2H5)2O", nome: "Éter Dietílico" },
        { formula_quimica: "(CH3)2NH", nome: "Dimetilamina" },
        { formula_quimica: "C4H11N", nome: "Dietilamina" },
        { formula_quimica: "C2H3N", nome: "Acetonitrila" },
        { formula_quimica: "C7H16", nome: "n-Heptano" },
        { formula_quimica: "C3H6O2", nome: "Acetato de Metila" }
    ]);
}