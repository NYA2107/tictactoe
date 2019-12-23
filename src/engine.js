class Game {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.toggle = true;
    this.init();
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
      this.counter++;
    }
    if (this.toggle) {
      this.arrBoard[row][column] = "X";
    } else {
      this.arrBoard[row][column] = "O";
    }
    this.toggle = !this.toggle;
    this.renderBoard();
    this.checkAllCard();
    if (this.counter === 9) {
      this.container.innerHTML = `<div class="win">Draw</div>`;
    }
  }

  checkAllCard() {
    let allValue = this.getAllValue();
    let rowValue = allValue.row;
    let columnValue = allValue.column;
    let diagonalUp = allValue.diagonalUp;
    let diagonalDown = allValue.diagonalDown;
    rowValue.forEach(v => {
      let ev = this.evaluate(v);
      if (ev.condition) {
        this.container.innerHTML = `<div class="win">player ${
          ev.firstValue
        } WIN</div>`;
        return true;
      }
    });
    columnValue.forEach(v => {
      let ev = this.evaluate(v);
      if (ev.condition) {
        this.container.innerHTML = `<div class="win">player ${
          ev.firstValue
        } WIN</div>`;
        return true;
      }
    });
    let evUp = this.evaluate(diagonalUp);
    if (evUp.condition) {
      this.container.innerHTML = `<div class="win">player ${
        evUp.firstValue
      } WIN</div>`;
      return true;
    }
    let evDown = this.evaluate(diagonalDown);
    if (evDown.condition) {
      this.container.innerHTML = `<div class="win">player ${
        evDown.firstValue
      } WIN</div>`;
      return true;
    }
    return false;
  }

  evaluate(value) {
    let state = 1;
    value.forEach(v => {
      let isO = v === "O";
      let isX = v === "X";
      switch (state) {
        case 1:
          if (isO) {
            state = 2;
          } else if (isX) {
            state = 5;
          } else {
            state = 7;
          }
          break;
        case 2:
          if (isO) {
            state = 3;
          } else if (isX) {
            state = 1;
          } else {
            state = 7;
          }
          break;
        case 3:
          if (isO) {
            state = 4;
          } else if (isX) {
            state = 1;
          } else {
            state = 7;
          }
          break;
        case 5:
          if (isO) {
            state = 1;
          } else if (isX) {
            state = 6;
          } else {
            state = 7;
          }
          break;
        case 6:
          if (isO) {
            state = 1;
          } else if (isX) {
            state = 4;
          } else {
            state = 7;
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
          // console.log(j, i);
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
