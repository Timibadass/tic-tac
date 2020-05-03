import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

class Square extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.onHandleClick();
  }

  render() {
    let value = this.props.value;
    return (
      <button onClick={this.handleClick} className="square">
        {value}
      </button>
    );
  }
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(i) {
    this.props.onHandleClick(i);
  }

  renderSquare(i) {
    let squares = this.props.squares;
    return (
      <Square
        onHandleClick={() => {
          this.handleClick(i);
        }}
        value={squares[i]}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [Array(9).fill(null)],
      squares: Array(9).fill(null),
      stepNumber: 0,
      xIsNext: true,
    };
    this.handleClick = this.handleClick.bind(this);
    this.jumpTo = this.jumpTo.bind(this);
  }

  handleClick(i) {
    let squares = this.state.squares.slice();
    let nextValue = !this.state.xIsNext;
    let stepNumber = this.state.stepNumber;
    const history = this.state.history.slice(0, stepNumber + 1);
    if (calculateWinner(squares) || squares[i] !== null) return;
    squares[i] = this.state.xIsNext ? "X" : "O";
    history.push(squares);
    this.setState({
      squares: squares,
      history: history,
      xIsNext: nextValue,
      stepNumber: history.length,
    });
  }

  jumpTo(step) {
    let history = this.state.history;
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
      squares: history[step],
    });
  }

  render() {
    const history = this.state.history;
    let squares = this.state.squares;
    let nextPlayer = this.state.xIsNext ? "X" : "O";
    const winner = calculateWinner(this.state.squares);
    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = `Next player: ${nextPlayer}`;
    }
    const moves = history.map((step, move) => {
      const desc = move ? "Go to move #" + move : "Go to game start";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
    return (
      <div className="game">
        <div className="game-board">
          <Board onHandleClick={this.handleClick} squares={squares} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Game />, document.getElementById("root"));
