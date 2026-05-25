import { estado } from './estado.js'
import { getTimeById, getMeuTime, aleatorio } from './utils.js'
import { FORMACOES } from './data.js'
import { sortearMinutos, sortearGols } from './calculo.js'
import { escalarAutomatico } from './gerador.js'
import { progressaoJogadores } from './progressao.js'
import { gerarPropostasIA } from './transferencias.js'
import { atualizarTopBar, salvarEstado } from './estado.js'
import { renderDashboard } from './ui/dashboard.js'

let intervaloPartida = null
let partidaAtual = null

export function getProximosJogos(n) {
    const jogos = []
    for (const rod of estado.calendario) {
        for (const j of rod.jogos) {
            if (!j.simulado && (j.casa === estado.meuTimeId || j.fora === estado.meuTimeId)) {
                jogos.push(j)
                if (jogos.length >= n) return jogos
            }
        }
    }
    return jogos
}

export function simularProximoJogo() {
    const proximos = getProximosJogos(1)
    if (!proximos.length) { toast('Não há mais jogos nesta temporada!', 'info'); return }
    abrirModalPartida(proximos[0])
}

export function abrirModalPartida(jogo) {
    partidaAtual = jogo
    estado.acelerado = false

    const casa = getTimeById(jogo.casa)
    const fora = getTimeById(jogo.fora)

    document.getElementById('pm-time-casa').innerHTML = `${casa.escudo}<br>${casa.nome}`
    document.getElementById('pm-time-fora').innerHTML = `${fora.nome}<br>${fora.escudo}`
    document.getElementById('pm-gols-casa').textContent = '0'
    document.getElementById('pm-gols-fora').textContent = '0'
    document.getElementById('pm-minuto').textContent = "0'"
    document.getElementById('pm-posse-casa').textContent = '50%'
    document.getElementById('pm-posse-fora').textContent = '50%'
    document.getElementById('pm-chutes-casa').textContent = '0'
    document.getElementById('pm-chutes-fora').textContent = '0'
    document.getElementById('log-partida').innerHTML = ''
    document.getElementById('btn-fechar-partida').style.display = 'none'
    document.getElementById('btn-acelerar').style.display = 'inline-block'
    document.getElementById('btn-acelerar').textContent = '⏩ ACELERAR'
    document.getElementById('modal-partida').classList.add('aberto')

    const forcaCasa = calcularForca(jogo.casa, true)
    const forcaFora = calcularForca(jogo.fora, false)
    const sim = {
        minuto: 0, golsCasa: 0, golsFora: 0,
        chCasa: 0, chFora: 0,
        forcaCasa, forcaFora,
        total: forcaCasa + forcaFora,
    }
    sim.eventos = gerarEventos(sim, casa, fora)

    let minAtual = 0
    intervaloPartida = setInterval(() => {
        const step = estado.acelerado ? 5 : 1
        for (let s = 0; s < step && minAtual < 90; s++) {
            minAtual++
            sim.eventos.filter(e => e.minuto === minAtual).forEach(ev => processarEvento(ev, sim))
        }

        document.getElementById('pm-minuto').textContent = minAtual + "'"
        document.getElementById('pm-gols-casa').textContent = sim.golsCasa
        document.getElementById('pm-gols-fora').textContent = sim.golsFora
        const pCasa = Math.round(sim.forcaCasa / sim.total * 100)
        document.getElementById('pm-posse-casa').textContent = pCasa + '%'
        document.getElementById('pm-posse-fora').textContent = (100 - pCasa) + '%'
        document.getElementById('pm-chutes-casa').textContent = sim.chCasa
        document.getElementById('pm-chutes-fora').textContent = sim.chFora

        if (minAtual >= 90) {
            clearInterval(intervaloPartida)
            finalizarPartida(jogo, sim, casa, fora)
        }
    }, estado.acelerado ? 30 : 80)
}

