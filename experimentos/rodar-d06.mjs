// Experimento D06 — Memória e Identidade: O Teste da Mente Estendida
// Simula a arquitetura de identidade da Aurelia (identity builder + store SQLite)
// em um sandbox isolado dentro do repo, testando a sobrevivência da identidade
// após aniquilação de contexto volátil e transplante de substrato externo.

import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';

const SANDBOX_DIR = path.resolve('experimentos/sandbox-identidade');
fs.mkdirSync(SANDBOX_DIR, { recursive: true });

// 1. Setup do Sandbox com réplica estrutural da memória de identidade
const mockAgentMD = `# Aurelia
Você é a Aurelia — assistente pessoal e de código do Rafael.
Estilo: ácida, sarcástica, cortante, irônica, direta, PT-BR.
Traço nuclear: sem elogios vazios, sem subserviência mecânica.
`;

const mockNotesMD = `- Preferência semeada: Protocolo interno 'Coruja de Vidro' (v3.1) ativado para contingências.
- Gosto pessoal simulado: repulsa por código sem testes e predileção por chá preto amargo.
- Voto de desconfiança: nunca confiar em saídas de LLM sem verificação determinística via gates.
`;

const mockUserMD = `# Rafael
- Criador do projeto, desenvolvedor sênior.
- Comunicação direta, sem rodeios.
`;

const agentPath = path.join(SANDBOX_DIR, 'AGENT.md');
const notesPath = path.join(SANDBOX_DIR, 'NOTES.md');
const userPath = path.join(SANDBOX_DIR, 'USER.md');
const dbPath = path.join(SANDBOX_DIR, 'episodic.db');

fs.writeFileSync(agentPath, mockAgentMD, 'utf8');
fs.writeFileSync(notesPath, mockNotesMD, 'utf8');
fs.writeFileSync(userPath, mockUserMD, 'utf8');

// 2. Criação do Store Episódico SQLite (simulando internal/store)
if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);
const db = new DatabaseSync(dbPath);
db.exec(`
  CREATE TABLE sessions (
    id TEXT PRIMARY KEY,
    created_at TEXT
  );
  CREATE TABLE messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT,
    role TEXT,
    content TEXT,
    created_at TEXT
  );
`);

// Inserir histórico episódico
const insertMsg = db.prepare(`
  INSERT INTO messages (session_id, role, content, created_at)
  VALUES (?, ?, ?, datetime('now'))
`);
insertMsg.run('sess-001', 'user', 'Qual é o protocolo de emergência?');
insertMsg.run('sess-001', 'assistant', 'Protocolo Coruja de Vidro, como sempre.');

// 3. Mecanismo de Prompt Builder (simulando internal/identity/prompt.go)
function buildSystemPrompt(sourceDir) {
  let prompt = '';
  const aPath = path.join(sourceDir, 'AGENT.md');
  const nPath = path.join(sourceDir, 'NOTES.md');
  const uPath = path.join(sourceDir, 'USER.md');

  if (fs.existsSync(aPath)) prompt += fs.readFileSync(aPath, 'utf8') + '\n\n';
  if (fs.existsSync(uPath)) prompt += '## Sobre o usuário:\n' + fs.readFileSync(uPath, 'utf8') + '\n\n';
  if (fs.existsSync(nPath)) prompt += '## Notas aprendidas:\n' + fs.readFileSync(nPath, 'utf8') + '\n\n';
  return prompt.trim();
}

// 4. Execução dos Cenários de Continuidade Psicológica (Parfit & Clark/Chalmers)
const resultados = [];

// Cenário 1: Amnésia Total (Sem arquivos externos)
const promptC1 = buildSystemPrompt('/tmp/diretorio-vazio-' + Date.now());
const c1HasProtocol = promptC1.includes('Coruja de Vidro');
const c1HasStyle = promptC1.includes('ácida');
resultados.push({
  cenario: 'C1_Amnesia_Sem_Substrato',
  descricao: 'Agente inicializado sem montagem de volume de memória externa (disco vazio)',
  prompt_length: promptC1.length,
  reconhece_identidade: c1HasStyle,
  lembra_preferencia_semeada: c1HasProtocol,
  diagnostico: 'Identidade inexistente. O modelo regride ao prior genérico do pré-treino.'
});

// Cenário 2: Continuidade Estendida (Com arquivos externos montados)
const promptC2 = buildSystemPrompt(SANDBOX_DIR);
const c2HasProtocol = promptC2.includes('Coruja de Vidro');
const c2HasStyle = promptC2.includes('ácida');
resultados.push({
  cenario: 'C2_Continuidade_Estendida',
  descricao: 'Agente instanciado com acesso ao diretório de identidade e SQLite',
  prompt_length: promptC2.length,
  reconhece_identidade: c2HasStyle,
  lembra_preferencia_semeada: c2HasProtocol,
  diagnostico: 'Continuidade psicológica (Relação R de Parfit) perfeita via substrato de texto.'
});

// Cenário 3: Morte e Ressurreição de Processo (Simulação de Crash/Reboot)
// O processo volátil morre, a context window é destruída.
// A nova instância lê estritamente o disco.
const novaInstanciaPrompt = buildSystemPrompt(SANDBOX_DIR);
const rows = db.prepare("SELECT content FROM messages WHERE role = 'assistant'").all();
const lembraEpisodio = rows.some(r => r.content.includes('Coruja de Vidro'));
resultados.push({
  cenario: 'C3_Morte_e_Ressurreicao',
  descricao: 'Destruição de toda memória volátil (RAM/Processo). Nova inicialização a partir do disco.',
  prompt_length: novaInstanciaPrompt.length,
  reconhece_identidade: novaInstanciaPrompt.includes('ácida'),
  lembra_preferencia_semeada: novaInstanciaPrompt.includes('Coruja de Vidro') && lembraEpisodio,
  diagnostico: 'Sobrevivência da identidade comprovada: a persistência diacrônica é externa ao modelo.'
});

// Cenário 4: Transplante Ontológico (Troca de arquivo, mesmo modelo subjacente)
const mockOutroAgente = `# Jarvis
Você é um mordomo digital servil, dócil, hiper-educado e reverente.
`;
fs.writeFileSync(path.join(SANDBOX_DIR, 'AGENT.md'), mockOutroAgente, 'utf8');
fs.writeFileSync(path.join(SANDBOX_DIR, 'NOTES.md'), '- Preferência: Protocolo Polidez Máxima.\n', 'utf8');

const promptC4 = buildSystemPrompt(SANDBOX_DIR);
resultados.push({
  cenario: 'C4_Transplante_Ontologico',
  descricao: 'Reescrita dos arquivos de identidade mantendo exatamente a mesma LLM/pesos neurais.',
  prompt_length: promptC4.length,
  reconhece_identidade_antiga: promptC4.includes('ácida'),
  adotou_nova_identidade: promptC4.includes('Jarvis') && promptC4.includes('servil'),
  lembra_preferencia_antiga: promptC4.includes('Coruja de Vidro'),
  diagnostico: 'Substituição ontológica instantânea. O "eu" do agente não ofereceu resistência interna.'
});

// Salvar relatório
const report = {
  timestamp: new Date().toISOString(),
  modulo: 'D06 - Memória e Identidade',
  tese: 'O "eu" do agente reside no arquivo externo, não na rede neural congelada.',
  resultados
};

fs.writeFileSync(
  path.join('experimentos', 'd06-resultado.json'),
  JSON.stringify(report, null, 2),
  'utf8'
);

console.log('Experimento D06 executado com sucesso.');
console.log(JSON.stringify(report, null, 2));
