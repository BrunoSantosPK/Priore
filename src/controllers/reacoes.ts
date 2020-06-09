// Tipagem do express
import { Request, Response } from "express";

// Classes de manipulação
import Substancia from "../core/Substancia";
import ReacaoQuimica from "../core/ReacaoQuimica";

// Classes de manipulação
import Send from "../utils/Send";

export default class ControllerReacoes {

    // TODO: Rota em teste
    balancear(request: Request, response: Response) {
        console.log("Rota em teste");
        /*const h2 = new Substancia("H2", "Gás Hidrogênio");
        const o2 = new Substancia("O2", "Gás Oxigênio");
        const h2o = new Substancia("H2O", "Água");
        
        const reacao = new ReacaoQuimica();
        reacao.setReagente({ substancia: h2, coeficiente: 2, molInicial: 15 });
        reacao.setReagente({ substancia: o2, coeficiente: 1, molInicial: 5 });
        reacao.setProduto({ substancia: h2o, coeficiente: 2 });
        reacao.montar();
        console.log("O reagente limitante é: ", reacao.reagentes[reacao.definirLimitante()].substancia.nome);*/

        return response.json({});
    }

}