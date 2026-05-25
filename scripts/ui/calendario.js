import { estado } from '../estado.js'
import { getTimeById } from '../utils.js'

export function renderCalendario() {
    const minhasRodadas = estado.calendario.filter(rod =>
        rod.jogos.some(j => j.casa === estado.meuTimeId || j.fora === estado.meuTimeId)
    )

    document.getElementById('lista-calendario').innerHTML = minhasRodadas.slice(0, 20).map(rod => {
        const meuJogo = rod.jogos.find(j => j.casa === estado.meuTimeId || j.fora === estado.meuTimeId)
        const casa = getTimeById(meuJogo.casa)
        const fora = getTimeById(meuJogo.fora)
        const ehCasa = meuJogo.casa === estado.meuTimeId
        const sim = meuJogo.simulado

        let clsRes = ''
        if (sim) {
            const ganhei = (ehCasa && meuJogo.golsCasa > meuJogo.golsFora)
                || (!ehCasa && meuJogo.golsFora > meuJogo.golsCasa)
            clsRes = ganhei ? 'text-green' : meuJogo.golsCasa === meuJogo.golsFora ? 'text-yellow' : 'text-red'
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
            </div>`
    }).join('')
}