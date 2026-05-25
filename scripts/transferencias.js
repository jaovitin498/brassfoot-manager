import { estado } from './estado.js'
import { getTimeById, getMeuTime, aleatorio, toast } from './utils.js'
import { formatarDinheiro } from './calculo.js'
import { NACIONALIDADES } from './data.js'
import { atualizarTopBar, salvarEstado } from './estado.js'

export function renderTransferencias() {
    const notifDiv = document.getElementById('notificacoes-mercado')
    notifDiv.innerHTML = estado.notificacoes.length
        ? estado.notificacoes.map((n, i) => `
            <div class="notif-item">
                <span class="notif-icon">📬</span>
                <span>${n.texto}</span>
                <button class="btn btn-verde" style="margin-left:auto;font-size:10px;padding:5px 12px" onclick="aceitarProposta(${i})">ACEITAR</button>
                <button class="btn btn-outline" style="font-size:10px;padding:5px 12px" onclick="rejeitarProposta(${i})">RECUSAR</button>
            </div>`).join('')
        : ''
    filtrarMercado()
}

export function filtrarMercado() {
    const busca = (document.getElementById('busca-jogador')?.value || '').toLowerCase()
    const pos = document.getElementById('filtro-posicao')?.value || ''
    const preco = parseFloat(document.getElementById('filtro-preco')?.value || 0)

    const disponiveis = []
    estado.transferencias.forEach(j => disponiveis.push({ ...j, tipoMercado: 'livre' }))
    estado.times.forEach(t => {
        if (t.id === estado.meuTimeId) return
            ; (estado.jogadores[t.id] || []).forEach(j => {
                if (j.overall < 68 || j.idade > 32)
                    disponiveis.push({ ...j, tipoMercado: 'contratado', timeOrigem: t })
            })
    })

    const lista = disponiveis.filter(j => {
        if (busca && !j.nome.toLowerCase().includes(busca)) return false
        if (pos && j.pos !== pos) return false
        if (preco && j.valor > preco * 1_000_000) return false
        return true
    }).slice(0, 50)

    const mt = getMeuTime()
    document.getElementById('tbody-mercado').innerHTML = lista.map(j => {
        const posso = mt.dinheiro >= j.valor
        const timeNome = j.tipoMercado === 'livre'
            ? '<span style="color:var(--green);font-size:11px">LIVRE</span>'
            : `${j.timeOrigem?.escudo} ${j.timeOrigem?.nome}`
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
                ? `<button class="btn btn-verde" style="font-size:10px;padding:5px 12px" onclick="comprarJogador('${j.id}')">CONTRATAR</button>`
                : `<span style="color:var(--text-muted);font-size:11px;font-family:var(--font-mono)">SEM VERBA</span>`
            }</td>
        </tr>`
    }).join('') || '<tr><td colspan="9" style="color:var(--text-muted);padding:20px;text-align:center;">Nenhum jogador encontrado.</td></tr>'
}

export function comprarJogador(jid) {
    const mt = getMeuTime()
    let jIdx = estado.transferencias.findIndex(j => j.id === jid)
    let jogador = null
    let origem = 'livre'

    if (jIdx >= 0) {
        jogador = estado.transferencias[jIdx]
    } else {
        for (const t of estado.times) {
            if (t.id === estado.meuTimeId) continue
            const ej = (estado.jogadores[t.id] || []).find(j => j.id === jid)
            if (ej) { jogador = ej; origem = t.id; break }
        }
    }

    if (!jogador) { toast('Jogador não encontrado!', 'erro'); return }
    if (mt.dinheiro < jogador.valor) { toast('Dinheiro insuficiente!', 'erro'); return }

    mt.dinheiro -= jogador.valor

    if (origem === 'livre') {
        estado.transferencias.splice(jIdx, 1)
    } else {
        const elOrig = estado.jogadores[origem]
        const oi = elOrig.findIndex(j => j.id === jid)
        if (oi >= 0) { elOrig.splice(oi, 1); getTimeById(origem).dinheiro += jogador.valor }
    }

    estado.jogadores[estado.meuTimeId].push({ ...jogador, timeId: estado.meuTimeId, gols: 0 })
    toast(`${jogador.nome} contratado por ${formatarDinheiro(jogador.valor)}!`, 'ok')
    atualizarTopBar()
    salvarEstado()
    renderTransferencias()
}

export function gerarPropostasIA() {
    if (estado.notificacoes.length >= 3) return
    const candidatos = (estado.jogadores[estado.meuTimeId] || []).filter(j => j.overall >= 72)
    if (!candidatos.length || Math.random() >= 0.4) return

    const alvo = aleatorio(candidatos)
    const oferta = Math.floor(alvo.valor * (1.1 + Math.random() * 0.5))
    const comprador = aleatorio(estado.times.filter(t => t.id !== estado.meuTimeId))
    estado.notificacoes.push({
        jogadorId: alvo.id, oferta, compradorId: comprador.id,
        texto: `${comprador.escudo} ${comprador.nome} oferece ${formatarDinheiro(oferta)} por ${alvo.nome}`,
    })
    toast('Nova proposta de transferência recebida!', 'info')
}

export function aceitarProposta(idx) {
    const prop = estado.notificacoes[idx]
    if (!prop) return

    const elenco = estado.jogadores[estado.meuTimeId]
    const ji = elenco.findIndex(j => j.id === prop.jogadorId)
    if (ji === -1) { estado.notificacoes.splice(idx, 1); renderTransferencias(); return }

    const j = elenco[ji]
    getMeuTime().dinheiro += prop.oferta
    elenco.splice(ji, 1)
    estado.escalacaoAtual.titulares = estado.escalacaoAtual.titulares.filter(id => id !== j.id)

        ; (estado.jogadores[prop.compradorId] = estado.jogadores[prop.compradorId] || [])
            .push({ ...j, timeId: prop.compradorId })
    getTimeById(prop.compradorId).dinheiro -= prop.oferta

    estado.notificacoes.splice(idx, 1)
    toast(`${j.nome} vendido por ${formatarDinheiro(prop.oferta)}!`, 'ok')
    atualizarTopBar()
    salvarEstado()
    renderTransferencias()
}

export function rejeitarProposta(idx) {
    estado.notificacoes.splice(idx, 1)
    renderTransferencias()
}

export function iaGerenciarMercado() {
    estado.times.forEach(t => {
        if (t.id === estado.meuTimeId) return
        const el = estado.jogadores[t.id] || []

        if (el.length > 22) {
            const alvo = el.find(j => j.idade > 33 || j.overall < 62)
            if (alvo) { t.dinheiro += alvo.valor; el.splice(el.indexOf(alvo), 1); estado.transferencias.push({ ...alvo, timeId: 0 }) }
        }

        if (el.length < 18 && estado.transferencias.length && t.dinheiro > 2_000_000) {
            const livre = estado.transferencias.find(j => j.valor <= t.dinheiro * 0.5)
            if (livre) { t.dinheiro -= livre.valor; el.push({ ...livre, timeId: t.id }); estado.transferencias.splice(estado.transferencias.indexOf(livre), 1) }
        }
    })
}