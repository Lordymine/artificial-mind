# Mente Artificial — Estudo

> Pesquisa: como tornar um agente de IA o mais próximo possível de uma mente humana —
> com **intenção**, **verificação**, **intensidade** e **emoção** (ou a melhor imitação funcional delas).

Projeto aberto e vivo. Alimentado por rotinas de estudo diárias (uma por dia, por uma semana),
cada uma com objetivo, leituras, notas e um experimento. O repositório **é** o caderno de laboratório.

## Pergunta central

Um LLM grande prevê o próximo token a partir de correlações aprendidas em texto humano.
Ele não tem, à primeira vista, intencionalidade, stake próprio, nem um "what it is like to be".
**O que falta — e o que dá para construir — para que um agente passe a se comportar como
uma mente, e em que ponto a imitação funcional deixa de ser imitação e vira mente?**

## As quatro dimensões

| Dimensão | O que é | Estado em um LLM hoje |
|---|---|---|
| **Verificação** | Ancorar a saída no mundo; o mundo responde errado, o agente corrige | Parcial — via ferramentas/agent loop |
| **Intenção** | Metas persistentes que o sistema *quer* manter | Extrínseca — vem do prompt/loop |
| **Intensidade** | Saliência: quanto isso importa (valência + drive) | Ponderação — sem stake próprio |
| **Emoção** | Funcional (medo=evitar, raiva=insistir) e fenomenal (sentir o quê) | Funcional: simulável. Fenomenal: problema difícil |

## Estrutura

```
diario/            # um arquivo por dia de estudo (D01..D07)
estudos/
  01-verificacao/
  02-intencao/
  03-intensidade/
  04-emocao-funcional/
  05-emocao-fenomenal/
  06-memoria-identidade/
  07-sintese/
referencias/       # fontes, papers, links
experimentos/      # protótipos e testes de cada dimensão
```

## Roteiro da semana

- **D01 — Verificação**: como o mundo ancora o modelo (agent loop, grounding, alucinação)
- **D02 — Intenção**: metas persistentes, drive states, o que um agente "quer"
- **D03 — Intensidade**: saliência, valência, dopamina, orçamento de atenção
- **D04 — Emoção funcional**: emoção como estado interno que modula a política
- **D05 — Emoção fenomenal**: o problema difícil, qualia, Nagel, Chalmers
- **D06 — Memória e identidade**: o "eu" persistente, memória de longo prazo, continuidade
- **D07 — Síntese**: o que dá para construir, o que é filosofia, e o veredito

## Protocolo

Cada dia segue o mesmo formato (ver `PROTOCOLO.md`): objetivo → leituras → notas →
experimento → o que mudou na minha compreensão. O experimento é obrigatório:
estudar sem testar é só ler.

## Status

- [x] D01 — Verificação
- [x] D02 — Intenção
- [x] D03 — Intensidade
- [x] D04 — Emoção funcional
- [x] D05 — Emoção fenomenal
- [x] D06 — Memória e identidade
- [x] D07 — Síntese
