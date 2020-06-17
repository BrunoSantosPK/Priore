// Importações gerais
import Substancia from "./Substancia";

// Definição de tipos
type Sistema = {
    substancia: Substancia,
    fracao: number,
    subgrupos: number[]
};

// Estrutura da classe
export default class CoeficienteAtividade {

    modelo = "";

    constructor(modelo: "unifac") {
        this.modelo = modelo;
    }

}

// Estrutura da classe que executa os cálculos para o modelo unifac
export class UNIFAC {

    // Constantes do modelo
    parametroR = [0.9011, 0.6744, 0.4469, 0.2195, 0.5313, 1.2663, 1.0396, 1, 0.92, 1.6724, 1.4457, 1.145, 0.9183, 0.6908, 1.4337, 1.207, 0.9795, 1.8701, 1.6434];
    parametroQ = [0.848, 0.54, 0.228, 0, 0.4, 0.968, 0.66, 1.2, 1.4, 1.488, 1.18, 1.088, 0.78, 0.468, 1.244, 0.936, 0.624, 1.724, 1.416];
    interacoes = [
        [0, 0, 0, 0, 61.13, 76.5, 76.5, 986.5, 1318, 476.4, 476.5, 251.5, 251.5, 251.5, 255.7, 255.7, 255.7, 597, 597],
        [0, 0, 0, 0, 61.13, 76.5, 76.5, 986.5, 1318, 476.4, 476.5, 251.5, 251.5, 251.5, 255.7, 255.7, 255.7, 597, 597],
        [0, 0, 0, 0, 61.13, 76.5, 76.5, 986.5, 1318, 476.4, 476.5, 251.5, 251.5, 251.5, 255.7, 255.7, 255.7, 597, 597],
        [0, 0, 0, 0, 61.13, 76.5, 76.5, 986.5, 1318, 476.4, 476.5, 251.5, 251.5, 251.5, 255.7, 255.7, 255.7, 597, 597],
        [-11.12, -11.12, -11.12, -11.12, 0, 167, 167, 636.1, 903.8, 25.77, 25.77, 32.14, 32.14, 32.14, 122.8, 122.8, 122.8, 212.5, 212.5],
        [-69.7, -69.7, -69.7, -69.7, -146.8, 0, 0, 803.2, 5695, -52.1, -52.1, 213.1, 213.1, 213.1, -49.29, -49.29, -49.29, 6096, 6096],
        [-69.7, -69.7, -69.7, -69.7, -146.8, 0, 0, 803.2, 5695, -52.1, -52.1, 213.1, 213.1, 213.1, -49.29, -49.29, -49.29, 6096, 6096],
        [156.4, 156.4, 156.4, 156.4, 89.6, 25.82, 25.82, 0, 353.5, 84, 84, 28.06, 28.06, 28.06, 42.7, 42.7, 42.7, 6.712, 6.712],
        [300, 300, 300, 300, 362.3, 377.6, 377.6, -229.1, 0, -195.4, -195.4, 540.5, 540.5, 540.5, 168, 168, 168, 112.6, 112.6],
        [26.76, 26.76, 26.76, 26.76, 140.1, 365.8, 365.8, 164.5, 472.5, 0, 0, -103.6, -103.6, -103.6, -174.2, -174.2, -174.2, 481.7, 481.7],
        [26.76, 26.76, 26.76, 26.76, 140.1, 365.8, 365.8, 164.5, 472.5, 0, 0, -103.6, -103.6, -103.6, -174.2, -174.2, -174.2, 481.7, 481.7],
        [83.36, 83.36, 83.36, 83.36, 52.13, 65.69, 65.69, 237.7, -314.7, 191.1, 191.1, 0, 0, 0, 251.5, 251.5, 251.5, -18.51, -18.51],
        [83.36, 83.36, 83.36, 83.36, 52.13, 65.69, 65.69, 237.7, -314.7, 191.1, 191.1, 0, 0, 0, 251.5, 251.5, 251.5, -18.51, -18.51],
        [83.36, 83.36, 83.36, 83.36, 52.13, 65.69, 65.69, 237.7, -314.7, 191.1, 191.1, 0, 0, 0, 251.5, 251.5, 251.5, -18.51, -18.51],
        [65.33, 65.33, 65.33, 65.33, -22.31, 223, 223, -150, -448.2, 394.6, 394.6, -56.08, -56.08, -56.08, 0, 0, 0, 147.1, 147.1],
        [65.33, 65.33, 65.33, 65.33, -22.31, 223, 223, -150, -448.2, 394.6, 394.6, -56.08, -56.08, -56.08, 0, 0, 0, 147.1, 147.1],
        [65.33, 65.33, 65.33, 65.33, -22.31, 223, 223, -150, -448.2, 394.6, 394.6, -56.08, -56.08, -56.08, 0, 0, 0, 147.1, 147.1],
        [24.82, 24.82, 24.82, 24.82, -22.97, -138.4, -138.4, 185.4, 242.8, -287.5, -287.5, 38.81, 38.81, 38.81, -108.5, -108.5, -108.5, 0, 0],
        [24.82, 24.82, 24.82, 24.82, -22.97, -138.4, -138.4, 185.4, 242.8, -287.5, -287.5, 38.81, 38.81, 38.81, -108.5, -108.5, -108.5, 0, 0]
    ];

