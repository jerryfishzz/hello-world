import { Component, OnInit, OnDestroy } from '@angular/core';
import { IBoard } from '../../../service/Data/Kanban/Board/Model/IBoard';
import { Subscription } from 'rxjs/Subscription';
import { BoardService } from '../../../service/Data/Kanban/Board/board.service';
import { KanbanService } from '../../../service/Data/Kanban/kanban.service';
import { ColumnService } from '../../../service/Data/Kanban/Column/column.service';
import { CardService } from '../../../service/Data/Kanban/Card/card.service';
import { BoardFactory } from '../../../service/Data/Kanban/Board/Factory/BoardFactory';
import { ColumnFactory } from '../../../service/Data/Kanban/Column/Factory/ColumnFactory';
import { IColumn } from '../../../service/Data/Kanban/Column/Model/IColumn';

@Component({
  // selector: 'kanban-board',
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.css']
})
export class KanbanBoardComponent implements OnInit, OnDestroy {

  boards: IBoard[] = [];  // Contents of all boards 
  boardSubscription: Subscription;

  displayingBoard: IBoard;  // Contents of the displaying board
  displayingBoardSubscription: Subscription;

  constructor(private _boardService: BoardService, private _kanbanService: KanbanService, private _columnService: ColumnService, private _cardService: CardService) { }

  addBoard(): void {
    var boardFactory: BoardFactory = new BoardFactory();

    var boardId: string = this._kanbanService.generateId();
    var boardName: string = "Board " + boardId;
    var types: string[] = ["project", "portfolio"];
    var boardType: string = types[Math.floor(Math.random() * types.length)];
    var idleColumn: string = "";
    var directColumns: string[] = [];
    var archiveColumn: string = "";
    var entityId: string = this._kanbanService.generateId();

    let newBoard: IBoard = boardFactory.generateGenericBoard(boardId, boardName, boardType, idleColumn, directColumns, archiveColumn, entityId);

    this._boardService.addBoard(newBoard);
    this.showBoard(boardId);
  }

  showBoard(boardId: string): void {
    let isIdleAndArchiveThere: boolean = this.isIdleAndArchiveThere(boardId);
    // let isArchiveThere: boolean = this.isArchiveThere(boardId);

    if(isIdleAndArchiveThere) {
      this._boardService.updateDisplayingBoard(boardId);
      return;
    }

    /**
     * Add idle and archive column and update.
     */
    let columnFactory: ColumnFactory = new ColumnFactory();
    let columnId: string = this._kanbanService.generateId();
    let columnName: string = "Idle Column";
    let columnEntityId: string = "";
    let cardOnly: boolean = true;  
    let groupColumn: boolean = false;
    let directCards: string[] = [];
    let subColumns: string[] = [];
    let boardEntityType: string = this._boardService.getBoard(boardId).boardType;

    let idleColumn: IColumn = columnFactory.generateGenericColumn(columnId, columnName, columnEntityId, cardOnly, groupColumn, directCards, subColumns, boardId, boardEntityType);

    
    let columnFactoryA: ColumnFactory = new ColumnFactory();
    let columnIdA: string = this._kanbanService.generateId();
    let columnNameA: string = "Archive Column";
    let columnEntityIdA: string = "";
    let cardOnlyA: boolean = true;
    let groupColumnA: boolean = false;
    let directCardsA: string[] = [];
    let subColumnsA: string[] = [];
    let boardEntityTypeA: string = this._boardService.getBoard(boardId).boardType;

    let archiveColumn: IColumn = columnFactoryA.generateGenericColumn(columnIdA, columnNameA, columnEntityIdA, cardOnlyA, groupColumnA, directCardsA, subColumnsA, boardId, boardEntityTypeA);
    
    

    this._boardService.addIdleAndArchive(boardId, columnId, columnIdA);
    this._columnService.addIdleAndArchive(idleColumn, archiveColumn);
    // this._columnService.addColumn(archiveColumn);

    /**
     * If no archive column, add it.
     */
    
    
      
    // this._boardService.addArchive(boardId, columnId);
     
  }

  isIdleAndArchiveThere(boardId: string): boolean {
    let status: boolean = true;
    let theBoard: IBoard = this._boardService.getBoard(boardId);

    if(!theBoard.idleColumn) status = false;
    if(!theBoard.archiveColumn) status = false;

    return status;
  }

  // isArchiveThere(boardId: string): boolean {
  //   if (this._boardService.getBoard(boardId).archiveColumn === "") {
  //     return false;
  //   }
  //   return true;
  // }

  deleteBoard(): void {
    this._cardService.deleteCardsByBoardEntityId(this.displayingBoard.boardId);
    this._columnService.deleteColumnsByBoardEntityId(this.displayingBoard.boardId);
    this._boardService.deleteBoard(this.displayingBoard.boardId);
    
    this._boardService.clearDisplayingBoard();
  }

  ngOnInit() {
    this.boardSubscription = this._boardService.boards$.subscribe(boards => {
      this.boards = boards;
    });

    this.displayingBoardSubscription = this._boardService.displayingBoard$.subscribe(displayingBoard => {
      this.displayingBoard = displayingBoard;
    });
  }

  ngOnDestroy() {
    this.boardSubscription.unsubscribe();
    this.displayingBoardSubscription.unsubscribe();
  }

}
