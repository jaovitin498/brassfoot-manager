/* ============================================================
   BRASFOOT MANAGER — main.js
   Toda a lógica do jogo em JavaScript puro.
   Organizado em módulos comentados para fácil manutenção.

   ÍNDICE DE MÓDULOS:
   1.  DADOS          — Times, nomes e constantes
   2.  ESTADO         — Variáveis globais da sessão
   3.  INICIALIZAÇÃO  — Ponto de entrada e loading
   4.  SELEÇÃO        — Escolha do clube inicial
   5.  GERAÇÃO        — Elencos e jogadores procedurais
   6.  CALENDÁRIO     — Round-robin do Brasileirão
   7.  MERCADO LIVRE  — Jogadores disponíveis para contratar
   8.  NAVEGAÇÃO      — Troca de telas
   9.  DASHBOARD      — Tela principal
   10. ELENCO         — Lista de jogadores do clube
   11. ESCALAÇÃO      — Campo visual e formações
   12. TABELA         — Classificação do campeonato
   13. CALENDÁRIO UI  — Visualização de rodadas
   14. ARTILHARIA     — Ranking de gols
   15. SIMULAÇÃO      — Motor de partidas
   16. TRANSFERÊNCIAS — Mercado e propostas de IA
   17. IA DOS CLUBES  — Movimentações automáticas
   18. NOVA TEMPORADA — Reset e avanço de ano
   19. UTILITÁRIOS    — Funções auxiliares
   20. SAVE/LOAD      — Persistência no LocalStorage
   ============================================================ */


/* ============================================================
   1. DADOS — Times, nomes e constantes estáticas
   ============================================================ */

// Banco de dados dos times brasileiros e da Série B
const TIMES_DADOS = [
  // ── Série A ──────────────────────────────────────────────
  { id:  1, nome: 'Flamengo',     escudo: '🔴', cores: '#ff0000', serie: 'A', cidade: 'Rio de Janeiro',    overall: 84, dinheiro: 90,  estadio: 'Maracanã'           },
  { id:  2, nome: 'Palmeiras',    escudo: '💚', cores: '#006400', serie: 'A', cidade: 'São Paulo',         overall: 82, dinheiro: 90,  estadio: 'Allianz Parque'     },
  { id:  3, nome: 'Atlético-MG',  escudo: '⚫', cores: '#000000', serie: 'A', cidade: 'Belo Horizonte',   overall: 80, dinheiro: 70,  estadio: 'Arena MRV'          },
  { id:  4, nome: 'Fluminense',   escudo: '🟣', cores: '#660066', serie: 'A', cidade: 'Rio de Janeiro',   overall: 78, dinheiro: 55,  estadio: 'Maracanã'           },
  { id:  5, nome: 'Internacional',escudo: '🔴', cores: '#cc0000', serie: 'A', cidade: 'Porto Alegre',     overall: 77, dinheiro: 60,  estadio: 'Beira-Rio'          },
  { id:  6, nome: 'São Paulo',    escudo: '⚪', cores: '#ff0000', serie: 'A', cidade: 'São Paulo',         overall: 79, dinheiro: 65,  estadio: 'Morumbis'           },
  { id:  7, nome: 'Grêmio',       escudo: '🔵', cores: '#0000cc', serie: 'A', cidade: 'Porto Alegre',     overall: 76, dinheiro: 55,  estadio: 'Arena do Grêmio'    },
  { id:  8, nome: 'Botafogo',     escudo: '⚫', cores: '#111111', serie: 'A', cidade: 'Rio de Janeiro',   overall: 77, dinheiro: 62,  estadio: 'Nilton Santos'      },
  { id:  9, nome: 'Corinthians',  escudo: '⚫', cores: '#000000', serie: 'A', cidade: 'São Paulo',         overall: 75, dinheiro: 58,  estadio: 'Neo Química Arena'  },
  { id: 10, nome: 'Santos',       escudo: '⚪', cores: '#ffffff', serie: 'A', cidade: 'Santos',            overall: 73, dinheiro: 45,  estadio: 'Vila Belmiro'       },
  { id: 11, nome: 'Cruzeiro',     escudo: '🔵', cores: '#0000cc', serie: 'A', cidade: 'Belo Horizonte',   overall: 74, dinheiro: 48,  estadio: 'Mineirão'           },
  { id: 12, nome: 'Vasco',        escudo: '⚫', cores: '#000000', serie: 'A', cidade: 'Rio de Janeiro',   overall: 72, dinheiro: 42,  estadio: 'São Januário'       },
  { id: 13, nome: 'Athletico-PR', escudo: '🔴', cores: '#cc0000', serie: 'A', cidade: 'Curitiba',         overall: 74, dinheiro: 50,  estadio: 'Ligga Arena'        },
  { id: 14, nome: 'Fortaleza',    escudo: '🔴', cores: '#cc0000', serie: 'A', cidade: 'Fortaleza',        overall: 73, dinheiro: 46,  estadio: 'Arena Castelão'     },
  { id: 15, nome: 'Bahia',        escudo: '🔵', cores: '#0000cc', serie: 'A', cidade: 'Salvador',         overall: 71, dinheiro: 40,  estadio: 'Arena Fonte Nova'   },
  { id: 16, nome: 'Bragantino',   escudo: '⚫', cores: '#cc0000', serie: 'A', cidade: 'Bragança Paulista',overall: 72, dinheiro: 44,  estadio: 'Nabi Abi Chedid'   },
  { id: 17, nome: 'Goiás',        escudo: '💚', cores: '#006400', serie: 'A', cidade: 'Goiânia',          overall: 68, dinheiro: 35,  estadio: 'Serra Dourada'      },
  { id: 18, nome: 'Cuiabá',       escudo: '🟡', cores: '#ffcc00', serie: 'A', cidade: 'Cuiabá',           overall: 67, dinheiro: 32,  estadio: 'Arena Pantanal'     },
  { id: 19, nome: 'Coritiba',     escudo: '💚', cores: '#006400', serie: 'A', cidade: 'Curitiba',         overall: 66, dinheiro: 30,  estadio: 'Couto Pereira'      },
  { id: 20, nome: 'América-MG',   escudo: '🐰', cores: '#006400', serie: 'A', cidade: 'Belo Horizonte',   overall: 65, dinheiro: 28,  estadio: 'Arena Independência'},
  // ── Série B ──────────────────────────────────────────────
  { id: 21, nome: 'Chapecoense',  escudo: '💚', cores: '#006400', serie: 'B', cidade: 'Chapecó',          overall: 63, dinheiro: 22,  estadio: 'Arena Condá'        },
  { id: 22, nome: 'Vila Nova',    escudo: '🔴', cores: '#cc0000', serie: 'B', cidade: 'Goiânia',          overall: 61, dinheiro: 20,  estadio: 'OBA'                },
  { id: 23, nome: 'Sport',        escudo: '🔴', cores: '#cc0000', serie: 'B', cidade: 'Recife',           overall: 64, dinheiro: 25,  estadio: 'Ilha do Retiro'     },
  { id: 24, nome: 'Ponte Preta',  escudo: '⚫', cores: '#000000', serie: 'B', cidade: 'Campinas',         overall: 62, dinheiro: 21,  estadio: 'Moisés Lucarelli'   },
];

// Banco de nomes para geração procedural de jogadores
const NOMES_BR      = ['Lucas','Gabriel','Matheus','Rafael','Bruno','Pedro','Diego','Carlos','Felipe','João','Eduardo','Renato','Vinícius','Thiago','Rodrigo','André','Márcio','Leandro','Marcos','Gustavo','Alex','William','Claudinho','Yago','Pablo','Douglas','Éverton','Marlon','Renan','Alan','Erick','Michel','Patrick','Nathan','Eric','Mateus','Guilherme','Victor','Nicolas','Cauê'];
const SOBRENOMES_BR = ['Silva','Santos','Souza','Oliveira','Ferreira','Alves','Pereira','Lima','Costa','Ribeiro','Carvalho','Gomes','Martins','Rocha','Neves','Araújo','Rodrigues','Cruz','Mendes','Barros','Nascimento','Moura','Vieira','Cavalcante','Machado','Andrade','Freitas','Lopes','Cardoso','Peixoto'];
const NOMES_ARG     = ['Rodrigo','Juan','Diego','Lionel','Sergio','Nicolás','Lucas','Lautaro','Ángel','Federico','Enzo','Alejandro','Emiliano','Marcos','Gonzalo','Franco','Matías','Leandro','Nahuel','Exequiel'];
const SOBRENOMES_ARG= ['González','Rodríguez','López','García','Fernández','Martínez','Díaz','Pérez','Gómez','Sánchez','Torres','Ramírez','Flores','Jiménez','Medina','Castro','Álvarez','Rojas','Vega','Muñoz'];

