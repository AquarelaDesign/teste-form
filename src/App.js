import React from 'react'
import './App.css'

import Cadastro from './Pages/Cadastro'
import useModal from './Pages/Cadastro/useModal'

function App() {
  const { isShowPedido, togglePedido } = useModal()

  const handleSubmit = () => {
    console.log('**** handleSubmit')
    togglePedido()
  }

  return (
    <>
      <div className="App">
        <header className="App-header">
          <p>
            Teste de Componente de Formulário
          </p>
        </header>
        <button type='button' onClick={handleSubmit}>Cadastro</button>
      </div>
      <Cadastro
        isShowPedido={isShowPedido}
        hide={togglePedido}
        tipo='E'
        pedidoId={1}
      />
    </>
  )
}

export default App
