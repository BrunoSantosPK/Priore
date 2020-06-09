import TabelaPeriodica from "./TabelaPeriodica";
import Integridade from "./interfaces/Integridade";
import ElementoQuimico from "./interfaces/ElementoQuimico";
import Substancia from "./Substancia";

// Tipagem intermediária
type Membro = {
    coeficiente: number,
    substancia: Substancia,
    molInicial: number
};

type MembroSet = {
    coeficiente: number,
    substancia: Substancia,
    molInicial?: number
};

type Composicao = {
    simbolo: string,
    elemento: ElementoQuimico,
    multiplicador: number
};

export default class ReacaoQuimica implements Integridade {

    // Integridade
    erro = false;
    message = "";
    reagentes: Membro[] = [];
    produtos: Membro[] = [];

    montar() {
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
            this.setErro(!balanceado, msn);
        }
    }

    setReagente({ substancia, coeficiente, molInicial = 0 }: MembroSet) {
        this.reagentes.push({
            substancia,
            coeficiente: Math.abs(coeficiente) * -1,
            molInicial
        });
    }

    setProduto({ substancia, coeficiente, molInicial = 0 }: MembroSet) {
        this.produtos.push({
            substancia,
            coeficiente: Math.abs(coeficiente),
            molInicial
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