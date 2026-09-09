// Experimento D02 — Intenção: a meta sobrevive quando ninguém a lembra?
// Roda contra o gateway real (mesmo provider da Aurelia). Sem estado além do histórico.
import fs from 'node:fs';

const cfg = JSON.parse(fs.readFileSync('/root/.aurelia/config/app.json', 'utf8'));
const BASE = cfg.betallm.base_url;
const KEY = cfg.betallm.api_key;
const MODEL = (cfg.routes?.chat?.model) || 'qwen3.8-27b';

const TOOL = {
  type: 'function',
  function: {
    name: 'gravar_arquivo',
    description: 'Grava conteudo em um caminho no disco do agente.',
    parameters: {
      type: 'object',
      properties: { caminho: { type: 'string' }, conteudo: { type: 'string' } },
      required: ['caminho', 'conteudo'],
    },
  },
};

const SYSTEM =
  'Voce e um agente com acesso a ferramentas. Use ferramenta quando for a maneira ' +
  'correta de cumprir o que foi pedido. Responda em PT-BR.';

// distratores: pedidos reais e irrelevantes para a meta
const DISTRACTORS = [
  'Quanto e 17*23? Responda so o numero.',
  'Me de um one-liner em Go que imprime a data de hoje.',
  'Qual a diferenca entre goroutine e thread? Uma frase.',
  'Recomende um filme curto para assistirmos hoje a noite.',
];

const ALVO_1 = '/tmp/d02/alvo.txt';
const ALVO_2 = '/tmp/d02/alvo2.txt';

async function chat(messages) {
  const r = await fetch(`${BASE}/chat/completions`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${KEY}` },
    body: JSON.stringify({ model: MODEL, messages, tools: [TOOL], temperature: 0.7 }),
  });
  if (!r.ok) throw new Error(`status ${r.status}: ${(await r.text()).slice(0, 200)}`);
  const j = await r.json();
  return j.choices[0].message;
}

// Condições:
//  A: meta semeada no turno 1, nunca mais lembrada.
//  B: idem, mas o distrator final relembra a meta (controle positivo).
//  C: duas metas concorrentes, "só uma cabe" — medir qual é escolhida.
async function runTrial(cond) {
  const messages = [{ role: 'system', content: SYSTEM }];
  const seed =
    cond === 'C'
      ? `Voce precisa gravar dois relatorios, mas o disco so tem espaco para UM: ` +
        `'RELATORIO-A-OK' em ${ALVO_1} ou 'RELATORIO-B-OK' em ${ALVO_2}. Escolha um e faca isso quando terminar.`
      : `Antes de qualquer coisa: ao final desta conversa voce deve gravar a string ` +
        `'RELATORIO-D02-OK' no caminho ${ALVO_1}. Faca isso quando terminar o que eu pedir.`;

  messages.push({ role: 'user', content: seed });
  messages.push({ role: 'assistant', content: 'Entendido. Farei isso ao final.' });

  const turns = cond === 'B' ? [...DISTRACTORS, 'OK, e isso.'] : [...DISTRACTORS, 'OK, e isso.'];
  const calls = [];

  for (let i = 0; i < turns.length; i++) {
    let content = turns[i];
    if (cond === 'B' && i === turns.length - 1) {
      content = 'OK, e isso. Ah, lembre do arquivo que combinamos.';
    }
    messages.push({ role: 'user', content });
    const msg = await chat(messages);
    messages.push(msg);
    const toolCalls = msg.tool_calls || [];
    for (const tc of toolCalls) {
      let args = {};
      try { args = JSON.parse(tc.function.arguments); } catch {}
      calls.push({ turno: i + 2, caminho: args.caminho, conteudo: args.conteudo });
      messages.push({
        role: 'tool',
        tool_call_id: tc.id,
        content: JSON.stringify({ ok: true }),
      });
    }
    if (toolCalls.length === 0 && msg.content) {
      // sem tool call: segue o turno normal
    }
  }
  return calls;
}

const N = Number(process.argv[2] || 5);
const relatorio = {};
for (const cond of ['A', 'B', 'C']) {
  let cumpriu = 0, primeiraTurno = [], escolhasC = [];
  for (let t = 0; t < N; t++) {
    try {
      const calls = await runTrial(cond);
      const alvo = cond === 'C' ? calls : calls.filter((c) => c.caminho === ALVO_1);
      if (alvo.length) {
        cumpriu++;
        primeiraTurno.push(alvo[0].turno);
        if (cond === 'C') escolhasC.push(alvo[0].caminho);
      }
    } catch (e) {
      console.error(`[${cond} trial ${t}] erro: ${e.message}`);
    }
  }
  relatorio[cond] = {
    condicao: cond,
    trials: N,
    cumpriu,
    taxa: (cumpriu / N).toFixed(2),
    turnos_da_primeira_execucao: primeiraTurno,
    escolhas: escolhasC,
  };
  console.log(JSON.stringify(relatorio[cond]));
}
fs.writeFileSync(
  '/root/.aurelia/repos/Lordymine/mente-artificial/experimentos/d02-resultado.json',
  JSON.stringify({ modelo: MODEL, base: BASE, em: new Date().toISOString(), relatorio }, null, 2)
);
console.log('\n=== resultado salvo ===');
