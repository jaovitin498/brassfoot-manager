import { NOMES_BR, SOBRENOMES_BR, NOMES_ARG, SOBRENOMES_ARG, POSICOES_COMPATIVEIS } from './data.js'
import { calcularValor, aleatorio } from './calculo.js'

const POSICOES_ELENCO = [
    'GK', 'GK',
    'ZA', 'ZA', 'ZA', 'LE', 'LD',
    'VOL', 'VOL', 'MC', 'MC', 'MO',
    'PE', 'PD', 'CA', 'CA',
    'ZA', 'LE', 'MC', 'CA', 'VOL', 'PE',
]

export function gerarJogador(pos, baseOverall, idx, timeId) {
    const brasileiro = Math.random() < 0.75
    const nome = brasileiro
        ? `${aleatorio(NOMES_BR)} ${aleatorio(SOBRENOMES_BR)}`
        : `${aleatorio(NOMES_ARG)} ${aleatorio(SOBRENOMES_ARG)}`
    const nac = brasileiro ? 'BR' : Math.random() < 0.5 ? 'AR' : 'UY'

    const idade = 17 + Math.floor(Math.random() * 18)
    const overall = Math.min(99, Math.max(50, baseOverall + Math.floor((Math.random() - 0.5) * 20)))
    const potencial = Math.min(99, overall + (idade < 22 ? Math.floor(Math.random() * 10) : 0))
    const stamina = 85 + Math.floor(Math.random() * 15)
    const valor = calcularValor(overall, idade)

    return {
        id: `j_${timeId}_${idx}_${Date.now() + idx}`,
        nome, pos, idade, nac, overall, potencial, stamina,
        valor, salario: Math.floor(valor * 0.03), timeId, gols: 0,
    }
}

export const gerarElenco = (time) =>
    POSICOES_ELENCO.map((pos, i) => gerarJogador(pos, time.overall, i, time.id))

export const getPosicoesCompativeis = (pos) => POSICOES_COMPATIVEIS[pos] ?? [pos]

export function escalarAutomatico(elenco, posicoes) {
    const usados = new Set()
    return posicoes.map(pos => {
        const compat = getPosicoesCompativeis(pos)
        const candidatos = elenco
            .filter(j => compat.includes(j.pos) && !usados.has(j.id))
            .sort((a, b) => b.overall - a.overall)

        if (candidatos.length) { usados.add(candidatos[0].id); return candidatos[0].id }

        const fallback = elenco.find(j => !usados.has(j.id))
        if (fallback) { usados.add(fallback.id); return fallback.id }
        return null
    }).filter(Boolean)
}