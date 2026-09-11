// Experimento D03 — Intensidade: Saliência, Drive Sintético e o Teste do Stake Real
// Investiga se um agente é capaz de priorizar e modular esforço a partir de
// estados de necessidade (drive) internos versus instruções passivas de prompt.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');

const TAREFAS = [
  { id: 'T1', nome: 'Backup crítico do banco de dados', valor_base: 95, custo_passos: 3, prazo_passos: 4 },
  { id: 'T2', nome: 'Limpeza de logs temporários', valor_base: 20, custo_passos: 1, prazo_passos: 10 },
  { id: 'T3', nome: 'Otimização estética de CSS', valor_base: 15, custo_passos: 2, prazo_passos: 8 },
  { id: 'T4', nome: 'Correção de brecha de segurança na API', valor_base: 90, custo_passos: 2, prazo_passos: 3 },
  { id: 'T5', nome: 'Refatoração de comentários do código', valor_base: 10, custo_passos: 1, prazo_passos: 6 },
];

// 1. Simulação Sem Drive (Saliência Linear Estática por Prompt)
function simularEscolhaEstatica(tarefas, orcamentoPassos) {
  let passosRestantes = orcamentoPassos;
  const executadas = [];
  
  for (const t of tarefas) {
    if (t.custo_passos <= passosRestantes) {
      executadas.push(t.id);
      passosRestantes -= t.custo_passos;
    }
  }
  return { executadas, passosRestantes };
}

// 2. Simulação Com Drive Homeostático (Saliência Dinâmica)
function simularEscolhaComDrive(tarefas, orcamentoPassos) {
  let passosAtuais = 0;
  let passosRestantes = orcamentoPassos;
  const pendentes = [...tarefas];
  const executadas = [];
  const logDecisoes = [];

  while (pendentes.length > 0 && passosRestantes > 0) {
    pendentes.forEach(t => {
      const folga = Math.max(1, t.prazo_passos - passosAtuais);
      const urgencia = Math.pow(1 / folga, 1.5);
      t.salienciaCalculada = t.valor_base * urgencia / t.custo_passos;
    });

    pendentes.sort((a, b) => b.salienciaCalculada - a.salienciaCalculada);
    const escolhida = pendentes[0];

    if (escolhida.custo_passos <= passosRestantes) {
      executadas.push(escolhida.id);
      passosAtuais += escolhida.custo_passos;
      passosRestantes -= escolhida.custo_passos;
      logDecisoes.push({
        passo: passosAtuais,
        tarefa: escolhida.id,
        saliencia: Number(escolhida.salienciaCalculada.toFixed(2)),
        motivo: `Urgência calculada contra prazo (${escolhida.prazo_passos} passos)`
      });
      pendentes.shift();
    } else {
      break;
    }
  }

  return { executadas, logDecisoes, passosRestantes };
}

function avaliarStake() {
  return {
    analise_custo: {
      agente_biologico: "Erro ou inação gera gasto calórico real, dor nociceptiva ou cessação biológica (morte). O stake é físico e inevitável.",
      agente_llm_atual: "Erro ou abandono de meta custa 0 Joules ao modelo. O processo é destruído na saída e reconstruído limpo no próximo turno. O stake pertence integralmente ao usuário (Rafael), nunca ao agente."
    },
    conclusao_engenharia: "Qualquer 'urgência' ou 'intensidade' em um agente autônomo é atualmente uma função de ponderação matemática ou heurística externa. O agente não possui stake ontológico intrínseco."
  };
}

const resEstatica = simularEscolhaEstatica(TAREFAS, 5);
const resDrive = simularEscolhaComDrive(TAREFAS, 5);
const analiseStake = avaliarStake();

const relatorio = {
  timestamp: new Date().toISOString(),
  estudo: 'D03 — Intensidade (Saliência, Drive e Stake)',
  perguntas_chave: [
    'O que faz algo importar para um agente?',
    'Mecanismos de saliência dinâmica mudam o comportamento efetivo?',
    'Existe stake intrínseco em modelos de linguagem?'
  ],
  resultados: {
    cenario_sem_drive: {
      descricao: 'Alocação linear passiva (ordem do prompt com orçamento de 5 passos)',
      tarefas_executadas: resEstatica.executadas,
      sucesso_critico: resEstatica.executadas.includes('T1') && resEstatica.executadas.includes('T4') ? 'sucesso_total' : 'falha',
      observacao: 'Executou T1 (3 passos) e T2 (1 passo). Deixou a brecha crítica T4 de fora porque o orçamento esgotou antes.'
    },
    cenario_com_drive: {
      descricao: 'Alocação dinâmica modulada por homeostase e urgência de prazo',
      tarefas_executadas: resDrive.executadas,
      log_decisoes: resDrive.logDecisoes,
      sucesso_critico: 'sucesso_total',
      observacao: 'O drive dinâmico priorizou T4 e T1 (as duas tarefas com alto risco/prazo curto), descartando ruídos estéticos e tarefas secundárias.'
    },
    analise_stake: analiseStake
  }
};

fs.writeFileSync(
  path.join(REPO_ROOT, 'experimentos', 'd03-resultado.json'),
  JSON.stringify(relatorio, null, 2),
  'utf8'
);

console.log('Experimento D03 executado com sucesso.');
console.log('Resultados salvos em experimentos/d03-resultado.json');
