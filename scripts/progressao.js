import { estado, salvarEstado, atualizarTopBar } from './estado.js'
import { calcularValor } from './calculo.js'
import { gerarCalendario } from './calendario.js'
import { gerarMercadoLivre } from './mercado.js'
import { toast } from './utils.js'
import { navegarPara } from './ui/navegacao.js'

export function progressaoJogadores() {
    if (estado.rodadaAtual % 5 !== 0) return
    Object.values(estado.jogadores).forEach(elenco => {
        elenco.forEach(j => {
            if (j.idade < 22 && j.overall < j.potencial)
                j.overall = Math.min(j.potencial, j.overall + Math.floor(Math.random() * 2))
            if (j.idade > 31 && Math.random() < 0.3)
                j.overall = Math.max(50, j.overall - 1)
            if (estado.rodadaAtual >= 38) j.idade++
            j.stamina = Math.min(100, j.stamina + 2)
            j.valor = calcularValor(j.overall, j.idade)
        })
    })
}

export function novaTemporada() {
    estado.temporada++
    estado.rodadaAtual = 1
    estado.times.forEach(t => {
        t.pontos = 0; t.vitorias = 0; t.empates = 0
        t.derrotas = 0; t.golsPro = 0; t.golsContra = 0; t.jogos = 0
    })
    Object.values(estado.jogadores).forEach(el => el.forEach(j => {
        j.gols = 0
        j.stamina = Math.min(100, j.stamina + 10)
        j.valor = calcularValor(j.overall, j.idade)
    }))
    estado.resultados = []
    estado.notificacoes = []
    gerarCalendario()
    gerarMercadoLivre()
    toast(`Temporada ${estado.temporada} iniciada!`, 'ok')
    salvarEstado()
    navegarPara('dashboard')
}