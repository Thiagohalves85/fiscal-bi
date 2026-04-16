export function sumItens(itens) {
  return itens.reduce(
    (s, it) => s + Number(it.valorUnitario || 0) * Number(it.quantidade || 0),
    0
  )
}

export function sumParcs(parcs) {
  return parcs.reduce((s, p) => s + Number(p.valorVencimento || 0), 0)
}

export function isValidTotal(sum, total, eps = 0.01) {
  return Math.abs(Number(sum) - Number(total)) <= eps
}