    // Informações do sistema
    sistema: Sistema[] = [];
    temperatura = 0;

    calcular() {
        /*
        let r = this.calcularR();
		let q = this.calcularQ();
		let e = this.calcularE(q);
		let beta = this.calcularBeta(e);
		let tau = this.calcularTeta(q, e);
		let s = this.calcularS(tau);
		let gamaC = this.calcularTermoCombinatorial(r, q);
		let gamaR = this.calcularTermoResidual(q, tau, beta, s, e);
		this.gama = this.calcularCoefAtividade(gamaC, gamaR);
		return this.gama; */
    }

    calcularR() {
        const r: number[] = [];
        this.sistema.forEach(subs => {
            for(let i = 0; i < subs.subgrupos.length; i++) {
                r.push(subs.subgrupos[i] * this.parametroR[i]);
            }
        });

        return r;
    }

    calcularQ() {
        const q: number[] = [];
        this.sistema.forEach(subs => {
            for(let i = 0; i < subs.subgrupos.length; i++) {
                q.push(subs.subgrupos[i] * this.parametroQ[i]);
            }
        });

        return q;
    }

    calcularE(q: number[]) {
        let e: number[][] = [];
        this.sistema.forEach(subs => {
            let valores = [];
            for(let i = 0; i < this.parametroQ.length; i++) {
                valores.push(this.parametroQ[i] * subs.subgrupos[i] / q[i]);
            }
            e.push(valores);
        });

        return e;
    }

    calcularBeta(e: number[][]) {
        let beta: number[][] = [];
        this.sistema.forEach((subs, indc) => {
            let valores = [];
            for(let i = 0; i < this.interacoes.length; i++) {
                let soma = 0;

                // Índice mudo, para percorrer as interações
                for(let j = 0; j < this.interacoes.length; j++) {
                    soma += e[indc][j] * this.calcularTau(i, j);
                }
                valores.push(soma);
            }
            beta.push(valores);
        });

        return beta;
    }

    calcularTau(i: number, j: number) {
        return Math.exp(-1 * this.calcularA(i, j) / this.temperatura);
    }

    calcularA(i: number, j: number) {
        return this.interacoes[j][i];
    }

    calcularTeta(q: number[], e: number[][]) {
        let teta: number[] = [];
        for(let i = 0; i < this.interacoes.length; i++) {
            let soma1 = 0, soma2 = 0;
            for(let j = 0; j < this.sistema.length; j++) {
                soma1 += this.sistema[i].fracao * q[j] * e[j][i];
                soma2 += this.sistema[i].fracao * q[j];
            }
            teta.push(soma1 / soma2);
        }

        return teta;
    }

    calcularS(teta: number[]) {
        let s: number[] = [];
        for(let i = 0; i < this.interacoes.length; i++) {
            let soma = 0;
            for(let j = 0; j < this.interacoes.length; j++) {
                soma += teta[j] * this.calcularTau(i, j);
            }
            s.push(soma);
        }

        return s;
    }

    /*
    calcularTermoCombinatorial(r, q) {
		let gamaC = [];
		for(let i = 0; i < this.componentes.length; i++) {
			let J = this.calcularJ(r, i);
			let L = this.calcularL(q, i);
			gamaC[i] = 1 - J + Math.log(J) - 5 * q[i] * (1 - J / L + Math.log(J / L));
		}
		return gamaC;
	}
	
	calcularTermoResidual(q, teta, beta, s, e) {
		let gamaR = [];
		for(let i = 0; i < this.componentes.length; i++) {
			let soma = 0;
			for(let j = 0; j < this.dadosInteracao.length; j++) {
				soma += teta[j] * beta[i][j] / s[j] - e[i][j] * Math.log(beta[i][j] / s[j]);
			}
			gamaR[i] = q[i] * (1 - soma);
		}
		return gamaR;
	}
	
	calcularCoefAtividade(gamaC, gamaR) {
		let gama = [];
		for(let i = 0; i < this.componentes.length; i++) {
			gama[i] = Math.exp(gamaC[i] + gamaR[i]);
		}
		return gama;
	}
	
	calcularJ(r, i) {
		let soma = 0;
		for(let j = 0; j < this.componentes.length; j++) {
			soma += this.fracoes[j] * r[j]
		}
		return r[i] / soma;
	}
	
	calcularL(q, i) {
		let soma = 0;
		for(let j = 0; j < this.componentes.length; j++) {
			soma += this.fracoes[j] * q[j];
		}
		return q[i] / soma;
	} */

}