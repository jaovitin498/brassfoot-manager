import { estado } from './estado.js'
import { gerarJogador } from './gerador.js'
import { aleatorio } from './calculo.js'

const POSICOES_MERCADO = ['GK', 'ZA', 'LD', 'LE', 'VOL', 'MC', 'MO', 'PE', 'PD', 'CA']

export function gerarMercadoLivre() {
    estado.transferencias = Array.from({ length: 30 }, (_, i) => {
        const j = gerarJogador(aleatorio(POSICOES_MERCADO), 60 + Math.floor(Math.random() * 25), i + 900, 0)
        j.timeId = 0
        return j
    })
}