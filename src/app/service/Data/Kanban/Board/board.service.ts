import { Injectable } from '@angular/core';
import { IBoard } from './Model/IBoard';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class BoardService {

  boardState: IBoard[] = [
    {
      "boardId": "100",
      "boardName": "Project 100",
      "boardType": "project",
      "idleColumn": "",
      "directColumns": ["10", "20", "30"],
      "archiveColumn": "",
      "entityId": "1000"
    },
    {
      "boardId": "200",
      "boardName": "Project 200",
      "boardType": "project",
      "idleColumn": "",
      "directColumns": [],
      "archiveColumn": "",
      "entityId": "2000"
    }
  ]; 

  private _boardSource = new BehaviorSubject<IBoard[]>(this.boardState);
  boards$ = this._boardSource.asObservable();

  displayingBoardState: IBoard = null;  // No displaying board when page is just load 

  private _displayingBoardSource = new BehaviorSubject<IBoard>(this.displayingBoardState);
  displayingBoard$ = this._displayingBoardSource.asObservable();

  // _cardsForColumnSource = new Subject();
  // cardsForColumn$ = this._cardsForColumnSource.asObservable();

  constructor() { }

  addBoard(board: IBoard): void {
    this.boardState.push(board);
    this._boardSource.next(this.boardState);
  }

  /**
   * When switching between boards,
   * we actually switch between displaying boards.
   * @param id  Id of the board we will switch to
   */
  updateDisplayingBoard(id: string): void {
    this.displayingBoardState = this.getBoard(id);
    this._displayingBoardSource.next(this.displayingBoardState);
  }

  addIdle(boardId: string, idleColumnId: string): void {
    this.boardState = this.boardState.map(item => {
      if (item.boardId !== boardId) {
        return item;
      }

      item.idleColumn = idleColumnId;
      return item;
    });
    this._boardSource.next(this.boardState);

    this.displayingBoardState.idleColumn = idleColumnId;
    this._displayingBoardSource.next(this.displayingBoardState);
  }

  addArchive(boardId: string, archiveColumnId: string): void {
    this.boardState = this.boardState.map(item => {
      if (item.boardId !== boardId) {
        return item;
      }

      item.archiveColumn = archiveColumnId;
      return item;
    });
    this._boardSource.next(this.boardState);

    this.displayingBoardState.archiveColumn = archiveColumnId;
    this._displayingBoardSource.next(this.displayingBoardState);
  }

  getBoard(id: string): IBoard {
    return this.boardState.filter(board => id === board.boardId)[0];
  }

  /**
   * 
   * @param boardId  Id of the board which holds the changes of columns
   * @param columnId  Id of the column which is added or deleted
   * @param action  Only two valid values for two possible actions - "add" and "delete"
   */
  updateBoard(boardId: string, columnId: string, action: string): void {
    this.boardState = this.boardState.map(item => {
      if (item.boardId !== boardId) {
        return item;
      }

      if(action === "add") {
        item.directColumns.push(columnId);
        return item;
      }

      if (action === "delete") {
        item.directColumns = item.directColumns.filter(directColumn => directColumn !== columnId);
        return item;
      }
    });
    this._boardSource.next(this.boardState);
  }

  deleteBoard(boardId: string): void {
    this.boardState = this.boardState.filter(board => board.boardId !== boardId);
    this._boardSource.next(this.boardState);
  }

  /**
   * When the current board is deleted, clear the displaying board info.
   */
  clearDisplayingBoard(): void {
    this.displayingBoardState = null;
    this._displayingBoardSource.next(this.displayingBoardState);
  }

  // initializeCardsForColumn(): void {
  //   this._cardsForColumnSource.next();
  // }

}