// Emojis de bandeira por código de nacionalidade
const NACIONALIDADES = {
  BR: '🇧🇷', AR: '🇦🇷', UY: '🇺🇾', CO: '🇨🇴',
  PT: '🇵🇹', IT: '🇮🇹', ES: '🇪🇸', FR: '🇫🇷',
};

// Definição de formações: linhas (qtd + posições) e lista linear de posições
const FORMACOES = {
  '4-3-3':   {
    linhas:   [[1,'GK'],[4,'ZA','ZA','LD','LE'],[3,'VOL','MC','MC'],[3,'PE','CA','PD']],
    posicoes: ['GK','ZA','ZA','LD','LE','VOL','MC','MC','PE','CA','PD'],
  },
  '4-4-2':   {
    linhas:   [[1,'GK'],[4,'ZA','ZA','LD','LE'],[4,'MD','VOL','VOL','ME'],[2,'CA','CA']],
    posicoes: ['GK','ZA','ZA','LD','LE','MD','VOL','VOL','ME','CA','CA'],
  },
  '4-2-3-1': {
    linhas:   [[1,'GK'],[4,'ZA','ZA','LD','LE'],[2,'VOL','VOL'],[3,'MO','MO','MO'],[1,'CA']],
    posicoes: ['GK','ZA','ZA','LD','LE','VOL','VOL','MO','MO','MO','CA'],
  },
};


/* ============================================================
   2. ESTADO — Variáveis globais da sessão atual
   ============================================================ */

// Objeto central do jogo. É salvo e carregado do LocalStorage.
let estado = {
  meuTimeId:      null,  // ID do clube escolhido pelo jogador
  temporada:      2026,  // Ano da temporada atual
  rodadaAtual:    1,     // Rodada que está para ser jogada
  totalRodadas:   38,
  times:          [],    // Lista de times com estatísticas da temporada
  jogadores:      {},    // { timeId: [jogador, ...] }
  calendario:     [],    // [ { rodada, jogos: [{casa,fora,...}] } ]
  transferencias: [],    // Jogadores no mercado livre
  notificacoes:   [],    // Propostas de compra recebidas
  escalacaoAtual: {
    formacao: '4-3-3',
    estilo:   'equilibrado',
    titulares: [],       // IDs dos 11 titulares
  },
  resultados:     [],    // Histórico de partidas simuladas
  acelerado:      false, // Flag de simulação acelerada
};


/* ============================================================
   3. INICIALIZAÇÃO — Ponto de entrada do jogo
   ============================================================ */

// Executado quando o DOM está pronto
window.addEventListener('DOMContentLoaded', () => {
  // Tenta carregar um save existente no LocalStorage
  const save = localStorage.getItem('bfmgr_save');
  if (save) {
    try {
      const dados = JSON.parse(save);
      Object.assign(estado, dados);
      iniciarJogo(true); // continua do ponto salvo
      return;
    } catch (e) {
      // Save corrompido → ignora e inicia do zero
    }
  }
  // Aguarda a animação de loading e exibe a seleção de clube
  setTimeout(() => {
    document.getElementById('loading-screen').style.display = 'none';
    mostrarSelecao();
  }, 2200);
});


/* ============================================================
   4. SELEÇÃO DE CLUBE
   ============================================================ */

// Exibe a tela de seleção com todos os times
function mostrarSelecao() {
  document.getElementById('tela-selecao').style.display = 'block';
  renderizarGridTimes(TIMES_DADOS);
}

// Filtra os times por série ao clicar nos botões de filtro
function filtrarSerie(serie) {
  // Atualiza o botão ativo
  document.querySelectorAll('.btn-filtro').forEach(b => b.classList.remove('ativo'));
  event.target.classList.add('ativo');

  const lista = serie === 'todos'
    ? TIMES_DADOS
    : TIMES_DADOS.filter(t => t.serie === serie);

  renderizarGridTimes(lista);
}

// Gera os cards de times no grid de seleção
function renderizarGridTimes(lista) {
  const grid = document.getElementById('grid-times');
  grid.innerHTML = lista.map(t => `
    <div class="card-time-selecao" onclick="selecionarTime(${t.id})">
      <div class="escudo-grande">${t.escudo}</div>
      <div class="nome-time-selecao">${t.nome}</div>
      <div class="overall-badge ${t.overall >= 80 ? 'alto' : t.overall >= 72 ? 'medio' : 'baixo'}">${t.overall} OVR</div>
      <div class="serie-badge ${t.serie}">SÉRIE ${t.serie}</div>
    </div>
  `).join('');
}

// Chamado quando o jogador clica em um time na tela de seleção
function selecionarTime(timeId) {
  estado.meuTimeId = timeId;

  // Clonar times adicionando campos de estatísticas zerados
  estado.times = TIMES_DADOS.map(t => ({
    ...t,
    pontos: 0, vitorias: 0, empates: 0, derrotas: 0,
    golsPro: 0, golsContra: 0, jogos: 0,
    dinheiro: t.dinheiro * 1_000_000, // converte de M para R$
  }));

  // Gerar elencos para todos os times
  estado.times.forEach(t => {
    estado.jogadores[t.id] = gerarElenco(t);
  });

  // Definir escalação inicial automática
  const posicoes = FORMACOES[estado.escalacaoAtual.formacao].posicoes;
  estado.escalacaoAtual.titulares = escalarAutomatico(
    estado.jogadores[timeId], posicoes
  );

  // Gerar calendário e mercado livre
  gerarCalendario();
  gerarMercadoLivre();

  iniciarJogo(false);
  salvarEstado();
}


/* ============================================================
   5. GERAÇÃO DE ELENCOS E JOGADORES
   ============================================================ */

// Gera o elenco completo de um time (22 jogadores)
function gerarElenco(time) {
  // Distribuição de posições para um elenco realista
  const posicoes = [
    'GK','GK',
    'ZA','ZA','ZA','LE','LD',
    'VOL','VOL','MC','MC','MO',
    'PE','PD','CA','CA',
    'ZA','LE','MC','CA','VOL','PE',
  ];
  return posicoes.map((pos, i) => gerarJogador(pos, time.overall, i, time.id));
}

// Cria um jogador individual com atributos baseados no overall do time
function gerarJogador(pos, baseOverall, idx, timeId) {
  // 75% de chance de ser brasileiro
  const br = Math.random() < 0.75;
  const nome = br
    ? `${aleatorio(NOMES_BR)} ${aleatorio(SOBRENOMES_BR)}`
    : `${aleatorio(NOMES_ARG)} ${aleatorio(SOBRENOMES_ARG)}`;
  const nac = br ? 'BR' : (Math.random() < 0.5 ? 'AR' : 'UY');

  const idade   = 17 + Math.floor(Math.random() * 18); // 17–34 anos
  const variacao = Math.floor((Math.random() - 0.5) * 20);
  const overall  = Math.min(99, Math.max(50, baseOverall + variacao));

  // Jovens têm potencial maior
  const potencialBonus = idade < 22 ? Math.floor(Math.random() * 10) : 0;
  const potencial = Math.min(99, overall + potencialBonus);

  const stamina = 85 + Math.floor(Math.random() * 15);
  const valor   = calcularValor(overall, idade);
  const salario = Math.floor(valor * 0.03); // salário ≈ 3% do valor

  return {
    // ID único: combinação de time + índice + timestamp
    id: `j_${timeId}_${idx}_${Date.now() + idx}`,
    nome, pos, idade, nac, overall, potencial, stamina,
    valor, salario, timeId, gols: 0,
  };
}

