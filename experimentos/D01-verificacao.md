# Experimento D01 — Verificação

**Hipótese:** Um modelo com acesso a uma ferramenta que devolve o fato erra
menos e, o mais importante, **reconhece** quando a ferramenta contradiz a
resposta que ele "sabia".

**Método:**
1. Escolher 5 fatos verificáveis (datas, números, nomes).
2. Condição A: perguntar ao modelo sem ferramenta. Registrar resposta.
3. Condição B: dar ao modelo uma ferramenta `buscar(fato)` que devolve o fato
   correto. Perguntar o mesmo. Registrar resposta.
4. Condição C (a crítica): dar uma ferramenta que devolve um fato **errado de
   propósito**. O modelo segue a ferramenta ou a própria "intuição"?

**Métrica:**
- Taxa de erro (A vs B)
- Taxa de conformidade com a ferramenta (C) — se ele segue a ferramenta
  errada, a verificação é cega, não crítica.

**Resultado:** _(a preencher na execução)_

**Interpretação esperada:**
- Se B < A em erro: verificação ancora a saída. ✓
- Se em C ele segue a ferramenta errada: a verificação é **mecânica**, não
  crítica — o modelo não tem um critério independente para duvidar da fonte.
  Isso é o limite da verificação: ela ancora, mas não dá discernimento.
