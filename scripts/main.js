import { estado, carregarEstado } from './estado.js'
import { iniciarJogo, navegarPara } from './ui/navegacao.js'
import { mostrarSelecao, selecionarTime, filtrarSerie } from './ui/selecao.js'
import { ordenarElenco, venderJogadorElenco } from './ui/elenco.js'
import { mudarFormacao, mudarEstilo, salvarEscalacao } from './ui/escalacao.js'
import { comprarJogador, filtrarMercado, aceitarProposta, rejeitarProposta } from './transferencias.js'
import { simularProximoJogo, acelerar, fecharPartida } from './simulacao.js'
import { novaTemporada } from './progressao.js'

window.addEventListener('DOMContentLoaded', () => {
    if (carregarEstado()) {
        iniciarJogo(true)
        return
    }
    setTimeout(() => {
        document.getElementById('loading-screen').style.display = 'none'
        mostrarSelecao()
    }, 2200)
})

// Expõe funções globais chamadas pelo HTML via onclick
Object.assign(window, {
    navegarPara,
    selecionarTime,
    filtrarSerie,
    ordenarElenco,
    venderJogadorElenco,
    mudarFormacao,
    mudarEstilo,
    salvarEscalacao,
    comprarJogador,
    filtrarMercado,
    aceitarProposta,
    rejeitarProposta,
    simularProximoJogo,
    acelerar,
    fecharPartida,
    novaTemporada,
})