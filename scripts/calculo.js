export function calcularValor(overall, idade) {
    const base = Math.pow(overall - 50, 2.2) * 8000
    const mult = idade < 21 ? 1.3 : idade < 26 ? 1.1 : idade > 33 ? 0.4 : idade > 30 ? 0.7 : 1
    return Math.floor(base * mult)
}

export function sortearMinutos(n, min, max) {
    return Array.from({ length: n }, () => min + Math.floor(Math.random() * (max - min))).sort((a, b) => a - b)
}

export function sortearGols(prob) {
    const lambda = prob * 2.4
    let g = 0, p = Math.random()
    while (p > Math.exp(-lambda)) { p *= Math.random(); g++ }
    return Math.min(g, 7)
}

export const aleatorio = (arr) => arr[Math.floor(Math.random() * arr.length)]

export function formatarDinheiro(val) {
    if (Math.abs(val) >= 1_000_000) return (val / 1_000_000).toFixed(1) + 'M'
    if (Math.abs(val) >= 1_000) return (val / 1_000).toFixed(0) + 'K'
    return val.toString()
}