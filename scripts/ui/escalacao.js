import { estado } from '../estado.js'
import { FORMACOES, NACIONALIDADES } from '../data.js'
import { escalarAutomatico } from '../gerador.js'
import { salvarEstado } from '../estado.js'
import { toast } from '../utils.js'

export function renderEscalacao() {
    const elenco = estado.jogadores[estado.meuTimeId] || []
    document.getElementById('sel-formacao').value = estado.escalacaoAtual.formacao
    document.getElementById('sel-estilo').value = estado.escalacaoAtual.estilo
    renderCampo(elenco)
    renderBanco(elenco)
}

function renderCampo(elenco) {
    const campo = document.getElementById('campo-visual')
    const formacao = FORMACOES[estado.escalacaoAtual.formacao]
    campo.innerHTML = ''

    let idxLinear = 0
    formacao.linhas.forEach((linha, li) => {
        const numJog = linha[0]
        const posicoes = linha.slice(1)
        const percY = 85 - (li / (formacao.linhas.length - 1)) * 70

        const divLinha = document.createElement('div')
        divLinha.className = 'linha-formacao'
        divLinha.style.top = percY + '%'

        for (let i = 0; i < numJog; i++) {
            const jid = estado.escalacaoAtual.titulares[idxLinear + i]
            const jogador = jid ? elenco.find(j => j.id === jid) : null
            const div = document.createElement('div')
            div.className = 'jogador-campo ' + (jogador ? 'titular' : '')
            div.innerHTML = `
                <div class="jogador-circulo">${posicoes[i] || '?'}</div>
                <div class="jc-nome">${jogador ? jogador.nome.split(' ')[0] : '—'}</div>`
            divLinha.appendChild(div)
        }

        idxLinear += numJog
        campo.appendChild(divLinha)
    })
}

function renderBanco(elenco) {
    const titIds = new Set(estado.escalacaoAtual.titulares)
    document.getElementById('lista-banco').innerHTML = elenco
        .filter(j => !titIds.has(j.id))
        .map(j => `
            <div class="jogador-row">
                <span class="pos-tag ${j.pos}">${j.pos}</span>
                <span class="nome-j">${j.nome}</span>
                <span class="idade-j">${j.idade}</span>
                <span class="nat-j">${NACIONALIDADES[j.nac] || '🌍'}</span>
                <span class="overall-badge ${j.overall >= 80 ? 'alto' : j.overall >= 70 ? 'medio' : 'baixo'}">${j.overall}</span>
            </div>`).join('')
}

export function mudarFormacao(val) {
    estado.escalacaoAtual.formacao = val
    const elenco = estado.jogadores[estado.meuTimeId] || []
    estado.escalacaoAtual.titulares = escalarAutomatico(elenco, FORMACOES[val].posicoes)
    renderEscalacao()
}

export function mudarEstilo(val) {
    estado.escalacaoAtual.estilo = val
}

export function salvarEscalacao() {
    salvarEstado()
    toast('Escalação salva!', 'ok')
}