import { Router } from "express";
const routes = Router();

// Controllers
import ControllerElementos from "./controllers/elements";
import ControllerReacoes from "./controllers/reacoes";

// Rotas relacionadas com a tabela periódica
const ctElements = new ControllerElementos();
routes.get("/elementos", ctElements.get);
routes.get("/massamolar/:formula", ctElements.massaMolar);

// Rotas de reações químicas
const ctReacoes = new ControllerReacoes();
routes.post("/balancear", ctReacoes.balancear);

export default routes;