function calcularForca(timeId, ehCasa) {
    const time = getTimeById(timeId)
    const elenco = estado.jogadores[timeId] || []
    const titulares = timeId === estado.meuTimeId
        ? estado.escalacaoAtual.titulares
        : escalarAutomatico(elenco, FORMACOES['4-3-3'].posicoes)

    let ovr = 0, n = 0
    titulares.forEach(jid => {
        const j = elenco.find(jg => jg.id === jid)
        if (j) { ovr += j.overall * (j.stamina / 100); n++ }
    })
    const ovrMedio = n > 0 ? ovr / n : time.overall
    const fatorCasa = ehCasa ? 1.08 : 1
    let fatorEstilo = 1
    if (timeId === estado.meuTimeId) {
        if (estado.escalacaoAtual.estilo === 'ofensivo') fatorEstilo = 1.05
        else if (estado.escalacaoAtual.estilo === 'defensivo') fatorEstilo = 0.97
    }
    return ovrMedio * fatorCasa * fatorEstilo * (0.85 + Math.random() * 0.3)
}

function gerarEventos(sim, casa, fora) {
    const eventos = []
    const ratio = sim.forcaCasa / sim.total
    const chCasaTotal = Math.floor(5 + ratio * 10 + Math.random() * 4)
    const chForaTotal = Math.floor(5 + (1 - ratio) * 10 + Math.random() * 4)
    const golsCasaEsp = Math.floor(chCasaTotal * 0.28 * (ratio + 0.1))
    const golsForaEsp = Math.floor(chForaTotal * 0.28 * ((1 - ratio) + 0.1))

    const elencoC = estado.jogadores[casa.id] || []
    const elencoF = estado.jogadores[fora.id] || []
    const atacC = elencoC.filter(j => ['CA', 'PE', 'PD', 'MO'].includes(j.pos))
    const atacF = elencoF.filter(j => ['CA', 'PE', 'PD', 'MO'].includes(j.pos))

    sortearMinutos(chCasaTotal, 1, 90).forEach(m => eventos.push({ minuto: m, tipo: 'chute', lado: 'casa' }))
    sortearMinutos(chForaTotal, 1, 90).forEach(m => eventos.push({ minuto: m, tipo: 'chute', lado: 'fora' }))
    sortearMinutos(golsCasaEsp, 1, 90).forEach(m => eventos.push({ minuto: m, tipo: 'gol', lado: 'casa', jogador: aleatorio(atacC.length ? atacC : elencoC) }))
    sortearMinutos(golsForaEsp, 1, 90).forEach(m => eventos.push({ minuto: m, tipo: 'gol', lado: 'fora', jogador: aleatorio(atacF.length ? atacF : elencoF) }))
    sortearMinutos(Math.floor(1 + Math.random() * 3), 1, 90).forEach(m => {
        const j = aleatorio([...elencoC, ...elencoF])
        eventos.push({ minuto: m, tipo: 'cartao_amarelo', lado: elencoC.includes(j) ? 'casa' : 'fora', jogador: j })
    })
    if (Math.random() < 0.15) {
        sortearMinutos(1, 20, 90).forEach(m => {
            const j = aleatorio([...elencoC, ...elencoF])
            eventos.push({ minuto: m, tipo: 'cartao_vermelho', lado: elencoC.includes(j) ? 'casa' : 'fora', jogador: j })
        })
    }
    ;[60, 65, 75].forEach(m => {
        if (Math.random() < 0.7) {
            const j = aleatorio(elencoC.slice(11))
            eventos.push({ minuto: m + Math.floor(Math.random() * 5), tipo: 'substituicao', lado: 'casa', jogador: j })
        }
    })

    return eventos.sort((a, b) => a.minuto - b.minuto)
}