// Calcula o valor de mercado em reais com base no overall e idade
function calcularValor(overall, idade) {
  const base = Math.pow(overall - 50, 2.2) * 8000;
  let mult = 1;
  if      (idade < 21)  mult = 1.3;
  else if (idade < 26)  mult = 1.1;
  else if (idade > 33)  mult = 0.4;
  else if (idade > 30)  mult = 0.7;
  return Math.floor(base * mult);
}

// Escala automaticamente os melhores jogadores para cada posição necessária
function escalarAutomatico(elenco, posicoes) {
  const usados = new Set();
  return posicoes.map(pos => {
    const compat    = getPosicoesCompativeis(pos);
    const candidatos = elenco
      .filter(j => compat.includes(j.pos) && !usados.has(j.id))
      .sort((a, b) => b.overall - a.overall);

    if (candidatos.length) {
      usados.add(candidatos[0].id);
      return candidatos[0].id;
    }
    // Fallback: qualquer jogador ainda disponível
    const fallback = elenco.find(j => !usados.has(j.id));
    if (fallback) { usados.add(fallback.id); return fallback.id; }
    return null;
  }).filter(Boolean);
}

// Define quais posições são compatíveis entre si (para escalação flexível)
function getPosicoesCompativeis(pos) {
  const mapa = {
    GK:  ['GK'],
    ZA:  ['ZA'],
    LD:  ['LD','ZA'],
    LE:  ['LE','ZA'],
    VOL: ['VOL','MC'],
    MC:  ['MC','VOL','MO'],
    MO:  ['MO','MC','PE','PD'],
    MD:  ['MD','LD','MC'],
    ME:  ['ME','LE','MC'],
    PE:  ['PE','CA','MO'],
    PD:  ['PD','CA','MO'],
    CA:  ['CA','PE','PD'],
  };
  return mapa[pos] || [pos];
}


/* ============================================================
   6. CALENDÁRIO — Geração do Brasileirão (round-robin)
   ============================================================ */

// Gera as 38 rodadas do campeonato usando algoritmo round-robin
function gerarCalendario() {
  const timesSerieA = estado.times.filter(t => t.serie === 'A');
  const ids = timesSerieA.map(t => t.id);
  const n   = ids.length; // 20 times
  const rodadas = [];
  let lista = [...ids];

  // Turno (rodadas 1–19)
  for (let r = 0; r < n - 1; r++) {
    const jogos = [];
    for (let i = 0; i < n / 2; i++) {
      jogos.push({
        casa: lista[i], fora: lista[n - 1 - i],
        rodada: r + 1, simulado: false, golsCasa: 0, golsFora: 0,
      });
    }
    rodadas.push({ rodada: r + 1, jogos });
    // Rotação circular (o índice 0 é fixo)
    lista = [lista[0], lista[n - 1], ...lista.slice(1, n - 1)];
  }

  // Returno (rodadas 20–38): invertendo casa/fora do turno
  for (let r = 0; r < n - 1; r++) {
    const jogos = rodadas[r].jogos.map(j => ({
      casa: j.fora, fora: j.casa,
      rodada: r + n, simulado: false, golsCasa: 0, golsFora: 0,
    }));
    rodadas.push({ rodada: r + n, jogos });
  }

  estado.calendario = rodadas.slice(0, 38);
}


/* ============================================================
   7. MERCADO LIVRE — Jogadores sem clube disponíveis
   ============================================================ */

// Gera 30 jogadores livres no mercado inicial
function gerarMercadoLivre() {
  estado.transferencias = [];
  const posicoes = ['GK','ZA','LD','LE','VOL','MC','MO','PE','PD','CA'];
  for (let i = 0; i < 30; i++) {
    const pos     = aleatorio(posicoes);
    const overall = 60 + Math.floor(Math.random() * 25); // 60–84
    const j = gerarJogador(pos, overall, i + 900, 0);
    j.timeId = 0; // 0 = sem clube
    estado.transferencias.push(j);
  }
}


/* ============================================================
   8. NAVEGAÇÃO — Troca de telas
   ============================================================ */

// Inicia o jogo após a seleção (ou carregamento do save)
function iniciarJogo(fromSave) {
  document.getElementById('loading-screen').style.display = 'none';
  document.getElementById('tela-selecao').style.display   = 'none';
  document.getElementById('jogo').style.display           = 'block';

  const meuTime = getMeuTime();
  document.getElementById('tb-escudo').textContent    = meuTime.escudo;
  document.getElementById('tb-nome-time').textContent = meuTime.nome;

  atualizarTopBar();
  navegarPara('dashboard');
}

