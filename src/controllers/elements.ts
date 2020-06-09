// Tipagem do express
import { Request, Response } from "express";

// Classes de manipulação
import TabelaPeriodica from "../core/TabelaPeriodica";
import Substancia from "../core/Substancia";

// Classes de manipulação
import Send from "../utils/Send";

export default class ControllerElementos {

    get(request: Request, response: Response) {
        // Verifica se algum parâmetro de filtro foi passado
        const { filter = "all" } = request.query;
        const send = new Send();

        if(filter == "all") {
            send.message("Busca de todos os elementos cadastrados.");
            send.status(200);
            send.data(TabelaPeriodica.getAll());
        } else {
            const elemento = TabelaPeriodica.get(filter.toString());
            if(elemento == undefined) {
                send.message("O elemento informado não existe.");
                response.status(400);
            } else {
                send.message(`Dados encontrados para o elemento ${filter}`);
                send.status(200);
                send.one(elemento);
            }
        }
        
        return response.json(send.get());
    }

    massaMolar(request: Request, response: Response) {
        // Recupera informações da rota
        const { formula = "" } = request.params;
        const send = new Send();

        if(formula == "") {
            send.message("É preciso enviar uma fórmula química para análise.");
            response.status(400);
        } else {
            const subs = new Substancia(formula, "Teste");
            if(subs.getErro()) {
                send.message(subs.getMessage());
                response.status(400);
            } else {
                send.status(200);
                send.one({
                    formula, massaMolar: subs.getMassaMolar(), composicao: subs.getComposicao()
                });
            }
        }

        return response.json(send.get());
    }

}