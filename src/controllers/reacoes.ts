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

}