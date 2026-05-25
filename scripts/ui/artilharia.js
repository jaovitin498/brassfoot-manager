import { estado } from '../estado.js'
import { getTimeById } from '../utils.js'

export function renderArtilharia() {
    const artilheiros = []
    Object.entries(estado.jogadores).forEach(([tid, elenco]) => {
        elenco.forEach(j => {
            if (j.gols > 0) {
                const time = getTimeById(parseInt(tid))
                artilheiros.push({ ...j, timeNome: time?.nome || '?', timeEscudo: time?.escudo || '' })
            }
        })
    })
    artilheiros.sort((a, b) => b.gols - a.gols)

    document.getElementById('tbody-artilharia').innerHTML = artilheiros.slice(0, 20).length
        ? artilheiros.slice(0, 20).map((j, i) => `
            <tr>
                <td class="font-mono text-dim">${i + 1}</td>
                <td>${j.nome}</td>
                <td><span class="escudo-mini">${j.timeEscudo}</span>${j.timeNome}</td>
                <td class="pos-tag ${j.pos}">${j.pos}</td>
                <td class="font-mono text-green" style="font-size:16px;font-weight:bold">${j.gols}</td>
            </tr>`).join('')
        : '<tr><td colspan="5" style="color:var(--text-muted);padding:20px;text-align:center;">Nenhum gol marcado ainda.</td></tr>'
}