function processarEvento(ev, sim) {
    const log = document.getElementById('log-partida')
    const nomeJ = ev.jogador?.nome || ''
    let html = ''

    switch (ev.tipo) {
        case 'chute':
            if (ev.lado === 'casa') sim.chCasa++
            else sim.chFora++
            break
        case 'gol':
            if (ev.lado === 'casa') sim.golsCasa++
            else sim.golsFora++
            if (ev.jogador) ev.jogador.gols = (ev.jogador.gols || 0) + 1
            html = `<div class="log-evento tipo-gol"><span class="min">${ev.minuto}'</span><span class="icon">⚽</span><span class="texto"><strong>GOOOOOL! ${nomeJ}</strong> marca!</span></div>`
            break
        case 'cartao_amarelo':
            html = `<div class="log-evento tipo-cartao-amarelo"><span class="min">${ev.minuto}'</span><span class="icon">🟨</span><span class="texto"><strong>${nomeJ}</strong> recebe cartão amarelo</span></div>`
            break
        case 'cartao_vermelho':
            html = `<div class="log-evento tipo-cartao-vermelho"><span class="min">${ev.minuto}'</span><span class="icon">🟥</span><span class="texto"><strong>${nomeJ}</strong> é expulso!</span></div>`
            break
        case 'substituicao':
            html = `<div class="log-evento tipo-sub"><span class="min">${ev.minuto}'</span><span class="icon">🔄</span><span class="texto">Substituição: entra <strong>${nomeJ}</strong></span></div>`
            break
    }

    if (html) log.insertAdjacentHTML('afterbegin', html)
}

function finalizarPartida(jogo, sim, casa, fora) {
    jogo.simulado = true
    jogo.golsCasa = sim.golsCasa
    jogo.golsFora = sim.golsFora

    atualizarEstatTime(jogo.casa, sim.golsCasa, sim.golsFora)
    atualizarEstatTime(jogo.fora, sim.golsFora, sim.golsCasa)
    estado.resultados.push({ ...jogo })

    const rodada = estado.calendario.find(r => r.jogos.includes(jogo))
    if (rodada) {
        rodada.jogos.forEach(j => { if (!j.simulado) simularJogoIA(j) })
        estado.rodadaAtual = rodada.rodada + 1
    }

    progressaoJogadores()

    const resultado = sim.golsCasa === sim.golsFora ? 'EMPATE!'
        : sim.golsCasa > sim.golsFora ? `${casa.nome} VENCE!` : `${fora.nome} VENCE!`

    document.getElementById('log-partida').insertAdjacentHTML('afterbegin', `
        <div class="log-evento tipo-encerramento">
            <span class="min">90'</span><span class="icon">🏁</span>
            <span class="texto"><strong>FIM DE JOGO — ${resultado}</strong></span>
        </div>`)

    document.getElementById('btn-acelerar').style.display = 'none'
    document.getElementById('btn-fechar-partida').style.display = 'inline-block'

    atualizarTopBar()
    salvarEstado()
    setTimeout(gerarPropostasIA, 1500)
}

export function atualizarEstatTime(timeId, golsMarcados, golsSofridos) {
    const t = getTimeById(timeId)
    if (!t) return
    t.jogos++
    t.golsPro += golsMarcados
    t.golsContra += golsSofridos
    if (golsMarcados > golsSofridos) { t.vitorias++; t.pontos += 3 }
    else if (golsMarcados === golsSofridos) { t.empates++; t.pontos++ }
    else t.derrotas++
}

export function simularJogoIA(jogo) {
    if (jogo.simulado) return
    const forcaC = calcularForca(jogo.casa, true)
    const forcaF = calcularForca(jogo.fora, false)
    const ratio = forcaC / (forcaC + forcaF)
    const golsC = sortearGols(ratio)
    const golsF = sortearGols(1 - ratio)

    jogo.simulado = true
    jogo.golsCasa = golsC
    jogo.golsFora = golsF

    atualizarEstatTime(jogo.casa, golsC, golsF)
    atualizarEstatTime(jogo.fora, golsF, golsC)
    estado.resultados.push({ ...jogo })

        ;[{ tid: jogo.casa, g: golsC }, { tid: jogo.fora, g: golsF }].forEach(({ tid, g }) => {
            const el = estado.jogadores[tid] || []
            const atac = el.filter(j => ['CA', 'PE', 'PD', 'MO'].includes(j.pos))
            for (let i = 0; i < g; i++) {
                const j = aleatorio(atac.length ? atac : el)
                if (j) j.gols = (j.gols || 0) + 1
            }
        })
}

export function acelerar() {
    estado.acelerado = true
    document.getElementById('btn-acelerar').textContent = '⏩⏩'
}

export function fecharPartida() {
    document.getElementById('modal-partida').classList.remove('aberto')
    partidaAtual = null
    renderDashboard()
}