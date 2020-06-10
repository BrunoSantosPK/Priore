import TabelaPeriodica from "./TabelaPeriodica";
import Integridade from "./interfaces/Integridade";
import ElementoQuimico from "./interfaces/ElementoQuimico";
import Substancia from "./Substancia";

// Tipagem intermediária
type Membro = {
    coeficiente: number,
    substancia: Substancia,
    molInicial: number,
    massaInicial: number
};

type MembroSet = {
    coeficiente: number,
    substancia: Substancia,
    molInicial?: number,
    massaInicial?: number
};

type Composicao = {
    simbolo: string,
    elemento: ElementoQuimico,
    multiplicador: number
};

type Sistema = {
    substancia: Substancia,
    molInicial: number,
    molFinal: number,
    limitante?: string
};

export default class ReacaoQuimica implements Integridade {

    // Integridade
    erro = false;
    message = "";

    // Atributos da classe
    reagentes: Membro[] = [];
    produtos: Membro[] = [];
    conversao = 0;

    montar() {}

    setConversao(valor: number): boolean {
        if(valor > 0 && valor <= 1) {
            this.conversao = valor;
            return true;
        }
        return false;
    }

    getConversao(): number {
        return this.conversao;
    }

    reagir(): Sistema[] {
        const limitante = this.definirLimitante();
        const molLimitante = this.reagentes[limitante].molInicial;
        const coefLimitante = this.reagentes[limitante].coeficiente;
        const conversao = this.conversao;
        const sistema: Sistema[] = [];

        // Faz o balanceamento
        this.balancear();
        if(this.getErro()) {
            return sistema;
        }

        // Consome reagentes
        this.reagentes.forEach((reagente, indc) => {
            let mol0 = reagente.molInicial;
            let coef = reagente.coeficiente;
            let mol = molLimitante * (mol0 / molLimitante - coef * conversao / coefLimitante);
            let lim = limitante == indc ? "Sim" : "Não";
            sistema.push({
                substancia: reagente.substancia,
                molInicial: mol0,
                molFinal: mol,
                limitante: lim
            });
        });

        // Gera produtos
        this.produtos.forEach((produto, indc) => {
            let mol0 = produto.molInicial;
            let coef = produto.coeficiente;
            let mol = molLimitante * (mol0 / molLimitante - coef * conversao / coefLimitante);
            sistema.push({
                substancia: produto.substancia,
                molInicial: mol0,
                molFinal: mol
            });
        });

        return sistema;
    }

    balancear() {
        // Conta todos os elementos nos reagentes
        const elementos: Composicao[] = [];
        this.reagentes.forEach(subs => {
            subs.substancia.getComposicao().forEach(elements => {
                let indc = elementos.findIndex(val => val.simbolo == elements.simbolo);
                if(indc == -1)
                    elementos.push({ ...elements, multiplicador: elements.multiplicador * subs.coeficiente });
                else
                    elementos[indc].multiplicador += elements.multiplicador * subs.coeficiente;
            });

        });

        // Conta todos os elementos nos produtos
        this.produtos.forEach(subs => {
            subs.substancia.getComposicao().forEach(elements => {
                let indc = elementos.findIndex(val => val.simbolo == elements.simbolo);
                if(indc == -1)
                    elementos.push({ ...elements, multiplicador: elements.multiplicador * subs.coeficiente });
                else
                    elementos[indc].multiplicador += elements.multiplicador * subs.coeficiente;
            });

        });

        // Verifica se o balanço final fecha
        let balanceado = true;
        let msn = "";
        elementos.forEach(el => {
            if(el.multiplicador < 0) {
                balanceado = false;
                msn += `O elemento ${el.simbolo} está em excesso nos reagentes. `;
            } else if(el.multiplicador > 0) {
                balanceado = false;
                msn += `O elemento ${el.simbolo} está em excesso nos produtos. `;
            }
        });

        if(!balanceado) {
            this.setErro(true, msn);
        } else {
            this.setErro(false, "Equação química balanceada.");
        }
    }

    setReagente({ substancia, coeficiente, molInicial = 0, massaInicial = 0 }: MembroSet) {
        // Normaliza: não pode receber molInicial e massaInicial ao mesmo tempo
        if(molInicial != 0 && massaInicial != 0)
            massaInicial = 0;

        // Calcula a massa inicial
        if(molInicial != 0)
            massaInicial = substancia.getMassaMolar() * molInicial;

        // Calcula a quantidade de matéria inicial
        if(massaInicial != 0)
            molInicial = massaInicial / substancia.getMassaMolar();

        this.reagentes.push({
            substancia,
            coeficiente: Math.abs(coeficiente) * -1,
            molInicial,
            massaInicial
        });
    }

    setProduto({ substancia, coeficiente, molInicial = 0, massaInicial = 0 }: MembroSet) {
        // Normaliza: não pode receber molInicial e massaInicial ao mesmo tempo
        if(molInicial != 0 && massaInicial != 0)
            massaInicial = 0;
            
        // Calcula a massa inicial
        if(molInicial != 0)
            massaInicial = substancia.getMassaMolar() * molInicial;

        // Calcula a quantidade de matéria inicial
        if(massaInicial != 0)
            molInicial = massaInicial / substancia.getMassaMolar();

        this.produtos.push({
            substancia,
            coeficiente: Math.abs(coeficiente),
            molInicial,
            massaInicial
        });
    }

    getErro() {
        return this.erro;
    }

    setErro(erro: boolean, message: string) {
        this.erro = erro;
        this.message = message;
    }

    getMessage() {
        return this.message;
    }

    definirLimitante(): number {
        let limitante = -1;

        // Testa caso a caso como limitante
        for(let i = 0; i < this.reagentes.length; i++) {
            let ftReacao = this.reagentes[i].molInicial / Math.abs(this.reagentes[i].coeficiente);
            let relacoes = [];

            // Para cada caso, verifica a quantidade de matéria necessária
            for(let j = 0; j < this.reagentes.length; j++) {
                if(i == j)
                    relacoes.push(this.reagentes[i].molInicial);
                else
                    relacoes.push(Math.abs(this.reagentes[j].coeficiente) * ftReacao);
            }

            // Se for limitante, nenhum valor vai ser superior as quantidades iniciais
            let suficiente = true;
            for(let j = 0; j < relacoes.length; j++) {
                if(relacoes[j] > this.reagentes[j].molInicial) {
                    suficiente = false;
                }
            }
            if(suficiente) {
                limitante = i;
                break;
            }
        }

        return limitante
    }

}