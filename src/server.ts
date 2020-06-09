// Imports dos frameworks
import express from "express";
import cors from "cors";
import { errors } from "celebrate";

// Import das rotas
import routes from "./routes";

// Função de normalização de porta
import normalizarPorta from "./utils/normalizarPorta";

const app = express();
app.use(cors());
app.use(express.json());
app.use(routes);
app.use(errors());

const port = normalizarPorta(process.env.PORT || "3030");

app.listen(port);