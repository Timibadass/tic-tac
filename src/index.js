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
    this.state = { squares: Array(9).fill(null), lastValue: null };
    this.onClickEvent = this.onClickEvent.bind(this);
    this.getNextValue = this.getNextValue.bind(this);
  }

  getNextValue() {
    let lastValue = this.state.lastValue;
    if (lastValue === null || lastValue === "O") return "X";
    return "O";
  }

  onClickEvent(i) {
    let squares = this.state.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    let value = this.getNextValue();
    squares[i] = value;
    console.log(squares, squares[i]);

    this.setState({
      squares: squares,
      lastValue: value,
    });
  }

  renderSquare(i) {
    return (
      <Square
        updateSquareValue={() => {
          this.onClickEvent(i);
        }}
        value={this.state.squares[i]}
      />
    );
  }

  render() {
    const winner = calculateWinner(this.state.squares);
    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = `Next player: ${this.getNextValue()}`;
    }

    return (
      <div>
        <div className="status"> {status} </div>
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
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div> {/* status */} </div> <ol> {/* TODO */} </ol>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Game />, document.getElementById("root"));
