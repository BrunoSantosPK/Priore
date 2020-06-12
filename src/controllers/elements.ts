// Tipagem do express
import { Request, Response } from "express";

// Classes de manipulação
import TabelaPeriodica from "../core/TabelaPeriodica";
import Substancia from "../core/Substancia";

// Classes de manipulação
import Send from "../utils/Send";

// Conexão com o banco de dados
import conectar from "../database/conectar";

export default class ControllerElementos {

    async substanciasCadastradas(request: Request, response: Response) {
        // Verifica se algum parâmetro de filtro foi passado
        const { filter = "all" } = request.query;
        const envio = new Send();
        const knex = conectar();

        let dados, msg;
        try {
            if(filter == "all") {
                msg = "Busca por todos os cadastros.";
                dados = await knex("substancias").select("*");
            } else {
                msg = `Busca realizada para ${filter}.`
                dados = await knex("substancias").select("*").where({
                    nome: filter
                }).orWhere({ formula_quimica: filter });
            }
    
            // Percorre a lista de respostas e cria uma instância da substância
            const res: {}[] = [];
            dados.forEach(subs => {
                let substancia = new Substancia(subs.formula_quimica, subs.nome);
                res.push({
                    id: subs.id_substancia,
                    nome: subs.nome,
                    formula: subs.formula_quimica,
                    massaMolar: substancia.getMassaMolar(),
                    composicao: substancia.getComposicao()
                });
            });

            // Organiza a resposta
            envio.data(res);
            envio.message(msg);
        } catch(erro) {
            envio.message(erro.message);
            response.status(400);
        }

        return response.json(envio.get())
    }

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