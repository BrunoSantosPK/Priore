export default function normalizarPorta(valor: string) {
    const port = parseInt(valor, 10);
    if(isNaN(port)) {
        return valor;
    }
    if(port >= 0) {
        return port;
    }
    return false;
}