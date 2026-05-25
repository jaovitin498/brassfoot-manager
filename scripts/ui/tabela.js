// tabela.js
import { estado } from '../estado.js'

export function getClassificacao() {
    return estado.times
        .filter(t => t.serie === 'A')
        .sort((a, b) => {
            if (b.pontos !== a.pontos) return b.pontos - a.pontos
            const sgA = a.golsPro - a.golsContra
            const sgB = b.golsPro - b.golsContra
            if (sgB !== sgA) return sgB - sgA
            return b.golsPro - a.golsPro
        })
}

export const getPosicaoTime = (id) => getClassificacao().findIndex(t => t.id === id) + 1

export function renderTabela() {
    document.getElementById('tbody-tabela').innerHTML = getClassificacao().map((t, i) => {
        const sg = t.golsPro - t.golsContra
        const posCls = i < 4 ? 'g4' : i >= 17 ? 'rebaixamento' : ''
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
            </tr>`
    }).join('')
}