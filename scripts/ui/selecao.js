import { estado } from '../estado.js'
import { TIMES_DADOS, FORMACOES } from '../data.js'
import { gerarElenco, escalarAutomatico } from '../gerador.js'
import { salvarEstado, atualizarTopBar } from '../estado.js'
import { gerarCalendario } from '../calendario.js'
import { gerarMercadoLivre } from '../mercado.js'
import { iniciarJogo } from './navegacao.js'

export function mostrarSelecao() {
    document.getElementById('tela-selecao').style.display = 'block'
    renderizarGridTimes(TIMES_DADOS)
}

export function filtrarSerie(serie, event) {
    document.querySelectorAll('.btn-filtro').forEach(b => b.classList.remove('ativo'))
    event.target.classList.add('ativo')
    const lista = serie === 'todos' ? TIMES_DADOS : TIMES_DADOS.filter(t => t.serie === serie)
    renderizarGridTimes(lista)
}

function renderizarGridTimes(lista) {
    document.getElementById('grid-times').innerHTML = lista.map(t => `
        <div class="card-time-selecao" onclick="selecionarTime(${t.id})">
            <div class="escudo-grande">${t.escudo}</div>
            <div class="nome-time-selecao">${t.nome}</div>
            <div class="overall-badge ${t.overall >= 80 ? 'alto' : t.overall >= 72 ? 'medio' : 'baixo'}">${t.overall} OVR</div>
            <div class="serie-badge ${t.serie}">SÉRIE ${t.serie}</div>
        </div>`).join('')
}

export function selecionarTime(timeId) {
    estado.meuTimeId = timeId
    estado.times = TIMES_DADOS.map(t => ({
        ...t,
        pontos: 0, vitorias: 0, empates: 0, derrotas: 0,
        golsPro: 0, golsContra: 0, jogos: 0,
        dinheiro: t.dinheiro * 1_000_000,
    }))

    estado.times.forEach(t => { estado.jogadores[t.id] = gerarElenco(t) })

    const posicoes = FORMACOES[estado.escalacaoAtual.formacao].posicoes
    estado.escalacaoAtual.titulares = escalarAutomatico(estado.jogadores[timeId], posicoes)

    gerarCalendario()
    gerarMercadoLivre()
    iniciarJogo(false)
    salvarEstado()
}