import { estado } from './estado.js'

export const aleatorio = (arr) => arr[Math.floor(Math.random() * arr.length)]

export const getTimeById = (id) => estado.times.find(t => t.id === id)

export const getMeuTime = () => getTimeById(estado.meuTimeId)

export function toast(msg, tipo) {
    const container = document.getElementById('toast')
    const div = document.createElement('div')
    div.className = 'toast-item ' + (tipo === 'erro' ? 'erro' : tipo === 'info' ? 'info' : '')
    div.textContent = msg
    container.appendChild(div)
    setTimeout(() => div.remove(), 3500)
}