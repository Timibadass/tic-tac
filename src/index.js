import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

class Square extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    if (this.props.value === null) return this.props.updateSquareValue();
  }

  render() {
    const value = this.props.value;
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
    this.onClickEvent = this.onClickEvent.bind(this);
  }

  onClickEvent(i) {
    this.props.onClick(i);
  }

  renderSquare(i) {
    let squares = this.props.squares[i];
    return (
      <Square
        updateSquareValue={() => {
          this.onClickEvent(i);
        }}
        value={squares}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)} {this.renderSquare(1)} {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)} {this.renderSquare(4)} {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)} {this.renderSquare(7)} {this.renderSquare(8)}
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
    this.state = { squares: Array(9).fill(null), lastValue: null, history: [] };
    this.getNextValue = this.getNextValue.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.jumpTo = this.jumpTo.bind(this);
  }

  getNextValue() {
    let lastValue = this.state.lastValue;
    if (lastValue === null || lastValue === "O") return "X";
    return "O";
  }

  handleClick(i) {
    let squares = this.state.squares.slice();
    let history = this.state.history.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    let value = this.getNextValue();
    squares[i] = value;
    history.push(squares);
    this.setState({
      squares: squares,
      lastValue: value,
      history: history,
    });
  }

  jumpTo(moveNumber) {
    let history = this.state.history;
    this.setState({
      squares: history[moveNumber],
    });
  }

  render() {
    let squares = this.state.squares;
    let lastValue = this.state.lastValue;
    let history = this.state.history;
    const winner = calculateWinner(squares);

    const moves = history.map((step, move) => {
      const desc = move ? "Go to move #" + move : "Go to game start";
      return (
        <li key={step}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = `Next player: ${this.getNextValue()}`;
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={squares}
            lastValue={lastValue}
            onClick={this.handleClick}
          />
        </div>
        <div className="game-info">
          <div> {status} </div> <ol> {moves} </ol>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Game />, document.getElementById("root"));
