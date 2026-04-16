import { describe, it, expect } from 'vitest'
import { sumItens, sumParcs, isValidTotal } from './finance'

describe('Finance Utils', () => {
  describe('sumItens', () => {
    it('deve somar quantidade x valorUnitario corretamente', () => {
      const itens = [
        { valorUnitario: 10.50, quantidade: 2 },
        { valorUnitario: 5.00, quantidade: 3 }
      ]
      expect(sumItens(itens)).toBe(36.00)
    })

    it('deve tratar valores nulos ou indefinidos', () => {
      const itens = [
        { valorUnitario: null, quantidade: 2 },
        { valorUnitario: 5.00, quantidade: null }
      ]
      expect(sumItens(itens)).toBe(0)
    })
  })

  describe('sumParcs', () => {
    it('deve somar parcelas corretamente', () => {
      const parcs = [
        { valorVencimento: 100.50 },
        { valorVencimento: 50.25 }
      ]
      expect(sumParcs(parcs)).toBe(150.75)
    })
  })

  describe('isValidTotal', () => {
    it('deve validar iguais', () => {
      expect(isValidTotal(100.00, 100.00)).toBe(true)
    })

    it('deve tolerar o problema do ponto flutuante 0.1 + 0.2', () => {
      // 0.1 + 0.2 no JS é 0.30000000000000004
      const sum = 0.1 + 0.2
      expect(isValidTotal(sum, 0.3)).toBe(true)
    })

    it('deve invalidar quando diferença for maior que epsilon', () => {
      expect(isValidTotal(100.02, 100.00)).toBe(false)
    })
  })
})
