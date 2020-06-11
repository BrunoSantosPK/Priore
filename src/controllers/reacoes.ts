// Tipagem do express
import { Request, Response } from "express";

// Classes de manipulação
import Substancia from "../core/Substancia";
import ReacaoQuimica from "../core/ReacaoQuimica";

// Classes de manipulação
import Send from "../utils/Send";

// Tipagem do body
type BodySimpleReaction = {
    produtos: { formula: string, coeficiente: number, nome: string }[],
    reagentes: { formula: string, coeficiente: number, nome: string }[]
}

export default class ControllerReacoes {

    validarBalanceamento(request: Request, response: Response) {
        // Recupera informações enviadas
        const { reagentes, produtos }: BodySimpleReaction = request.body;

        // Inicia as classes de manipulação
        const res = new Send();

        // Define a reação química, por meio dos reagentes e produtos informados
        const reacao = new ReacaoQuimica();
        reagentes.forEach(reg => {
            let substancia = new Substancia(reg.formula, reg.nome);
            reacao.setReagente({ substancia, coeficiente: reg.coeficiente });
        });
        produtos.forEach(prod => {
            let substancia = new Substancia(prod.formula, prod.nome);
            reacao.setProduto({ substancia, coeficiente: prod.coeficiente });
        });

        // Verifica o balanceamento
        reacao.balancear();
        if(reacao.getErro()) {
            response.status(400);
            res.message(reacao.getMessage());
        } else {
            res.status(200);
            res.message("A equação está balanceada.");
        }

        return response.json(res.get());
    }

    // TODO: Rota em teste
    balancear(request: Request, response: Response) {
        /*console.log("Rota em teste");
        const h2 = new Substancia("H2", "Gás Hidrogênio");
        const o2 = new Substancia("O2", "Gás Oxigênio");
        const h2o = new Substancia("H2O", "Água");
        
        const reacao = new ReacaoQuimica();
        reacao.setReagente({ substancia: h2, coeficiente: 2, molInicial: 1 });
        reacao.setReagente({ substancia: o2, coeficiente: 1, molInicial: 5 });
        reacao.setProduto({ substancia: h2o, coeficiente: 2 });

        // Faz uma conversão
        const conversao = 0.5;
        reacao.setConversao(conversao)
        const sistema = reacao.reagir();

        return response.json({
            sistema
        });*/
    }

}