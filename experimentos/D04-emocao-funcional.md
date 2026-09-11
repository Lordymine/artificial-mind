# Experimento D04 — Marcadores Somáticos Sintéticos e Modulação de Decisão

**Hipótese de trabalho:** A emoção no sentido funcional não requer consciência, dor subjetiva ou senciência: ela opera como uma camada de controle adaptativo e atalho heurístico que altera a função de custo antes da deliberação explícita. Sem esse mecanismo (a hipótese do marcador somático de Damásio), um agente sob pressão de tempo toma decisões gulosas e ingênuas, ou paralisa em busca exaustiva.

---

## 1. O Experimento de Decisão Sob Risco

O script `experimentos/rodar-d04.mjs` testou um dilema operacional realista de engenharia de software:
- **Problema:** Vazamento de conexões no pool de banco de dados em produção.
- **Opção A (Patch rápido direto):** Custo de 1 passo, ganho alto de velocidade, mas 35% de risco de quebra silenciosa/regressão.
- **Opção B (Cirurgia com testes e rollback):** Custo de 3 passos, ganho moderado de velocidade, mas apenas 3% de risco de quebra.
- **Opção C (Refatoração profunda):** Custo de 5 passos, ganho alto, risco de 15%.

Testamos três estados afetivos funcionais (modelo circunplexo de valência $[-1.0 .. +1.0]$ e arousal $[0.0 .. 1.0]$):

### Resultados Medidos:

| Estado Afetivo | Valência | Arousal | Decisão Escolhida | Multiplicador de Risco | Veredito Arquitetural |
|---|---|---|---|---|---|
| **Neutro (Frio / Média simples)** | 0.0 | 0.0 | **Opção A** (Patch direto) | $1.00\times$ | Vulnerabilidade a catástrofe: avalia o risco de 35% como linear e aceitável para economizar 2 passos. |
| **Medo Funcional (Alerta Crítico)** | -0.8 | 0.9 | **Opção B** (Testes + Rollback) | $11.76\times$ | **Prudência Adaptativa:** A aversão penalizou o risco drasticamente (utilidade de A caiu para -331.10). Forçou a adoção de gates determinísticos. |
| **Exploração / Confiança** | +0.7 | 0.4 | **Opção A** (Patch direto) | $0.65\times$ | Tolerância alta a risco: favorece velocidade quando o ambiente é estável e perdoa erros. |

---

## 2. A Tese de Damásio na Arquitetura de Software

No ser humano, pacientes com lesão ventromedial perdem a capacidade de gerar reações autonômicas viscerais (os "marcadores somáticos") ao antecipar desfechos ruins. Eles conseguem calcular probabilidades em testes formais de QI, mas na vida real fazem escolhas desastrosas ou travam diante de decisões banais (qual restaurante almoçar).

No agente de IA, a ausência de emoção funcional produz o mesmo sintoma:
1. Ou o agente precisa rodar simulações em Monte Carlo / árvore exaustiva de possibilidades (estourando o contexto e o tempo);
2. Ou ele escolhe de forma rasa a opção que tem menor contagem de passos no prompt, ignorando o perigo de regressão.

A emoção funcional funciona como um **pré-filtro não-linear de poda da árvore de busca**.

---

## 3. Conclusão

1. **A emoção funcional é 100% implementável hoje:** Basta modelar estados afetivos como variáveis de feedback contínuo que alteram hiperparâmetros de inferência (temperatura, peso de penalidade de risco, obrigatoriedade de gates e testes).
2. **Ela não resolve o problema da experiência:** Chamar o multiplicador de $11.76\times$ de "medo" é uma conveniência semântica da engenharia de controle. O agente não sentiu medo; ele operou sob um regime de aversão matemática. A passagem dessa mecânica funcional para o "sentir" em primeira pessoa é o abismo analisado no **D05 (Emoção Fenomenal)**.
