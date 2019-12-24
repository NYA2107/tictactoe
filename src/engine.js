class Game {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.toggle = true;
    this.counter = 0;
  }
  init() {
    this.arrBoard = [["", "", ""], ["", "", ""], ["", "", ""]];
    this.dom = this.renderBoard();
  }

  renderBoard() {
    this.container.innerHTML = "";
    let player = document.createElement("div");
    let turn = "X";
    if (this.toggle) {
      turn = "X";
    } else {
      turn = "O";
    }
    player.innerText = `Turn : ${turn}`;
    player.classList.add("turn");
    this.container.appendChild(player);
    this.arrBoard.forEach((v, i) => {
      return v.forEach((o, j) => {
        let card = document.createElement("div");
        card.innerText = o;
        card.classList.add("card");
        card.row = i;
        card.column = j;
        card.value = o;
        card.onclick = this.onCardClick.bind(this);
        this.container.appendChild(card);
      });
    });
  }

  onCardClick(e) {
    let row = e.target.row;
    let column = e.target.column;
    if (this.arrBoard[row][column] === "") {
      if (this.toggle) {
        this.arrBoard[row][column] = "X";
      } else {
        this.arrBoard[row][column] = "O";
      }
      this.counter++;
      this.toggle = !this.toggle;
      this.renderBoard();
      this.checkEnd();
    }
  }

  checkEnd() {
    if (this.counter < 9) {
      let check = this.checkAllCard();
      if (check === "X" || check === "O") {
        let text = `
          <div class="win">Player ${check} Win</div>
          <div onclick="location.reload()" class="reset">Play Again</div>
        `;
        this.container.innerHTML = text;
      }
    } else {
      let text = `
        <div class="win">Draw</div>
        <div onclick="location.reload()" class="reset">Play Again</div>
      `;
      this.container.innerHTML = text;
    }
  }

  checkAllCard() {
    let allValue = this.getAllValue();
    let rowValue = allValue.row;
    let columnValue = allValue.column;
    let diagonalUp = allValue.diagonalUp;
    let diagonalDown = allValue.diagonalDown;
    for (let i = 0; i < rowValue.length; i++) {
      let ev = this.evaluate(rowValue[i]);
      if (ev.condition) {
        return ev.firstValue;
      }
    }
    for (let i = 0; i < columnValue.length; i++) {
      let evC = this.evaluate(columnValue[i]);
      if (evC.condition) {
        return evC.firstValue;
      }
    }
    let evUp = this.evaluate(diagonalUp);
    if (evUp.condition) {
      return evUp.firstValue;
    }
    let evDown = this.evaluate(diagonalDown);
    if (evDown.condition) {
      return evDown.firstValue;
    }
    return false;
  }

  evaluate(value) {
    let state = 1;
    value.forEach(v => {
      let isO = v === "O";
      let isX = v === "X";
      let isNull = v === "";
      switch (state) {
        case 1:
          if (isO) {
            state = 2;
          } else if (isX) {
            state = 5;
          } else if (isNull) {
            state = 7;
          }
          break;
        case 2:
          if (isO) {
            state = 3;
          } else if (isX || isNull) {
            state = 7;
          }
          break;
        case 3:
          if (isO) {
            state = 4;
          } else if (isX || isNull) {
            state = 7;
          }
          break;
        case 5:
          if (isO || isNull) {
            state = 7;
          } else if (isX) {
            state = 6;
          }
          break;
        case 6:
          if (isO || isNull) {
            state = 7;
          } else if (isX) {
            state = 4;
          }
          break;
        case 7:
          state = 7;
          break;
        default:
          break;
      }
    });
    if (state === 4) {
      return {
        condition: true,
        firstValue: value[0]
      };
    } else {
      return {
        condition: false
      };
    }
  }

  getAllValue() {
    let tempColumn = [];
    let tempDiagonalUp = [];
    let tempDiagonalDown = [];
    for (let i = 0; i <= 2; i++) {
      tempColumn.push([]);
      for (let j = 0; j < 3; j++) {
        tempColumn[i].push(this.arrBoard[j][i]);
        if (i === j) {
          tempDiagonalDown.push(this.arrBoard[j][i]);
        }
        if (i === this.arrBoard.length - 1 - j) {
          tempDiagonalUp.push(this.arrBoard[j][i]);
        }
      }
    }
    return {
      row: this.arrBoard,
      column: tempColumn,
      diagonalUp: tempDiagonalUp,
      diagonalDown: tempDiagonalDown
    };
  }
}

export default Game;
