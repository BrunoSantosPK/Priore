import TabelaPeriodica from "./TabelaPeriodica";
import Integridade from "./interfaces/Integridade";
import ElementoQuimico from "./interfaces/ElementoQuimico";

// tipagem intermediária
type initList = {
    par: number,
    indice: number,
    close: boolean
};

type finishList = {
    par: number,
    indice: number
};

type Composicao = {
    simbolo: string,
    elemento: ElementoQuimico,
    multiplicador: number
};

export default class Substancia implements Integridade {

    // Da interface
    erro = false;
    message = "";

    // Da classe
    formulaQuimica = "";
    nome = "";
    composicao: Composicao[] = [];
    estrutura: Composicao[] = [];
    massaMolar = 0;

    constructor(formula: string, nome: string) {
        this.formulaQuimica = formula;
        this.nome = nome;
        
        this.montar();
    }

    getMassaMolar(): number {
        return this.massaMolar;
    }

    getComposicao(): Composicao[] {
        return this.estrutura;
    }

    montar(): void {
        // Verifica a presença de fórmula química e nome
        if(this.formulaQuimica == "" || this.nome == "") {
            this.setErro(true, "A fórmula química ou o nome estão vazios.");
        } else {
            // Remove parênteses e normaliza a string de fórmula química
            const formulaNormalizada = this.normalizar(this.formulaQuimica);
            if(this.erro)
                return;
            
            // Verifica os elementos existentes e interpreta a fórmula
            const comp = this.interpretar(formulaNormalizada);
            if(this.erro)
                return;
            this.composicao = comp;

            // Calcula a massa molar e atualiza o erro
            this.calcularMassaMolar();
            this.normalizarEstrutura();
            this.setErro(false, "Sucesso na montagem da substância.");
        }
    }

    calcularMassaMolar() {
        let soma = 0;
        this.composicao.forEach(unidade => {
            soma += unidade.elemento.massaMolar * unidade.multiplicador;
        });
        this.massaMolar = soma;
    }

    normalizarEstrutura() {
        const esqueleto: Composicao[] = [];
        for(let i = 0; i < this.composicao.length; i++) {
            let indc = esqueleto.findIndex(el => el.simbolo == this.composicao[i].simbolo);
            if(indc == -1) {
                esqueleto.push(this.composicao[i]);
            } else {
                esqueleto[indc].multiplicador += this.composicao[i].multiplicador;
            }
        }
        this.estrutura = esqueleto;
    }

    normalizar(formula: string): string {
        // Verifica a existência de parênteses e correto fechamento
        const { init, finish } = this.parear(formula);

        if(init.length != finish.length) {
            // Erro, parênteses não fechados
            this.setErro(true, "Os parênteses não estão pareados corretamente.");
            return formula;
        }

        // Substitui os parênteses
        const formulaNormalizada = this.removerParenteses(init, finish, formula);

        // Controle: fórmula escrita com erro
        if(this.erro) {
            return formula;
        } else {
            return formulaNormalizada;
        }
    }

    parear(formula: string) {
        let contPar = 1;
        const init: initList[] = [];
        const finish: finishList[] = [];
        for(let i = 0; i < formula.length; i++) {
            if(formula[i] == "(") {
                init.push({ par: contPar, indice: i, close: false });
                contPar++;
            }

            if(formula[i] == ")") {
                let par = 0;
                for(let j = init.length - 1; j >= 0; j--) {
                    if(!init[j].close) {
                        par = init[j].par;
                        init[j].close = true;
                        break
                    }
                }
                finish.push({ par, indice: i });
            }
        }

        return { init, finish };
    }

