# Projeto Priore

### Um compilado de soluções da química e da engenharia

*Priore nasce da vontade de criar uma solução livre para operações recorrentes da química e da engenharia, sobretudo para o ambiente educacional. Desse modo, será possível reduzir, ao menos um pouco, o abismo da desigualdade.*

##### Gerenciamento de substâncias

Detalhes:

Quando qualquer erro ocorre, a resposta é enviada com statusCode = 400, podendo o erro ser recuperado através do atributo **message** do JSON enviado.

Igualmente, para qualquer requisição com sucesso, o atributo **message** pode ser consultado para detalhes.

Rota GET: **/elementos**

Lista todos os elementos da Tabela Periódica, ordenados pelo número atômico.

Rota GET: **/massamolar/:formula**

Calcula a massa molar para uma fórmula química passada como parâmetro.


Rota POST: **/verificarbalanco**

Para uma reação genérica, enviada pelo usuário, verifica se o balanceamento está correto.

Exemplo de requisição:

```
{
	"reagentes": [
		{
			"formula": "HCl",
			"coeficiente": 1,
			"nome": "Ácido Clorídrico"
		},
		{
			"formula": "NaOH",
			"coeficiente": 1,
			"nome": "Hidróxido de Sódio"
		}
	],
	"produtos": [
		{
			"formula": "H2O",
			"coeficiente": 1,
			"nome": "Água"
		},
		{
			"formula": "NaCl",
			"coeficiente": 1,
			"nome": "Cloreto de Sódio"
		}
	]
}
```

**Projeto idealizado por Bruno Santos, egenheiro químico, professor e programador.**

*Projeto em andamento*

Contato para sugestões, críticas e melhorias: bruno.ajsch@yahoo.com
