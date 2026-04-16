import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Loading, EmptyState, SearchBar } from './UI'

describe('UI Components', () => {

  describe('Loading component', () => {
    it('deve renderizar com texto padrão', () => {
      render(<Loading />)
      expect(screen.getByText('Carregando...')).toBeInTheDocument()
    })

    it('deve renderizar com texto customizado', () => {
      render(<Loading text="Buscando notas ficanças..." />)
      expect(screen.getByText('Buscando notas ficanças...')).toBeInTheDocument()
    })
  })

  describe('EmptyState component', () => {
    it('deve renderizar titulo e icone', () => {
      render(<EmptyState title="Sem dados" icon="😭" />)
      expect(screen.getByText('Sem dados')).toBeInTheDocument()
      expect(screen.getByText('😭')).toBeInTheDocument()
    })

    it('deve renderizar a descricao se fornecida', () => {
      render(<EmptyState title="Vazio" description="Nenhuma nota encontrada" />)
      expect(screen.getByText('Nenhuma nota encontrada')).toBeInTheDocument()
    })

    it('deve renderizar botao de acao', () => {
      render(
        <EmptyState 
          title="Vazio" 
          action={<button>Criar Novo</button>} 
        />
      )
      expect(screen.getByRole('button', { name: 'Criar Novo' })).toBeInTheDocument()
    })
  })

  describe('SearchBar component', () => {
    it('deve renderizar corretamente o valor e placeholder', () => {
      render(<SearchBar value="Busca teste" placeholder="Digite algo" onChange={() => {}} />)
      
      const input = screen.getByRole('searchbox')
      expect(input).toBeInTheDocument()
      expect(input).toHaveValue('Busca teste')
      expect(input).toHaveAttribute('placeholder', 'Digite algo')
    })
  })
})
