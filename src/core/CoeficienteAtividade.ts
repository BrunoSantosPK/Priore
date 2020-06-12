// Importações gerais
import Substancia from "./Substancia";

// Definição de tipos
type Sistema = {
    substancia: Substancia,
    fracao: number
};

// Estrutura da classe
export default class CoeficienteAtividade {

    modelo = "";

    constructor(modelo: "unifac") {
        this.modelo = modelo;
    }

}

// Estrutura da classe que executa os cálculos para o modelo unifac
export class UNIFAC {

    sistema: Sistema[] = [];
    paramentroR = [0.9011, 0.6744, 0.4469, 0.2195, 0.5313, 1.2663, 1.0396, 1, 0.92, 1.6724, 1.4457, 1.145, 0.9183, 0.6908, 1.4337, 1.207, 0.9795, 1.8701, 1.6434];
    parametroQ = [0.848, 0.54, 0.228, 0, 0.4, 0.968, 0.66, 1.2, 1.4, 1.488, 1.18, 1.088, 0.78, 0.468, 1.244, 0.936, 0.624, 1.724, 1.416];

}