    removerParenteses(init: initList[], finish: finishList[], formula: string): string {
        // Critério de parada
        if(init.length == 0 || finish.length == 0) {
            return formula;
        }

        // Inicialização de parâmetros
        let inicio = -1;
        let fim = formula.length + 1;
        for(let i = 0; i < init.length; i++) {
            // Encontra a abertura de parênteses
            let parInit = init[i].par;

            for(let j = 0; j < finish.length; j++) {
                let parFinish = finish[j].par;

                if(parInit == parFinish) {
                    // Verifica se é o par mais interno
                    if(init[i].indice > inicio && init[i].indice < fim) {
                        inicio = init[i].indice;
                        fim = finish[j].indice;
                    }
                }
            }
        }

        // Verifica a existência de multiplicador
        let multiplicador = "";
        let novoFim = fim + 1;
        while(novoFim < formula.length && this.eMultiplicador(formula[novoFim])) {
            multiplicador += formula[novoFim];
            novoFim++;
        }

        if(multiplicador == "")
            multiplicador = "1";
        const multi = parseInt(multiplicador);

        // Faz a nova string
        const intervalo = formula.substr(inicio + 1, fim - inicio - 1);
        const dados = this.interpretar(intervalo);

        // Controle de erro: fórmula com erro de escrita
        if(this.erro) {
            return formula;
        }

        // Monta nova string
        let formulaFormat = "";
        dados.forEach(dado => {
            formulaFormat += dado.simbolo + (multi * dado.multiplicador).toString();
        });

        // Refatora a nova fórmula
        const newFormula = formula.substr(0, inicio) + formulaFormat + formula.substr(novoFim);

        // Refaz o pareamento
        const { init: newInit, finish: newFinish } = this.parear(newFormula);

        // Recursividade
        return this.removerParenteses(newInit, newFinish, newFormula);
    }

    interpretar(formula: string): Composicao[] {
        // Inicializa array de resposta e o ponteiro de busca na string
        const res: Composicao[] = [];
        let i = 0;

        // Percorre a fórmula química
        while(i < formula.length) {
            let char = formula[i];
            if(this.eMultiplicador(char)) {
                // Identificou um número
                if(i == 0) {
                    // Lança um erro, número não pode iniciar uma fórmula
                    this.setErro(true, "Erro na escrita da fórmula química. Não pode ser inicializada com número");
                    break;
                } else {
                    // Verifica se os próximos caracteres são números
                    let num = char;
                    let j = i + 1;
                    while(j < formula.length && this.eMultiplicador(formula[j])) {
                        num += formula[j];
                        j++;
                    }

                    // Adiciona o multiplicador ao elemento anterior
                    i = j - 1;
                    res[res.length - 1].multiplicador = parseInt(num);
                }
            } else {
                let elementoUmChar = TabelaPeriodica.get(char);
                let elemento, elementoDoisChar;
                if(i + 1 < formula.length)
                    elementoDoisChar = TabelaPeriodica.get(char + formula[i + 1]);
                else
                    elementoDoisChar = undefined;

                if(elementoDoisChar != undefined) {
                    // Identifica elemento composto por 2 caracteres
                    char = char + formula[i + 1];
                    elemento = elementoDoisChar;

                    // Avança o ponteiro de leitura
                    i++;
                } else if(elementoUmChar != undefined) {
                    // Identifica elemento composto por 1 caractere
                    elemento = elementoUmChar;
                } else {
                    // Lança um erro, elementro estranho
                    this.setErro(true, "Erro na escrita da fórmula química. Caractere estranho (elemento não cadastrado ou não numérico).");
                    break;
                }

                // Adiciona o elemento encontrado na lista de resposta
                res.push({ simbolo: char, elemento, multiplicador: 1 });
            }
            // Próximo caractere
            i++;
        }

        return res;
    }

    eMultiplicador(str: string): boolean {
        const numeros = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
        let sim = false;
        for(let i = 0; i < numeros.length; i++) {
            if(str == numeros[i]) {
                sim = true;
                break
            }
        }
        return sim;
    }

    getErro(): boolean {
        return this.erro;
    }

    getMessage(): string {
        return this.message;
    }

    setErro(erro: boolean, message: string) {
        this.erro = erro;
        this.message = message;
    }

}