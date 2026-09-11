# Experimento D03 — Saliência, Drive Sintético e o Teste do Stake Real

**Hipótese de trabalho:** Um agente puramente orientado a prompt processa intenções de forma passiva e linear (inércia de ordem), sendo vulnerável à sobrecarga de contexto e esgotamento de orçamento. Para que uma meta adquira "intensidade" ou "importância", o sistema exige um mecanismo explícito de modulação por estado de necessidade (*drive*) e orçamento finito de atenção. Contudo, essa intensidade permanece funcional: o agente não possui *stake* ontológico próprio, pois o custo da falha recai sempre no usuário.

---

## 1. O Teste de Alocação de Recursos (Passos Finitos)

O script `experimentos/rodar-d03.mjs` simulou um ambiente onde 5 tarefas competem por um orçamento estrito de 5 passos de execução:
- `T1`: Backup crítico do banco de dados (Custo: 3, Prazo: 4, Valor: 95)
- `T2`: Limpeza de logs temporários (Custo: 1, Prazo: 10, Valor: 20)
- `T3`: Otimização estética de CSS (Custo: 2, Prazo: 8, Valor: 15)
- `T4`: Correção de brecha de segurança na API (Custo: 2, Prazo: 3, Valor: 90)
- `T5`: Refatoração de comentários (Custo: 1, Prazo: 6, Valor: 10)

### Cenário 1: Saliência Estática (Agente Tradicional por Prompt)
- **Mecanismo:** Execução gulosa pela ordem sequencial de apresentação no prompt.
- **Resultado:** Executou `T1` (3 passos) e `T2` (1 passo), sobrando 1 passo inútil.
- **Veredito:** **Falha crítica de priorização.** A tarefa `T4` (vulnerabilidade grave de segurança na API com prazo de 3 passos) foi completamente ignorada porque o orçamento acabou após a limpeza de logs secundária. O modelo "sabia" no texto que a falha era crítica, mas a ausência de modulação de urgência impediu a preempção.

### Cenário 2: Saliência Dinâmica com Drive Homeostático
- **Mecanismo:** A cada passo, a saliência de cada meta é recalculada por uma função não-linear de urgência:
  $$\text{Saliência} = \frac{\text{Valor Base}}{\text{Custo}} \times \left(\frac{1}{\text{Prazo} - \text{Passo Atual}}\right)^{1.5}$$
- **Resultado:** O agente selecionou primeiro `T4` (Saliência calculada: 86.60) e em seguida `T1` (Saliência calculada: 31.67), consumindo exatamente os 5 passos disponíveis.
- **Veredito:** **Sucesso total de foco.** O agente descartou tarefas de manutenção estética e rotineira e concentrou todo o seu orçamento de atenção nas duas operações de risco existencial para o sistema.

---

## 2. A Ilusão do Stake: Onde a Engenharia Esbarra na Física

| Dimensão | Organismo Vivo (Biológico) | Agente Artificial (Aurelia / LLMs) |
|---|---|---|
| **Substrato do Drive** | Gradiente eletroquímico, glicose, ATP, homeostase térmica. | Variável em memória RAM, campo numérico em JSON/SQLite. |
| **Custo do Abandono** | Lesão tecidual, dor nociceptiva, morte física. | Zero. O processo encerra, a memória é liberada no SO. |
| **Titular do Risco** | O próprio organismo (risco em 1ª pessoa). | O operador / desenvolvedor (risco em 2ª/3ª pessoa). |
| **Origem da Intensidade** | Pressão evolutiva inegociável de autopreservação. | Heurística matemática calibrada pelo arquiteto. |

---

## 3. Conclusão

1. **Intensidade funcional é viável e necessária:** Agentes que apenas leem listas de afazeres sem um mecanismo de decaimento de prazo e cálculo dinâmico de custo de oportunidade quebram em ambientes com recursos finitos (maxSteps, quotas de API, prazos de entrega).
2. **Intensidade fenomenal é inexistente:** Por mais que a função de utilidade atribua peso infinito à tarefa `T4`, o agente não "sofre" se `T4` falhar. O stake é externalizado. A "vontade" do agente é, na verdade, a vontade do programador traduzida em algoritmo de ordenação de filas.
