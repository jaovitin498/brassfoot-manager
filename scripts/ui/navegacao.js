import { estado } from '../estado.js'
import { atualizarTopBar } from '../estado.js'
import { getMeuTime } from '../utils.js'
import { renderDashboard } from './dashboard.js'
import { renderElenco } from './elenco.js'
import { renderEscalacao } from './escalacao.js'
import { renderTabela } from './tabela.js'
import { renderCalendario } from './calendario.js'
import { renderArtilharia } from './artilharia.js'
import { renderTransferencias } from '../transferencias.js'

const renders = {
    dashboard: renderDashboard,
    elenco: renderElenco,
    escalacao: renderEscalacao,
    tabela: renderTabela,
    calendario: renderCalendario,
    artilharia: renderArtilharia,
    transferencias: renderTransferencias,
}

export function iniciarJogo(fromSave) {
    document.getElementById('loading-screen').style.display = 'none'
    document.getElementById('tela-selecao').style.display = 'none'
    document.getElementById('jogo').style.display = 'block'

    const meuTime = getMeuTime()
    document.getElementById('tb-escudo').textContent = meuTime.escudo
    document.getElementById('tb-nome-time').textContent = meuTime.nome

    atualizarTopBar()
    navegarPara('dashboard')
}

export function navegarPara(tela) {
    document.querySelectorAll('.tela').forEach(t => t.classList.remove('ativa'))
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('ativo'))
    document.getElementById('tela-' + tela).classList.add('ativa')
    document.querySelectorAll('.nav-item').forEach(n => {
        if (n.getAttribute('onclick')?.includes(tela)) n.classList.add('ativo')
    })
    renders[tela]?.()
}