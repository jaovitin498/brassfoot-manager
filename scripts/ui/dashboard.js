import { estado } from '../estado.js'
import { getMeuTime, getTimeById } from '../utils.js'
import { formatarDinheiro } from '../calculo.js'
import { getProximosJogos, simularProximoJogo } from '../simulacao.js'
import { novaTemporada } from '../progressao.js'

export function renderDashboard() {
    const mt = getMeuTime()
    document.getElementById('dash-temporada').textContent = estado.temporada
    document.getElementById('elenco-nome-time').textContent = '— ' + mt.nome.toUpperCase()

    renderCardsDashboard(mt)
    renderProximosJogos()
    renderUltimosResultados()
    renderMiniTabela()
}

function renderCardsDashboard(mt) {
    const sg = mt.golsPro - mt.golsContra
    const cards = [
        { label: 'Posição', valor: getPosicaoTime(mt.id) + 'º', cls: 'amarelo' },
        { label: 'Pontos', valor: mt.pontos, cls: 'verde' },
        { label: 'Saldo Gols', valor: (sg >= 0 ? '+' : '') + sg, cls: sg >= 0 ? 'verde' : 'vermelho' },
        { label: 'Finanças', valor: 'R$' + formatarDinheiro(mt.dinheiro), cls: mt.dinheiro >= 0 ? 'verde' : 'vermelho' },
    ]
    document.getElementById('dash-cards').innerHTML = cards.map(c => `
        <div class="stat-card">
            <div class="label">${c.label}</div>
            <div class="valor ${c.cls}">${c.valor}</div>
        </div>`).join('')
}

function renderProximosJogos() {
    const proximos = getProximosJogos(3)
    const listaProx = document.getElementById('lista-proximos-jogos')
    const btnSimular = document.getElementById('btn-simular')

    if (!proximos.length) {
        listaProx.innerHTML = '<div style="color:var(--text-muted);font-size:13px;padding:10px 0;">Temporada encerrada!</div>'
        btnSimular.textContent = '🔄 NOVA TEMPORADA'
        btnSimular.onclick = novaTemporada
        return
    }

    btnSimular.textContent = '▶ SIMULAR JOGO'
    btnSimular.onclick = simularProximoJogo
    listaProx.innerHTML = proximos.map(j => {
        const casa = getTimeById(j.casa)
        const fora = getTimeById(j.fora)
        const ehCasa = j.casa === estado.meuTimeId
        return `
            <div class="jogo-item">
                <span class="rodada-tag">ROD ${j.rodada}</span>
                <div class="times-jogo">
                    <span>${casa.escudo} ${casa.nome}</span>
                    <span class="vs">×</span>
                    <span>${fora.escudo} ${fora.nome}</span>
                </div>
                <span class="local-tag ${ehCasa ? 'casa' : ''}">${ehCasa ? 'CASA' : 'FORA'}</span>
            </div>`
    }).join('')
}

function renderUltimosResultados() {
    const ultimos = estado.resultados.slice(-4).reverse()
    document.getElementById('lista-ultimos-resultados').innerHTML = ultimos.length
        ? ultimos.map(r => {
            const casa = getTimeById(r.casa)
            const fora = getTimeById(r.fora)
            let cls = 'text-dim'
            if (r.casa === estado.meuTimeId || r.fora === estado.meuTimeId) {
                const ganhei = (r.casa === estado.meuTimeId && r.golsCasa > r.golsFora)
                    || (r.fora === estado.meuTimeId && r.golsFora > r.golsCasa)
                cls = ganhei ? 'text-green' : r.golsCasa === r.golsFora ? 'text-yellow' : 'text-red'
            }
            return `
                <div class="jogo-item">
                    <span class="rodada-tag">ROD ${r.rodada}</span>
                    <div class="times-jogo ${cls}">
                        <span>${casa.escudo} ${casa.nome}</span>
                        <span class="vs">${r.golsCasa} – ${r.golsFora}</span>
                        <span>${fora.escudo} ${fora.nome}</span>
                    </div>
                </div>`
        }).join('')
        : '<div style="color:var(--text-muted);font-size:13px;padding:10px 0;">Nenhum resultado ainda.</div>'
}

function renderMiniTabela() {
    const clas = getClassificacao().slice(0, 6)
    document.getElementById('dash-mini-tabela').innerHTML = `
        <table class="tabela-estilo">
            <thead><tr><th>#</th><th>Clube</th><th>PJ</th><th>PTS</th><th>SG</th></tr></thead>
            <tbody>
                ${clas.map((t, i) => `
                    <tr class="${t.id === estado.meuTimeId ? 'destaque-meu-time' : ''}">
                        <td class="pos-num ${i < 4 ? 'g4' : ''}">${i + 1}</td>
                        <td><span class="escudo-mini">${t.escudo}</span>${t.nome}</td>
                        <td class="font-mono">${t.jogos}</td>
                        <td class="font-mono text-green">${t.pontos}</td>
                        <td class="font-mono">${t.golsPro - t.golsContra >= 0 ? '+' : ''}${t.golsPro - t.golsContra}</td>
                    </tr>`).join('')}
            </tbody>
        </table>`
}

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