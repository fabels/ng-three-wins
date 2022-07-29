import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  gamefield: Field[][] = [];
  activePlayer = Field.cross;
  isGameOver = false;

  ngOnInit(): void {
    this.restart();
  }

  restart(): void {
    this.gamefield = this.getEmptyGamefield();
    this.isGameOver = false;
  }

  getSign(field: Field): string {
    if (field === Field.cirlce) {
      return 'O';
    }
    return 'X';
  }

  isFieldClicked(rowIndex: number, colIndex: number): boolean {
    return this.isFieldNotEmpty(rowIndex, colIndex);
  }

  setField(rowIndex: number, colIndex: number): void {
    if (this.isFieldNotEmpty(rowIndex, colIndex)) {
      return;
    }
    this.gamefield[rowIndex][colIndex] = this.activePlayer;
    this.activePlayer = this.activePlayer === Field.cross ? Field.cirlce : Field.cross;
    this.isGameOver = this.gameOver();
  }

  private gameOver(): boolean {
    const gamefield = this.gamefield;
    const isWinnerInRow = gamefield.some(row => this.isWinningList(row));
    const isWinnerInCol = gamefield.rotate().some(row => this.isWinningList(row));
    const isWinnerInDiagonalTopLeftToBottomRight = this.isWinningList(gamefield.diagonal());
    const isWinnerInDiagonalTopRightToBottomLeft = this.isWinningList(gamefield.rotate().diagonal());

    const doesSomeOneWon = [
      isWinnerInRow,
      isWinnerInCol,
      isWinnerInDiagonalTopLeftToBottomRight,
      isWinnerInDiagonalTopRightToBottomLeft
    ].some(b => b);

    return doesSomeOneWon;
  }

  private isWinningList(row: Field[]): boolean {
    return row.every(field => field === Field.cirlce) || row.every(field => field === Field.cross)
  }


  private getEmptyGamefield(): Field[][] {
    const gamefield: number[][] = [];
    for (let i = 0; i < 3; i++) {
      gamefield[i] = new Array(3);
      gamefield[i].fill(0, Field.empty);
    }
    return gamefield;
  }

  private isFieldNotEmpty(rowIndex: number, colIndex: number): boolean {
    return this.gamefield[rowIndex][colIndex] !== Field.empty;;
  }
}

enum Field {
  empty, cross, cirlce
}

declare global {
  interface Array<T> {
    rotate(): T[];
    diagonal(): T;
  }
}

Array.prototype.rotate = function <T>(): T[] {
  return this[0].map((_: T, index: number) => this.map(row => row[index]).reverse());
};

Array.prototype.diagonal = function <T>(): T[] {
  const diagonal: T[] = [];
  for (let i = 0; i < this.length; i++) {
    for (let j = 0; j < this[i].length; j++) {
      if (i === j) {
        diagonal.push(this[i][j]);
      };
    };
  };
  return diagonal;
};
