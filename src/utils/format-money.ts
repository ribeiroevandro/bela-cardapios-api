export function formatMoney(value: number) {
  const normalizeValue = value / 100
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(normalizeValue)
}
