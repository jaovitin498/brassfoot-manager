import { formatarDinheiro } from './calculo.js'

export let estado = {
    meuTimeId: null,
    temporada: 2026,
    rodadaAtual: 1,
    totalRodadas: 38,
    times: [],
    jogadores: {},
    calendario: [],
    transferencias: [],
    notificacoes: [],
    escalacaoAtual: {
        formacao: '4-3-3',
        estilo: 'equilibrado',
        titulares: [],
    },
    resultados: [],
    acelerado: false,
}

export function salvarEstado() {
    try {
        localStorage.setItem('bfmgr_save', JSON.stringify(estado))
    } catch (e) {
        console.warn('Brasfoot Manager: não foi possível salvar o estado.', e)
    }
}

export function carregarEstado() {
    const save = localStorage.getItem('bfmgr_save')
    if (!save) return false
    try {
        Object.assign(estado, JSON.parse(save))
        return true
    } catch {
        return false
    }
}

export function atualizarTopBar() {
    const mt = estado.times.find(t => t.id === estado.meuTimeId)
    if (!mt) return
    document.getElementById('tb-temporada').textContent = estado.temporada
    document.getElementById('tb-rodada').textContent = estado.rodadaAtual
    document.getElementById('tb-dinheiro').textContent = formatarDinheiro(mt.dinheiro)
}