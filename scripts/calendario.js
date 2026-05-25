import { estado } from './estado.js'

export function gerarCalendario() {
    const ids = estado.times.filter(t => t.serie === 'A').map(t => t.id)
    const n = ids.length
    const rodadas = []
    let lista = [...ids]

    for (let r = 0; r < n - 1; r++) {
        const jogos = []
        for (let i = 0; i < n / 2; i++) {
            jogos.push({ casa: lista[i], fora: lista[n - 1 - i], rodada: r + 1, simulado: false, golsCasa: 0, golsFora: 0 })
        }
        rodadas.push({ rodada: r + 1, jogos })
        lista = [lista[0], lista[n - 1], ...lista.slice(1, n - 1)]
    }

    for (let r = 0; r < n - 1; r++) {
        rodadas.push({
            rodada: r + n,
            jogos: rodadas[r].jogos.map(j => ({ casa: j.fora, fora: j.casa, rodada: r + n, simulado: false, golsCasa: 0, golsFora: 0 }))
        })
    }

    estado.calendario = rodadas.slice(0, 38)
}