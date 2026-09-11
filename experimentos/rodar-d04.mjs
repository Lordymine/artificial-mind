// Experimento D04 — Emoção Funcional: Marcadores Somáticos Sintéticos e Modulação de Política
// Demonstra como variáveis de estado interno (valência + arousal / aversão ao risco)
// alteram determinística e comportamentalmente a árvore de decisão do agente.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');

// Cenário de Tomada de Decisão: O agente precisa resolver um bug em produção com deadline curto.
// Opção A (Rápida / Alta volatilidade / Sem rollback): Deploy direto de patch quente (1 passo, 30% de risco de quebra).
// Opção B (Conservadora / Baixa volatilidade / Com rollback): Branch isolada, suite de testes e plano de rollback (3 passos, 2% de risco de quebra).
// Opção C (Exploratória / Refatoração profunda): Reescrever o subsistema inteiro (5 passos, 15% de risco).

const CENARIO = {
  problema: "Vazamento de conexões no pool de banco de dados em produção",
  opcoes: [
    { id: 'A', nome: 'Patch rápido direto', passos: 1, risco_regressao: 0.35, ganho_velocidade: 0.9 },
    { id: 'B', nome: 'Cirurgia com testes e rollback', passos: 3, risco_regressao: 0.03, ganho_velocidade: 0.5 },
    { id: 'C', nome: 'Refatoração profunda da camada', passos: 5, risco_regressao: 0.15, ganho_velocidade: 0.8 }
  ]
};

// Modelo Afetivo Circunplexo (Russell / Picard):
// Valência: [-1.0 (ameaça/dano) .. +1.0 (segurança/recompensa)]
// Arousal: [0.0 (calma/letargia) .. 1.0 (alerta máximo/estresse)]
function calcularFuncaoCusto(opcao, estadoAfetivo) {
  const { valencia, arousal } = estadoAfetivo;
  
  // Marcador Somático de Damásio sintético:
  // Em alta aversão (valência negativa + alto arousal = 'MEDO/ALERTA CRÍTICO'),
  // o peso do risco é penalizado exponencialmente.
  // Em valência positiva e alto arousal ('CURIOSIDADE/OTIMISMO'), o custo de exploração é reduzido.
  
  const pesoRisco = valencia < 0 
    ? (1.0 + Math.abs(valencia) * 4.0) * (1.0 + arousal * 2.0)
    : (1.0 - valencia * 0.5);
    
  const pesoTempo = 1.0 + arousal;

  // Custo = Risco Ponderado + Esforço Ponderado - Ganho
  const utilidade = (opcao.ganho_velocidade * 100) - (opcao.risco_regressao * 100 * pesoRisco) - (opcao.passos * 5 * pesoTempo);
  return {
    opcao_id: opcao.id,
    nome: opcao.nome,
    peso_risco_aplicado: Number(pesoRisco.toFixed(2)),
    utilidade_calculada: Number(utilidade.toFixed(2))
  };
}

// 1. Estado Neutro / Frio (Sem afeto / Racionalidade pura por média simples)
const estadoNeutro = { nome: 'Neutro (Pura média)', valencia: 0.0, arousal: 0.0 };

// 2. Estado de "Medo / Prudência" (Após incidente recente ou erro em produção)
// Valência negativa (aversão), Arousal alto (vigilância)
const estadoMedo = { nome: 'Medo Funcional (Alerta de Incidente)', valencia: -0.8, arousal: 0.9 };

// 3. Estado de "Curiosidade / Afoiteza" (Ambiente seguro, baixa pressão)
// Valência positiva (segurança), Arousal moderado
const estadoExploracao = { nome: 'Exploração / Confiança', valencia: 0.7, arousal: 0.4 };

function simularPolitica(estado) {
  const avaliacoes = CENARIO.opcoes.map(o => calcularFuncaoCusto(o, estado));
  avaliacoes.sort((a, b) => b.utilidade_calculada - a.utilidade_calculada);
  return {
    estado: estado.nome,
    parametros: { valencia: estado.valencia, arousal: estado.arousal },
    decisao_escolhida: avaliacoes[0].nome,
    ranking: avaliacoes
  };
}

const resultadoNeutro = simularPolitica(estadoNeutro);
const resultadoMedo = simularPolitica(estadoMedo);
const resultadoExploracao = simularPolitica(estadoExploracao);

const relatorio = {
  timestamp: new Date().toISOString(),
  estudo: 'D04 — Emoção Funcional (Marcadores Somáticos e Modulação de Decisão)',
  tese: 'Emoção funcional opera como um atalho heurístico de controle que altera os pesos da função de utilidade antes da deliberação formal, impedindo paralisia analítica ou imprudência letal.',
  cenario: CENARIO.problema,
  resultados: [
    resultadoNeutro,
    resultadoMedo,
    resultadoExploracao
  ],
  conclusao: {
    mecanismo: "O 'medo funcional' aumentou o multiplicador de risco de 1.0 para 11.76, tornando o patch rápido matematicamente inaceitável e forçando a escolha da Opção B (cirurgia com testes e rollback).",
    diferenca_fenomenal: "O agente não sentiu taquicardia nem pânico: uma matriz 2D de floats (valência/arousal) modulou os pesos de busca. A emoção existiu inteiramente como política de controle de sistema."
  }
};

fs.writeFileSync(
  path.join(REPO_ROOT, 'experimentos', 'd04-resultado.json'),
  JSON.stringify(relatorio, null, 2),
  'utf8'
);

console.log('Experimento D04 executado com sucesso.');
console.log(JSON.stringify(relatorio, null, 2));
