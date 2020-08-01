import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Quadrado(props) {
    return (
        <button className="quadrado" onClick={props.onClick}>
          {props.value}
        </button>
      );
  }

  class Tabuleiro extends React.Component {
    renderQuadrado(i) {
      return <Quadrado value={this.props.quadrados[i]} onClick={() => this.props.onClick(i)} />;
    }

    render() { 
      return (
        <div>
          <div className="tabuleiro-row">
            {this.renderQuadrado(0)}
            {this.renderQuadrado(1)}
            {this.renderQuadrado(2)}
          </div>
          <div className="tabuleiro-row">
            {this.renderQuadrado(3)}
            {this.renderQuadrado(4)}
            {this.renderQuadrado(5)}
          </div>
          <div className="tabuleiro-row">
            {this.renderQuadrado(6)}
            {this.renderQuadrado(7)}
            {this.renderQuadrado(8)}
          </div>
        </div>
      );
    }
  }

  class Jogo extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        historico: [{
          quadrados: Array(9).fill(null),
        }],
        stepNumber: 0,
        xIsNext: true,
      }
    }

    handleClick(i) {
      const historico = this.state.historico.slice(0, this.state.stepNumber + 1);
      const atual = historico[historico.length -1];
      const quadrados = atual.quadrados.slice();

      if (calculaVencedor(quadrados) || quadrados[i]) {
        return;
      }

      quadrados[i] = this.state.xIsNext ? 'X' : 'O';
      this.setState({
        historico: historico.concat([{
          quadrados: quadrados,
        }]),
        stepNumber: historico.length,
        xIsNext: !this.state.xIsNext,
      });
    }

    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      });
    }

    render() {
      const historico = this.state.historico;
      const atual = historico[this.state.stepNumber];
      const vencedor = calculaVencedor(atual.quadrados);

      const movimentos = historico.map((step, movimento) => {
        const desc = movimento ? 'Ir para movimento #' + movimento : 'Ir para o início do jogo';
        return (
          <li key={movimento}>
            <button onClick={() => this.jumpTo(movimento)}>{desc}</button>
          </li>
        );
      });

      let status;
      if (vencedor) {
        status = 'Vencedor: ' + vencedor;
      } else {
        status = 'Próximo jogador: ' + (this.state.xIsNext ? 'X' : 'O');
      }

      return (
        <div className="jogo">
          <div className="jogo-tabuleiro">
            <Tabuleiro quadrados={atual.quadrados} onClick={(i) => this.handleClick(i)} />
          </div>
          <div className="jogo-info">
            <div>{status}</div>
            <ol>{movimentos}</ol>
          </div>
        </div>
      );
    }
  }

  function calculaVencedor(quadrados) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (quadrados[a] && quadrados[a] === quadrados[b] && quadrados[a] === quadrados[c]) {
        return quadrados[a];
      }
    }
    return null;
  }

  // ========================================

  ReactDOM.render(
    <Jogo />,
    document.getElementById('root')
  );  