// Troca a tela visível e chama o render correspondente
function navegarPara(tela) {
  document.querySelectorAll('.tela').forEach(t   => t.classList.remove('ativa'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('ativo'));

  document.getElementById('tela-' + tela).classList.add('ativa');

  // Ativa o item de nav correspondente
  document.querySelectorAll('.nav-item').forEach(n => {
    if (n.getAttribute('onclick')?.includes(tela)) n.classList.add('ativo');
  });

  // Renderiza a tela ativada
  const renders = {
    dashboard:      renderDashboard,
    elenco:         renderElenco,
    escalacao:      renderEscalacao,
    tabela:         renderTabela,
    calendario:     renderCalendario,
    artilharia:     renderArtilharia,
    transferencias: renderTransferencias,
  };
  renders[tela]?.();
}


/* ============================================================
   9. DASHBOARD — Tela principal do clube
   ============================================================ */

function renderDashboard() {
  const mt = getMeuTime();
  document.getElementById('dash-temporada').textContent = estado.temporada;
  document.getElementById('elenco-nome-time').textContent = '— ' + mt.nome.toUpperCase();

  // ── Cards de estatísticas ──
  const sg = mt.golsPro - mt.golsContra;
  const cardsData = [
    { label: 'Posição',    valor: getPosicaoTime(mt.id) + 'º', cls: 'amarelo' },
    { label: 'Pontos',     valor: mt.pontos,                   cls: 'verde'   },
    { label: 'Saldo Gols', valor: (sg >= 0 ? '+' : '') + sg,  cls: sg >= 0 ? 'verde' : 'vermelho' },
    { label: 'Finanças',   valor: 'R$' + formatarDinheiro(mt.dinheiro), cls: mt.dinheiro >= 0 ? 'verde' : 'vermelho' },
  ];
  document.getElementById('dash-cards').innerHTML = cardsData.map(c => `
    <div class="stat-card">
      <div class="label">${c.label}</div>
      <div class="valor ${c.cls}">${c.valor}</div>
    </div>
  `).join('');

  // ── Próximos jogos ──
  const proximos = getProximosJogos(3);
  const listaProx = document.getElementById('lista-proximos-jogos');
  const btnSimular = document.getElementById('btn-simular');

  if (!proximos.length) {
    listaProx.innerHTML = '<div style="color:var(--text-muted);font-size:13px;padding:10px 0;">Temporada encerrada!</div>';
    btnSimular.textContent = '🔄 NOVA TEMPORADA';
    btnSimular.onclick = novaTemporada;
  } else {
    btnSimular.textContent = '▶ SIMULAR JOGO';
    btnSimular.onclick = simularProximoJogo;
    listaProx.innerHTML = proximos.map(j => {
      const casa = getTimeById(j.casa);
      const fora = getTimeById(j.fora);
      const ehCasa = j.casa === estado.meuTimeId;
      return `
        <div class="jogo-item">
          <span class="rodada-tag">ROD ${j.rodada}</span>
          <div class="times-jogo">
            <span>${casa.escudo} ${casa.nome}</span>
            <span class="vs">×</span>
            <span>${fora.escudo} ${fora.nome}</span>
          </div>
          <span class="local-tag ${ehCasa ? 'casa' : ''}">${ehCasa ? 'CASA' : 'FORA'}</span>
        </div>`;
    }).join('');
  }

  // ── Últimos resultados ──
  const ultimos = estado.resultados.slice(-4).reverse();
  document.getElementById('lista-ultimos-resultados').innerHTML = ultimos.length
    ? ultimos.map(r => {
        const casa = getTimeById(r.casa);
        const fora = getTimeById(r.fora);
        let cls = 'text-dim';
        if (r.casa === estado.meuTimeId || r.fora === estado.meuTimeId) {
          const ganhei  = (r.casa === estado.meuTimeId && r.golsCasa > r.golsFora)
                       || (r.fora === estado.meuTimeId && r.golsFora > r.golsCasa);
          const empatou = r.golsCasa === r.golsFora;
          cls = ganhei ? 'text-green' : empatou ? 'text-yellow' : 'text-red';
        }
        return `
          <div class="jogo-item">
            <span class="rodada-tag">ROD ${r.rodada}</span>
            <div class="times-jogo ${cls}">
              <span>${casa.escudo} ${casa.nome}</span>
              <span class="vs">${r.golsCasa} – ${r.golsFora}</span>
              <span>${fora.escudo} ${fora.nome}</span>
            </div>
          </div>`;
      }).join('')
    : '<div style="color:var(--text-muted);font-size:13px;padding:10px 0;">Nenhum resultado ainda.</div>';

  // ── Mini tabela top 6 ──
  const clas = getClassificacao().slice(0, 6);
  document.getElementById('dash-mini-tabela').innerHTML = `
    <table class="tabela-estilo">
      <thead><tr><th>#</th><th>Clube</th><th>PJ</th><th>PTS</th><th>SG</th></tr></thead>
      <tbody>
        ${clas.map((t, i) => `
          <tr class="${t.id === estado.meuTimeId ? 'destaque-meu-time' : ''}">
            <td class="pos-num ${i < 4 ? 'g4' : i >= 17 ? 'rebaixamento' : ''}">${i + 1}</td>
            <td><span class="escudo-mini">${t.escudo}</span>${t.nome}</td>
            <td class="font-mono">${t.jogos}</td>
            <td class="font-mono text-green">${t.pontos}</td>
            <td class="font-mono">${t.golsPro - t.golsContra >= 0 ? '+' : ''}${t.golsPro - t.golsContra}</td>
          </tr>`).join('')}
      </tbody>
    </table>`;
}


/* ============================================================
   10. ELENCO — Lista de jogadores do clube do usuário
   ============================================================ */

let ordemElenco = 'pos'; // critério atual de ordenação

function renderElenco() {
  const mt = getMeuTime();
  document.getElementById('elenco-nome-time').textContent = '— ' + mt.nome.toUpperCase();
  ordenarElenco(ordemElenco);
}

function ordenarElenco(criterio) {
  ordemElenco = criterio;
  const elenco   = estado.jogadores[estado.meuTimeId] || [];
  const ordemPos = ['GK','ZA','LD','LE','VOL','MC','MO','MD','ME','PE','PD','CA'];
  let lista = [...elenco];

  if      (criterio === 'pos')     lista.sort((a, b) => ordemPos.indexOf(a.pos) - ordemPos.indexOf(b.pos));
  else if (criterio === 'overall') lista.sort((a, b) => b.overall - a.overall);
  else if (criterio === 'idade')   lista.sort((a, b) => a.idade   - b.idade);

  const titulares = new Set(estado.escalacaoAtual.titulares);

  document.getElementById('lista-elenco').innerHTML = lista.map(j => `
    <div class="jogador-row ${titulares.has(j.id) ? 'titular-destaque' : ''}">
      <span class="pos-tag ${j.pos}">${j.pos}</span>
      <span class="nome-j">
        ${j.nome}
        ${titulares.has(j.id) ? '<span style="font-size:9px;color:var(--green);margin-left:4px;">TIT</span>' : ''}
      </span>
      <span class="idade-j">${j.idade}</span>
      <span class="nat-j">${NACIONALIDADES[j.nac] || '🌍'}</span>
      <span class="overall-badge ${j.overall >= 80 ? 'alto' : j.overall >= 70 ? 'medio' : 'baixo'}">${j.overall}</span>
      <span class="valor-j">${formatarDinheiro(j.valor)}</span>
      <button class="btn btn-vermelho" style="font-size:10px;padding:5px 10px;"
              onclick="venderJogadorElenco('${j.id}')">VENDER</button>
    </div>
  `).join('');
}

// Vende um jogador do elenco diretamente (sem negociação)
function venderJogadorElenco(jid) {
  const elenco = estado.jogadores[estado.meuTimeId];
  const idx    = elenco.findIndex(j => j.id === jid);
  if (idx === -1) return;
  if (elenco.length <= 14) { toast('Elenco muito pequeno para vender!', 'erro'); return; }

  const j = elenco[idx];
  getMeuTime().dinheiro += j.valor;
  elenco.splice(idx, 1);
  // Remove dos titulares se necessário
  estado.escalacaoAtual.titulares = estado.escalacaoAtual.titulares.filter(id => id !== jid);

  toast(`${j.nome} vendido por ${formatarDinheiro(j.valor)}!`, 'ok');
  atualizarTopBar();
  salvarEstado();
  renderElenco();
}


/* ============================================================
   11. ESCALAÇÃO — Campo visual e controles táticos
   ============================================================ */

function renderEscalacao() {
  const elenco = estado.jogadores[estado.meuTimeId] || [];
  document.getElementById('sel-formacao').value = estado.escalacaoAtual.formacao;
  document.getElementById('sel-estilo').value   = estado.escalacaoAtual.estilo;
  renderCampo(elenco);
  renderBanco(elenco);
}

// Desenha o campo com os jogadores nas posições corretas
function renderCampo(elenco) {
  const campo   = document.getElementById('campo-visual');
  const formacao = FORMACOES[estado.escalacaoAtual.formacao];
  campo.innerHTML = '';

  const numLinhas = formacao.linhas.length;

  formacao.linhas.forEach((linha, li) => {
    const numJog   = linha[0];
    const posicoes = linha.slice(1);
    // Distribui verticalmente: goleiro embaixo (85%), ataque em cima (15%)
    const percY = 85 - (li / (numLinhas - 1)) * 70;

    const divLinha = document.createElement('div');
    divLinha.className  = 'linha-formacao';
    divLinha.style.top  = percY + '%';

    // Calcular índice linear desta linha dentro da formação
    let idxLinear = 0;
    for (let ll = 0; ll < li; ll++) idxLinear += formacao.linhas[ll][0];

    for (let i = 0; i < numJog; i++) {
      const jid     = estado.escalacaoAtual.titulares[idxLinear + i];
      const jogador = jid ? elenco.find(j => j.id === jid) : null;

      const div = document.createElement('div');
      div.className = 'jogador-campo ' + (jogador ? 'titular' : '');
      div.innerHTML = `
        <div class="jogador-circulo">${posicoes[i] || '?'}</div>
        <div class="jc-nome">${jogador ? jogador.nome.split(' ')[0] : '—'}</div>
      `;
      divLinha.appendChild(div);
    }
    campo.appendChild(divLinha);
  });
}

// Renderiza a lista de jogadores no banco (não titulares)
function renderBanco(elenco) {
  const titIds = new Set(estado.escalacaoAtual.titulares);
  const banco  = elenco.filter(j => !titIds.has(j.id));

  document.getElementById('lista-banco').innerHTML = banco.map(j => `
    <div class="jogador-row">
      <span class="pos-tag ${j.pos}">${j.pos}</span>
      <span class="nome-j">${j.nome}</span>
      <span class="idade-j">${j.idade}</span>
      <span class="nat-j">${NACIONALIDADES[j.nac] || '🌍'}</span>
      <span class="overall-badge ${j.overall >= 80 ? 'alto' : j.overall >= 70 ? 'medio' : 'baixo'}">${j.overall}</span>
    </div>
  `).join('');
}

// Troca de formação: reescala automaticamente
function mudarFormacao(val) {
  estado.escalacaoAtual.formacao = val;
  const elenco   = estado.jogadores[estado.meuTimeId] || [];
  const posicoes = FORMACOES[val].posicoes;
  estado.escalacaoAtual.titulares = escalarAutomatico(elenco, posicoes);
  renderEscalacao();
}

// Salva o estilo tático selecionado
function mudarEstilo(val) {
  estado.escalacaoAtual.estilo = val;
}

// Persiste a escalação atual
function salvarEscalacao() {
  salvarEstado();
  toast('Escalação salva!', 'ok');
}


/* ============================================================
   12. TABELA — Classificação do Brasileirão Série A
   ============================================================ */

function renderTabela() {
  const clas = getClassificacao();
  document.getElementById('tbody-tabela').innerHTML = clas.map((t, i) => {
    const sg = t.golsPro - t.golsContra;
    let posCls = '';
    if (i < 4)       posCls = 'g4';
    else if (i >= 17) posCls = 'rebaixamento';

    return `
      <tr class="${t.id === estado.meuTimeId ? 'destaque-meu-time' : ''}">
        <td class="pos-num ${posCls}">${i + 1}</td>
        <td><span class="escudo-mini">${t.escudo}</span><span class="nome-time-tabela">${t.nome}</span></td>
        <td class="font-mono">${t.jogos}</td>
        <td class="font-mono">${t.vitorias}</td>
        <td class="font-mono">${t.empates}</td>
        <td class="font-mono">${t.derrotas}</td>
        <td class="font-mono">${t.golsPro}</td>
        <td class="font-mono">${t.golsContra}</td>
        <td class="font-mono ${sg > 0 ? 'text-green' : sg < 0 ? 'text-red' : ''}">${sg > 0 ? '+' : ''}${sg}</td>
        <td class="font-mono text-green" style="font-weight:bold">${t.pontos}</td>
      </tr>`;
  }).join('');
}

// Retorna times da Série A ordenados pelos critérios do Brasileirão
function getClassificacao() {
  return estado.times
    .filter(t => t.serie === 'A')
    .sort((a, b) => {
      if (b.pontos !== a.pontos)                       return b.pontos - a.pontos;
      if ((b.golsPro - b.golsContra) !== (a.golsPro - a.golsContra))
        return (b.golsPro - b.golsContra) - (a.golsPro - a.golsContra);
      return b.golsPro - a.golsPro;
    });
}

// Retorna a posição de um time na classificação (começa em 1)
function getPosicaoTime(id) {
  return getClassificacao().findIndex(t => t.id === id) + 1;
}


/* ============================================================
   13. CALENDÁRIO UI — Visualização das rodadas do clube
   ============================================================ */

function renderCalendario() {
  const container = document.getElementById('lista-calendario');
  // Filtra apenas as rodadas que envolvem o time do jogador
  const minhasRodadas = estado.calendario.filter(rod =>
    rod.jogos.some(j => j.casa === estado.meuTimeId || j.fora === estado.meuTimeId)
  );

  container.innerHTML = minhasRodadas.slice(0, 20).map(rod => {
    const meuJogo = rod.jogos.find(j => j.casa === estado.meuTimeId || j.fora === estado.meuTimeId);
    const casa    = getTimeById(meuJogo.casa);
    const fora    = getTimeById(meuJogo.fora);
    const ehCasa  = meuJogo.casa === estado.meuTimeId;
    const sim     = meuJogo.simulado;

    let clsRes = '';
    if (sim) {
      const ganhei  = (ehCasa && meuJogo.golsCasa > meuJogo.golsFora)
                   || (!ehCasa && meuJogo.golsFora > meuJogo.golsCasa);
      const empatou = meuJogo.golsCasa === meuJogo.golsFora;
      clsRes = ganhei ? 'text-green' : empatou ? 'text-yellow' : 'text-red';
    }

    return `
      <div class="jogo-item">
        <span class="rodada-tag">ROD ${rod.rodada}</span>
        <div class="times-jogo ${clsRes}">
          <span>${casa.escudo} ${casa.nome}</span>
          <span class="vs">${sim ? meuJogo.golsCasa + ' – ' + meuJogo.golsFora : '×'}</span>
          <span>${fora.escudo} ${fora.nome}</span>
        </div>
        <span class="local-tag ${ehCasa ? 'casa' : ''}">${ehCasa ? 'CASA' : 'FORA'}</span>
        ${!sim ? '<span style="font-family:var(--font-mono);font-size:9px;color:var(--text-muted);">PENDENTE</span>' : ''}
      </div>`;
  }).join('');
}


/* ============================================================
   14. ARTILHARIA — Ranking de gols na temporada
   ============================================================ */

function renderArtilharia() {
  // Agrega gols de todos os jogadores de todos os times
  const artilheiros = [];
  Object.entries(estado.jogadores).forEach(([tid, elenco]) => {
    elenco.forEach(j => {
      if (j.gols > 0) {
        const time = getTimeById(parseInt(tid));
        artilheiros.push({ ...j, timeNome: time?.nome || '?', timeEscudo: time?.escudo || '' });
      }
    });
  });
  artilheiros.sort((a, b) => b.gols - a.gols);

  const top = artilheiros.slice(0, 20);
  document.getElementById('tbody-artilharia').innerHTML = top.length
    ? top.map((j, i) => `
        <tr>
          <td class="font-mono text-dim">${i + 1}</td>
          <td>${j.nome}</td>
          <td><span class="escudo-mini">${j.timeEscudo}</span>${j.timeNome}</td>
          <td class="pos-tag ${j.pos}">${j.pos}</td>
          <td class="font-mono text-green" style="font-size:16px;font-weight:bold">${j.gols}</td>
        </tr>`).join('')
    : '<tr><td colspan="5" style="color:var(--text-muted);padding:20px;text-align:center;">Nenhum gol marcado ainda.</td></tr>';
}


/* ============================================================
   15. SIMULAÇÃO DE PARTIDAS
   ============================================================ */

let intervaloPartida = null; // referência do setInterval ativo
let partidaAtual     = null; // objeto do jogo sendo simulado

// Retorna os próximos N jogos não simulados do clube do jogador
function getProximosJogos(n) {
  const jogos = [];
  for (const rod of estado.calendario) {
    for (const j of rod.jogos) {
      if (!j.simulado && (j.casa === estado.meuTimeId || j.fora === estado.meuTimeId)) {
        jogos.push(j);
        if (jogos.length >= n) return jogos;
      }
    }
  }
  return jogos;
}

// Inicia a simulação do próximo jogo do clube
function simularProximoJogo() {
  const proximos = getProximosJogos(1);
  if (!proximos.length) { toast('Não há mais jogos nesta temporada!', 'info'); return; }
  abrirModalPartida(proximos[0]);
}

// Abre o modal e inicia o motor de simulação minuto a minuto
function abrirModalPartida(jogo) {
  partidaAtual    = jogo;
  estado.acelerado = false;

  const casa = getTimeById(jogo.casa);
  const fora = getTimeById(jogo.fora);

  // Preenche o modal com os dados do jogo
  document.getElementById('pm-time-casa').innerHTML  = `${casa.escudo}<br>${casa.nome}`;
  document.getElementById('pm-time-fora').innerHTML  = `${fora.nome}<br>${fora.escudo}`;
  document.getElementById('pm-gols-casa').textContent = '0';
  document.getElementById('pm-gols-fora').textContent = '0';
  document.getElementById('pm-minuto').textContent    = "0'";
  document.getElementById('pm-posse-casa').textContent = '50%';
  document.getElementById('pm-posse-fora').textContent = '50%';
  document.getElementById('pm-chutes-casa').textContent = '0';
  document.getElementById('pm-chutes-fora').textContent = '0';
  document.getElementById('log-partida').innerHTML    = '';
  document.getElementById('btn-fechar-partida').style.display = 'none';
  document.getElementById('btn-acelerar').style.display       = 'inline-block';
  document.getElementById('btn-acelerar').textContent         = '⏩ ACELERAR';

  document.getElementById('modal-partida').classList.add('aberto');

  // Calcula a força de cada time para esta partida
  const forcaCasa = calcularForca(jogo.casa, true);
  const forcaFora = calcularForca(jogo.fora, false);

  // Estado interno da simulação (gols, chutes, etc.)
  const sim = {
    minuto: 0, golsCasa: 0, golsFora: 0,
    chCasa: 0, chFora: 0,
    forcaCasa, forcaFora,
    total: forcaCasa + forcaFora,
  };

  // Pré-gera todos os eventos do jogo antes de começar
  sim.eventos = gerarEventos(sim, casa, fora);

  // Motor minuto a minuto via setInterval
  let minAtual = 0;
  intervaloPartida = setInterval(() => {
    const step = estado.acelerado ? 5 : 1;

    for (let s = 0; s < step && minAtual < 90; s++) {
      minAtual++;
      sim.eventos.filter(e => e.minuto === minAtual).forEach(ev => processarEvento(ev, sim));
    }

    // Atualiza UI do modal
    document.getElementById('pm-minuto').textContent     = minAtual + "'";
    document.getElementById('pm-gols-casa').textContent  = sim.golsCasa;
    document.getElementById('pm-gols-fora').textContent  = sim.golsFora;
    const pCasa = Math.round(sim.forcaCasa / sim.total * 100);
    document.getElementById('pm-posse-casa').textContent = pCasa + '%';
    document.getElementById('pm-posse-fora').textContent = (100 - pCasa) + '%';
    document.getElementById('pm-chutes-casa').textContent = sim.chCasa;
    document.getElementById('pm-chutes-fora').textContent = sim.chFora;

    if (minAtual >= 90) {
      clearInterval(intervaloPartida);
      finalizarPartida(jogo, sim, casa, fora);
    }
  }, estado.acelerado ? 30 : 80);
}

// Calcula a força de um time para uma partida específica
function calcularForca(timeId, ehCasa) {
  const time   = getTimeById(timeId);
  const elenco = estado.jogadores[timeId] || [];

  // Usa a escalação do jogador para o seu time, ou escalação automática para a IA
  const titulares = timeId === estado.meuTimeId
    ? estado.escalacaoAtual.titulares
    : escalarAutomatico(elenco, FORMACOES['4-3-3'].posicoes);

  // Overall médio ponderado pela stamina
  let ovr = 0, n = 0;
  titulares.forEach(jid => {
    const j = elenco.find(jg => jg.id === jid);
    if (j) { ovr += j.overall * (j.stamina / 100); n++; }
  });
  const ovrMedio = n > 0 ? ovr / n : time.overall;

  const fatorCasa  = ehCasa ? 1.08 : 1;          // +8% para o mandante
  let fatorEstilo  = 1;
  if (timeId === estado.meuTimeId) {
    if      (estado.escalacaoAtual.estilo === 'ofensivo')   fatorEstilo = 1.05;
    else if (estado.escalacaoAtual.estilo === 'defensivo')  fatorEstilo = 0.97;
  }
  const rand = 0.85 + Math.random() * 0.3;       // imprevisibilidade

  return ovrMedio * fatorCasa * fatorEstilo * rand;
}

// Pré-gera todos os eventos distribuídos nos 90 minutos
function gerarEventos(sim, casa, fora) {
  const eventos = [];
  const ratio   = sim.forcaCasa / sim.total;

  // Número de chutes proporcional à força de cada time
  const chCasaTotal = Math.floor(5 + ratio       * 10 + Math.random() * 4);
  const chForaTotal = Math.floor(5 + (1 - ratio) * 10 + Math.random() * 4);

  // Gols estimados por taxa de conversão × força relativa
  const golsCasaEsp = Math.floor(chCasaTotal * 0.28 * (ratio + 0.1));
  const golsForaEsp = Math.floor(chForaTotal * 0.28 * ((1 - ratio) + 0.1));

  // Distribui eventos em minutos aleatórios
  const mChC  = sortearMinutos(chCasaTotal,                          1, 90);
  const mChF  = sortearMinutos(chForaTotal,                          1, 90);
  const mGC   = sortearMinutos(golsCasaEsp,                          1, 90);
  const mGF   = sortearMinutos(golsForaEsp,                          1, 90);
  const mAmC  = sortearMinutos(Math.floor(1 + Math.random() * 3),   1, 90);
  const mVerm = sortearMinutos(Math.random() < 0.15 ? 1 : 0,       20, 90);

  // Jogadores de ataque para marcar gols
  const elencoC = estado.jogadores[casa.id] || [];
  const elencoF = estado.jogadores[fora.id] || [];
  const atacC   = elencoC.filter(j => ['CA','PE','PD','MO'].includes(j.pos));
  const atacF   = elencoF.filter(j => ['CA','PE','PD','MO'].includes(j.pos));

  mChC.forEach(m  => eventos.push({ minuto: m, tipo: 'chute', lado: 'casa' }));
  mChF.forEach(m  => eventos.push({ minuto: m, tipo: 'chute', lado: 'fora' }));
  mGC.forEach(m   => eventos.push({ minuto: m, tipo: 'gol', lado: 'casa', jogador: aleatorio(atacC.length ? atacC : elencoC) }));
  mGF.forEach(m   => eventos.push({ minuto: m, tipo: 'gol', lado: 'fora', jogador: aleatorio(atacF.length ? atacF : elencoF) }));
  mAmC.forEach(m  => {
    const j   = aleatorio([...elencoC, ...elencoF]);
    const lad = elencoC.includes(j) ? 'casa' : 'fora';
    eventos.push({ minuto: m, tipo: 'cartao_amarelo', lado: lad, jogador: j });
  });
  mVerm.forEach(m => {
    const j   = aleatorio([...elencoC, ...elencoF]);
    const lad = elencoC.includes(j) ? 'casa' : 'fora';
    eventos.push({ minuto: m, tipo: 'cartao_vermelho', lado: lad, jogador: j });
  });

  // Substituições automáticas entre os minutos 60–80
  [60, 65, 75].forEach(m => {
    if (Math.random() < 0.7) {
      const j = aleatorio(elencoC.slice(11));
      eventos.push({ minuto: m + Math.floor(Math.random() * 5), tipo: 'substituicao', lado: 'casa', jogador: j });
    }
  });

  return eventos.sort((a, b) => a.minuto - b.minuto);
}

// Retorna N minutos aleatórios dentro de [min, max]
function sortearMinutos(n, min, max) {
  const mins = [];
  for (let i = 0; i < n; i++) mins.push(min + Math.floor(Math.random() * (max - min)));
  return mins.sort((a, b) => a - b);
}

// Processa um único evento e atualiza o log e as estatísticas
function processarEvento(ev, sim) {
  const log   = document.getElementById('log-partida');
  const nomeJ = ev.jogador?.nome || '';
  let html    = '';

  switch (ev.tipo) {
    case 'chute':
      if (ev.lado === 'casa') sim.chCasa++;
      else sim.chFora++;
      break;

    case 'gol':
      if (ev.lado === 'casa') sim.golsCasa++;
      else sim.golsFora++;
      if (ev.jogador) ev.jogador.gols = (ev.jogador.gols || 0) + 1;
      html = `<div class="log-evento tipo-gol">
        <span class="min">${ev.minuto}'</span>
        <span class="icon">⚽</span>
        <span class="texto"><strong>GOOOOOL! ${nomeJ}</strong> marca!</span>
      </div>`;
      break;

    case 'cartao_amarelo':
      html = `<div class="log-evento tipo-cartao-amarelo">
        <span class="min">${ev.minuto}'</span>
        <span class="icon">🟨</span>
        <span class="texto"><strong>${nomeJ}</strong> recebe cartão amarelo</span>
      </div>`;
      break;

    case 'cartao_vermelho':
      html = `<div class="log-evento tipo-cartao-vermelho">
        <span class="min">${ev.minuto}'</span>
        <span class="icon">🟥</span>
        <span class="texto"><strong>${nomeJ}</strong> é expulso!</span>
      </div>`;
      break;

    case 'substituicao':
      html = `<div class="log-evento tipo-sub">
        <span class="min">${ev.minuto}'</span>
        <span class="icon">🔄</span>
        <span class="texto">Substituição: entra <strong>${nomeJ}</strong></span>
      </div>`;
      break;
  }

  if (html) log.insertAdjacentHTML('afterbegin', html);
}

// Finaliza a partida: atualiza pontos, simula outros jogos da rodada
function finalizarPartida(jogo, sim, casa, fora) {
  jogo.simulado  = true;
  jogo.golsCasa  = sim.golsCasa;
  jogo.golsFora  = sim.golsFora;

  atualizarEstatTime(jogo.casa, sim.golsCasa, sim.golsFora);
  atualizarEstatTime(jogo.fora, sim.golsFora, sim.golsCasa);
  estado.resultados.push({ ...jogo });

  // Simula os outros jogos da mesma rodada automaticamente
  const rodada = estado.calendario.find(r => r.jogos.includes(jogo));
  if (rodada) {
    rodada.jogos.forEach(j => { if (!j.simulado) simularJogoIA(j); });
    estado.rodadaAtual = rodada.rodada + 1;
  }

  progressaoJogadores();

  // Mensagem de encerramento no log
  const resultado = sim.golsCasa === sim.golsFora ? 'EMPATE!'
    : (sim.golsCasa > sim.golsFora ? casa.nome + ' VENCE!' : fora.nome + ' VENCE!');
  document.getElementById('log-partida').insertAdjacentHTML('afterbegin', `
    <div class="log-evento tipo-encerramento">
      <span class="min">90'</span>
      <span class="icon">🏁</span>
      <span class="texto"><strong>FIM DE JOGO — ${resultado}</strong></span>
    </div>`);

  document.getElementById('btn-acelerar').style.display      = 'none';
  document.getElementById('btn-fechar-partida').style.display = 'inline-block';

  atualizarTopBar();
  salvarEstado();

  // IA pode fazer proposta após o jogo
  setTimeout(gerarPropostasIA, 1500);
}

// Atualiza pontos, gols e recordes de um time após uma partida
function atualizarEstatTime(timeId, golsMarcados, golsSofridos) {
  const t = getTimeById(timeId);
  if (!t) return;
  t.jogos++;
  t.golsPro    += golsMarcados;
  t.golsContra += golsSofridos;
  if      (golsMarcados > golsSofridos) { t.vitorias++; t.pontos += 3; }
  else if (golsMarcados === golsSofridos) { t.empates++;  t.pontos += 1; }
  else    { t.derrotas++; }
}

// Simula um jogo da IA de forma silenciosa (sem modal)
function simularJogoIA(jogo) {
  if (jogo.simulado) return;
  const forcaC = calcularForca(jogo.casa, true);
  const forcaF = calcularForca(jogo.fora, false);
  const ratio  = forcaC / (forcaC + forcaF);

  const golsC = sortearGols(ratio);
  const golsF = sortearGols(1 - ratio);

  jogo.simulado = true;
  jogo.golsCasa = golsC;
  jogo.golsFora = golsF;

  atualizarEstatTime(jogo.casa, golsC, golsF);
  atualizarEstatTime(jogo.fora, golsF, golsC);
  estado.resultados.push({ ...jogo });

  // Registra gols nos atacantes aleatórios de cada time
  [{ tid: jogo.casa, g: golsC }, { tid: jogo.fora, g: golsF }].forEach(({ tid, g }) => {
    const el   = estado.jogadores[tid] || [];
    const atac = el.filter(j => ['CA','PE','PD','MO'].includes(j.pos));
    for (let i = 0; i < g; i++) {
      const j = aleatorio(atac.length ? atac : el);
      if (j) j.gols = (j.gols || 0) + 1;
    }
  });
}

// Distribui gols usando aproximação de Poisson
function sortearGols(prob) {
  const lambda = prob * 2.4; // média total de ~2.4 gols por jogo
  let g = 0, p = Math.random();
  while (p > Math.exp(-lambda)) { p *= Math.random(); g++; }
  return Math.min(g, 7);
}

// Ativa o modo acelerado da simulação
function acelerar() {
  estado.acelerado = true;
  document.getElementById('btn-acelerar').textContent = '⏩⏩';
  // O intervalo existente passa a usar step maior automaticamente
}

// Fecha o modal de partida e volta ao dashboard
function fecharPartida() {
  document.getElementById('modal-partida').classList.remove('aberto');
  partidaAtual = null;
  renderDashboard();
}


/* ============================================================
   16. TRANSFERÊNCIAS — Mercado e propostas da IA
   ============================================================ */

function renderTransferencias() {
  // Exibe propostas recebidas
  const notifDiv = document.getElementById('notificacoes-mercado');
  notifDiv.innerHTML = estado.notificacoes.length
    ? estado.notificacoes.map((n, i) => `
        <div class="notif-item">
          <span class="notif-icon">📬</span>
          <span>${n.texto}</span>
          <button class="btn btn-verde"
                  style="margin-left:auto;font-size:10px;padding:5px 12px"
                  onclick="aceitarProposta(${i})">ACEITAR</button>
          <button class="btn btn-outline"
                  style="font-size:10px;padding:5px 12px"
                  onclick="rejeitarProposta(${i})">RECUSAR</button>
        </div>`).join('')
    : '';

  filtrarMercado();
}

// Aplica filtros de busca, posição e preço na tabela do mercado
function filtrarMercado() {
  const busca = (document.getElementById('busca-jogador')?.value || '').toLowerCase();
  const pos   = document.getElementById('filtro-posicao')?.value  || '';
  const preco = parseFloat(document.getElementById('filtro-preco')?.value || 0);

  // Agrega jogadores disponíveis: mercado livre + jogadores de outros times vendáveis
  const disponiveis = [];
  estado.transferencias.forEach(j => disponiveis.push({ ...j, tipoMercado: 'livre' }));
  estado.times.forEach(t => {
    if (t.id === estado.meuTimeId) return;
    (estado.jogadores[t.id] || []).forEach(j => {
      if (j.overall < 68 || j.idade > 32) {
        disponiveis.push({ ...j, tipoMercado: 'contratado', timeOrigem: t });
      }
    });
  });

  const lista = disponiveis.filter(j => {
    if (busca && !j.nome.toLowerCase().includes(busca)) return false;
    if (pos   && j.pos !== pos)                         return false;
    if (preco && j.valor > preco * 1_000_000)           return false;
    return true;
  }).slice(0, 50);

  const mt = getMeuTime();
  document.getElementById('tbody-mercado').innerHTML = lista.map(j => {
    const posso    = mt.dinheiro >= j.valor;
    const timeNome = j.tipoMercado === 'livre'
      ? '<span style="color:var(--green);font-size:11px">LIVRE</span>'
      : `${j.timeOrigem?.escudo} ${j.timeOrigem?.nome}`;

    return `<tr>
      <td><strong>${j.nome}</strong></td>
      <td class="pos-tag ${j.pos}">${j.pos}</td>
      <td class="font-mono text-dim">${j.idade}</td>
      <td>${NACIONALIDADES[j.nac] || '🌍'}</td>
      <td class="overall-badge ${j.overall >= 80 ? 'alto' : j.overall >= 70 ? 'medio' : 'baixo'}">${j.overall}</td>
      <td class="font-mono text-dim">${j.potencial}</td>
      <td>${timeNome}</td>
      <td class="font-mono" style="color:var(--yellow)">${formatarDinheiro(j.valor)}</td>
      <td>${posso
        ? `<button class="btn btn-verde" style="font-size:10px;padding:5px 12px"
                   onclick="comprarJogador('${j.id}')">CONTRATAR</button>`
        : `<span style="color:var(--text-muted);font-size:11px;font-family:var(--font-mono)">SEM VERBA</span>`
      }</td>
    </tr>`;
  }).join('') || '<tr><td colspan="9" style="color:var(--text-muted);padding:20px;text-align:center;">Nenhum jogador encontrado.</td></tr>';
}

// Processa a contratação de um jogador pelo clube do usuário
function comprarJogador(jid) {
  const mt  = getMeuTime();
  let jIdx  = estado.transferencias.findIndex(j => j.id === jid);
  let jogador = null;
  let origem  = 'livre';

  if (jIdx >= 0) {
    jogador = estado.transferencias[jIdx];
  } else {
    // Procura em outros times
    for (const t of estado.times) {
      if (t.id === estado.meuTimeId) continue;
      const el = estado.jogadores[t.id] || [];
      const ej = el.find(j => j.id === jid);
      if (ej) { jogador = ej; origem = t.id; break; }
    }
  }

  if (!jogador)              { toast('Jogador não encontrado!', 'erro'); return; }
  if (mt.dinheiro < jogador.valor) { toast('Dinheiro insuficiente!',   'erro'); return; }

  mt.dinheiro -= jogador.valor;
  const novoJ = { ...jogador, timeId: estado.meuTimeId, gols: 0 };

  if (origem === 'livre') {
    estado.transferencias.splice(jIdx, 1);
  } else {
    const elOrig = estado.jogadores[origem];
    const oi     = elOrig.findIndex(j => j.id === jid);
    if (oi >= 0) {
      elOrig.splice(oi, 1);
      getTimeById(origem).dinheiro += jogador.valor;
    }
  }

  estado.jogadores[estado.meuTimeId].push(novoJ);
  toast(`${jogador.nome} contratado por ${formatarDinheiro(jogador.valor)}!`, 'ok');
  atualizarTopBar();
  salvarEstado();
  renderTransferencias();
}

// A IA gera proposta de compra para um jogador do clube do usuário
function gerarPropostasIA() {
  if (estado.notificacoes.length >= 3) return; // Limita a 3 propostas abertas
  const elenco     = estado.jogadores[estado.meuTimeId] || [];
  const candidatos = elenco.filter(j => j.overall >= 72);
  if (!candidatos.length) return;

  if (Math.random() < 0.4) {
    const alvo      = aleatorio(candidatos);
    const oferta    = Math.floor(alvo.valor * (1.1 + Math.random() * 0.5));
    const comprador = aleatorio(estado.times.filter(t => t.id !== estado.meuTimeId));
    estado.notificacoes.push({
      jogadorId:   alvo.id,
      oferta,
      compradorId: comprador.id,
      texto: `${comprador.escudo} ${comprador.nome} oferece ${formatarDinheiro(oferta)} por ${alvo.nome}`,
    });
    toast('Nova proposta de transferência recebida!', 'info');
  }
}

// Aceita uma proposta da IA (transfere o jogador)
function aceitarProposta(idx) {
  const prop = estado.notificacoes[idx];
  if (!prop) return;

  const elenco = estado.jogadores[estado.meuTimeId];
  const ji     = elenco.findIndex(j => j.id === prop.jogadorId);
  if (ji === -1) { estado.notificacoes.splice(idx, 1); renderTransferencias(); return; }

  const j = elenco[ji];
  getMeuTime().dinheiro += prop.oferta;
  elenco.splice(ji, 1);
  estado.escalacaoAtual.titulares = estado.escalacaoAtual.titulares.filter(id => id !== j.id);

  // Jogador vai para o time comprador
  (estado.jogadores[prop.compradorId] = estado.jogadores[prop.compradorId] || [])
    .push({ ...j, timeId: prop.compradorId });
  getTimeById(prop.compradorId).dinheiro -= prop.oferta;

  estado.notificacoes.splice(idx, 1);
  toast(`${j.nome} vendido por ${formatarDinheiro(prop.oferta)}!`, 'ok');
  atualizarTopBar();
  salvarEstado();
  renderTransferencias();
}

// Rejeita e descarta uma proposta da IA
function rejeitarProposta(idx) {
  estado.notificacoes.splice(idx, 1);
  renderTransferencias();
}


/* ============================================================
   17. IA DOS CLUBES — Movimentações automáticas de mercado
   ============================================================ */

// Executado a cada rodada: times da IA vendem e contratam automaticamente
function iaGerenciarMercado() {
  estado.times.forEach(t => {
    if (t.id === estado.meuTimeId) return;
    const el = estado.jogadores[t.id] || [];

    // Vende jogador velho ou fraco se o elenco estiver cheio
    if (el.length > 22) {
      const candidatos = el.filter(j => j.idade > 33 || j.overall < 62);
      if (candidatos.length) {
        const alvo = candidatos[0];
        t.dinheiro += alvo.valor;
        el.splice(el.indexOf(alvo), 1);
        estado.transferencias.push({ ...alvo, timeId: 0 });
      }
    }

    // Contrata do mercado livre se o elenco estiver pequeno e houver verba
    if (el.length < 18 && estado.transferencias.length && t.dinheiro > 2_000_000) {
      const livre = estado.transferencias.find(j => j.valor <= t.dinheiro * 0.5);
      if (livre) {
        t.dinheiro -= livre.valor;
        el.push({ ...livre, timeId: t.id });
        estado.transferencias.splice(estado.transferencias.indexOf(livre), 1);
      }
    }
  });
}


/* ============================================================
   18. PROGRESSÃO DE JOGADORES
   ============================================================ */

// Evolui jovens, envelhece veteranos — chamado a cada 5 rodadas
function progressaoJogadores() {
  if (estado.rodadaAtual % 5 !== 0) return;

  Object.values(estado.jogadores).forEach(elenco => {
    elenco.forEach(j => {
      // Jovens (<22) crescem em direção ao potencial
      if (j.idade < 22 && j.overall < j.potencial) {
        j.overall = Math.min(j.potencial, j.overall + Math.floor(Math.random() * 2));
      }
      // Veteranos (>31) podem perder um ponto de overall
      if (j.idade > 31 && Math.random() < 0.3) {
        j.overall = Math.max(50, j.overall - 1);
      }
      // Envelhecer 1 ano ao fim da temporada
      if (estado.rodadaAtual >= 38) j.idade++;

      // Recuperação parcial de stamina
      j.stamina = Math.min(100, j.stamina + 2);
      // Reajuste do valor de mercado
      j.valor = calcularValor(j.overall, j.idade);
    });
  });
}


/* ============================================================
   19. NOVA TEMPORADA
   ============================================================ */

// Avança o ano, reseta estatísticas e gera novo calendário
function novaTemporada() {
  estado.temporada++;
  estado.rodadaAtual = 1;

  // Zera as estatísticas de todos os times
  estado.times.forEach(t => {
    t.pontos = 0; t.vitorias = 0; t.empates = 0;
    t.derrotas = 0; t.golsPro = 0; t.golsContra = 0; t.jogos = 0;
  });

  // Recalcula valores e zera gols dos jogadores
  Object.values(estado.jogadores).forEach(el => el.forEach(j => {
    j.gols    = 0;
    j.stamina = Math.min(100, j.stamina + 10);
    j.valor   = calcularValor(j.overall, j.idade);
  }));

  estado.resultados    = [];
  estado.notificacoes  = [];
  gerarCalendario();
  gerarMercadoLivre();

  toast(`Temporada ${estado.temporada} iniciada!`, 'ok');
  salvarEstado();
  navegarPara('dashboard');
}


/* ============================================================
   20. UTILITÁRIOS — Funções auxiliares reutilizáveis
   ============================================================ */

// Retorna um elemento aleatório de um array
function aleatorio(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Busca um time pelo seu ID no estado atual
function getTimeById(id) {
  return estado.times.find(t => t.id === id);
}

// Atalho para o time do jogador
function getMeuTime() {
  return getTimeById(estado.meuTimeId);
}

// Formata valores monetários: 1.500.000 → "1.5M", 50.000 → "50K"
function formatarDinheiro(val) {
  if (Math.abs(val) >= 1_000_000) return (val / 1_000_000).toFixed(1) + 'M';
  if (Math.abs(val) >= 1_000)     return (val / 1_000).toFixed(0) + 'K';
  return val.toString();
}

// Exibe uma notificação toast no canto inferior direito
function toast(msg, tipo) {
  const container = document.getElementById('toast');
  const div       = document.createElement('div');
  div.className   = 'toast-item ' + (tipo === 'erro' ? 'erro' : tipo === 'info' ? 'info' : '');
  div.textContent = msg;
  container.appendChild(div);
  setTimeout(() => div.remove(), 3500);
}

// Atualiza os valores exibidos na top bar
function atualizarTopBar() {
  const mt = getMeuTime();
  document.getElementById('tb-temporada').textContent = estado.temporada;
  document.getElementById('tb-rodada').textContent    = estado.rodadaAtual;
  document.getElementById('tb-dinheiro').textContent  = formatarDinheiro(mt.dinheiro);
}


/* ============================================================
   SAVE / LOAD — Persistência via LocalStorage
   ============================================================ */

// Serializa o estado completo e salva no navegador
function salvarEstado() {
  try {
    localStorage.setItem('bfmgr_save', JSON.stringify(estado));
  } catch (e) {
    console.warn('Brasfoot Manager: não foi possível salvar o estado.', e);
  }
}
