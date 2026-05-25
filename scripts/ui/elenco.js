import { estado } from '../estado.js'
import { getMeuTime, toast } from '../utils.js'
import { formatarDinheiro } from '../calculo.js'
import { NACIONALIDADES } from '../data.js'
import { atualizarTopBar, salvarEstado } from '../estado.js'

const ORDEM_POS = ['GK', 'ZA', 'LD', 'LE', 'VOL', 'MC', 'MO', 'MD', 'ME', 'PE', 'PD', 'CA']
let ordemElenco = 'pos'

export function renderElenco() {
    const mt = getMeuTime()
    document.getElementById('elenco-nome-time').textContent = '— ' + mt.nome.toUpperCase()
    ordenarElenco(ordemElenco)
}

export function ordenarElenco(criterio) {
    ordemElenco = criterio
    const elenco = [...(estado.jogadores[estado.meuTimeId] || [])]

    if (criterio === 'pos') elenco.sort((a, b) => ORDEM_POS.indexOf(a.pos) - ORDEM_POS.indexOf(b.pos))
    else if (criterio === 'overall') elenco.sort((a, b) => b.overall - a.overall)
    else if (criterio === 'idade') elenco.sort((a, b) => a.idade - b.idade)

    const titulares = new Set(estado.escalacaoAtual.titulares)
    document.getElementById('lista-elenco').innerHTML = elenco.map(j => `
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
            <button class="btn btn-vermelho" style="font-size:10px;padding:5px 10px;" onclick="venderJogadorElenco('${j.id}')">VENDER</button>
        </div>`).join('')
}

export function venderJogadorElenco(jid) {
    const elenco = estado.jogadores[estado.meuTimeId]
    const idx = elenco.findIndex(j => j.id === jid)
    if (idx === -1) return
    if (elenco.length <= 14) { toast('Elenco muito pequeno para vender!', 'erro'); return }

    const j = elenco[idx]
    getMeuTime().dinheiro += j.valor
    elenco.splice(idx, 1)
    estado.escalacaoAtual.titulares = estado.escalacaoAtual.titulares.filter(id => id !== jid)

    toast(`${j.nome} vendido por ${formatarDinheiro(j.valor)}!`, 'ok')
    atualizarTopBar()
    salvarEstado()
    renderElenco()
}