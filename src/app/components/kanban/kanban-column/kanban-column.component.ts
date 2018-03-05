import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { IColumn } from '../../../service/Data/Kanban/Column/Model/IColumn';
import { Subscription } from 'rxjs/Subscription';
import { ColumnService } from '../../../service/Data/Kanban/Column/column.service';
import { KanbanService } from '../../../service/Data/Kanban/kanban.service';
import { BoardService } from '../../../service/Data/Kanban/Board/board.service';
import { CardService } from '../../../service/Data/Kanban/Card/card.service';
import { ColumnFactory } from '../../../service/Data/Kanban/Column/Factory/ColumnFactory';
import { ICard } from '../../../service/Data/Kanban/Card/Model/ICard';
import { DragulaService } from 'ng2-dragula';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import { Router } from '@angular/router';

@Component({
  selector: 'kanban-column',
  templateUrl: './kanban-column.component.html',
  styleUrls: ['./kanban-column.component.css']
})
export class KanbanColumnComponent implements OnInit, OnDestroy {

  columns: IColumn[] = [];  // Contents of all columns
  subColumns: IColumn[] = [];  // Contents for sub-columns
  columnsForColumnToMove: IColumn[];  // Columns available for other columns to move in

  columnSubscription: Subscription;
  displayingBoardSubscription: Subscription;
  private destroy$ = new Subject();
  
  @Input() boardEntityId: string;  // Parent board id
  @Input() idleColumn: string;  // Idle column id of the parent board 
  @Input() archiveColumn: string;  // Archive column id of the parent board 

  directColumns: string[];  
  directColumnsSubscription: Subscription;

  idleColumnObj: IColumn;
  idleColumnObjFromBoardSubscription: Subscription;
  idleColumnObjFromColumnSubscription: Subscription;

  archiveColumnObj: IColumn;
  archiveColumnObjFromBoardSubscription: Subscription;
  archiveColumnObjFromColumnSubscription: Subscription;

  constructor(private _columnService: ColumnService, private _kanbanService: KanbanService, private _boardService: BoardService, private _cardService: CardService, private _dragulaService: DragulaService) { }

  addColumn(): void {
    var columnFactory: ColumnFactory = new ColumnFactory();

    var columnId: string = this._kanbanService.generateId();
    var columnName: string = "";
    var columnEntityId: string = "";
    var cardOnly: boolean = false;  // default is false
    var groupColumn: boolean = false;  // default is false
    var directCards: string[] = [];
    var subColumns: string[] = [];
    var boardEntityType: string = this._boardService.getBoard(this.boardEntityId).boardType;

    let newColumn: IColumn = columnFactory.generateGenericColumn(columnId, columnName, columnEntityId, cardOnly, groupColumn, directCards, subColumns, this.boardEntityId, boardEntityType);

    this._columnService.addColumn(newColumn);
    this._boardService.updateBoard(this.boardEntityId, columnId, "add");
  }

  addSubColumn(columnEntityId: string) {
    var columnFactory: ColumnFactory = new ColumnFactory();

    var columnId: string = this._kanbanService.generateId();
    var columnName: string = "";
    var cardOnly: boolean = true;  
    var groupColumn: boolean = false;
    var directCards: string[] = [];
    var subColumns: string[] = [];
    var boardEntityType: string = this._boardService.getBoard(this.boardEntityId).boardType;

    let newSubColumn: IColumn = columnFactory.generateGenericColumn(columnId, columnName, columnEntityId, cardOnly, groupColumn, directCards, subColumns, this.boardEntityId, boardEntityType);

    this._columnService.addColumn(newSubColumn);
  }

  /**
   * Move columns between columns
   * @param columnId  Id of the moving column
   * @param columnEntityId  Id of the column which the moving column belongs to before moving
   * @param destinationColumnId  Id of the column which the moving column will move to
   */
  moveToOtherColumn(columnId: string, columnEntityId: string, destinationColumnId: string): void {
    this._columnService.moveToOtherColumn(columnId, columnEntityId, destinationColumnId);

    /**
     * For outer move, also need to update the directColumns property in parent board.
     */
    if (columnEntityId === "") {
      this._boardService.updateBoard(this.boardEntityId, columnId, "delete");
    }
  }

  /**
   * Move the sub-column out of its parent column
   * @param columnId  Sub-column id
   * @param columnEntityId  Parent column id
   */
  freeColumn(columnId: string, columnEntityId: string): void {
    this._boardService.updateBoard(this.boardEntityId, columnId, "add");
    this._columnService.freeColumn(columnId, columnEntityId);
  }

  /**
   * Change the initial column to card only
   * @param id  Column id
   */
  simplifyColumn(id: string): void {
    this._columnService.simplifyColumn(id);
  }

  complicateColumn(id: string): void {
    this._columnService.complicateColumn(id);
  }

  /**
   * Switch back a card-only column which has no cards yet to an initial column
   * @param columnId  Column id
   */
  initializeColumn(columnId: string): void {
    this._columnService.initializeColumn(columnId);
  }

  /**
   * Delete a card-only column
   * @param columnId  Id of the deleted column
   * @param directCardsLength  The counts of cards in the deleted column
   * @param columnEntityId  Parent column id of the deleted column before delete
   */
  deleteColumn(columnId: string, directCardsLength: number, columnEntityId: string, inner: boolean): void {
    
    if(!inner) {
      this._boardService.updateBoard(this.boardEntityId, columnId, "delete");
      this._boardService.updateDisplayingBoard(this.boardEntityId);
    } else {
      this._columnService.updateColumn(columnEntityId, "", columnId, "", "delete");
    }
    
    this._columnService.emptyDirectCards(columnId);


    /**
     * Move and update its cards
     */
    if (directCardsLength) {
      let idleColumnId: string = this._boardService.displayingBoardState.idleColumn;
      let cardsToIdle: ICard[] = this._cardService.cardState.filter(card => card.columnEntityId === columnId);
      // console.log("to idle");
      // console.log(cardsToIdle);

      let n = 0;
      for (let cardToIdle of cardsToIdle) {
        // console.log(++n);
        // console.log(cardToIdle);
        this._columnService.updateColumn(idleColumnId, cardToIdle.cardId, "", "add", "");
        this._cardService.moveToIdle(cardToIdle.cardId, idleColumnId);
      }

    }

    // console.log("cards moved");

    this._columnService.deleteColumn(columnId);  // Delete the column
    
  }

  

  ngOnInit() {
    console.log("column init");
    console.log(this.directColumns);

    this.directColumnsSubscription = this._boardService.displayingBoard$.subscribe(displayingBoard => {
      this.directColumns = displayingBoard.directColumns;
    });


    this.idleColumnObjFromBoardSubscription = this._boardService.displayingBoard$.subscribe(displayingBoard => {
      let idleColumnId: string = displayingBoard.idleColumn;
      this.idleColumnObj = this._columnService.getColumn(idleColumnId);
    });
    this.archiveColumnObjFromBoardSubscription = this._boardService.displayingBoard$.subscribe(displayingBoard => {
      let archiveColumnId: string = displayingBoard.archiveColumn;
      this.archiveColumnObj = this._columnService.getColumn(archiveColumnId);
    });


    this.idleColumnObjFromColumnSubscription = this._columnService.columns$.subscribe(() => {
      let idleColumnId: string = this._boardService.displayingBoardState.idleColumn;
      this.idleColumnObj = this._columnService.getColumn(idleColumnId);
    });
    this.archiveColumnObjFromColumnSubscription = this._columnService.columns$.subscribe(() => {
      let archiveColumnId: string = this._boardService.displayingBoardState.archiveColumn;
      this.archiveColumnObj = this._columnService.getColumn(archiveColumnId);
    });
    

    this.columnSubscription = this._columnService.columns$.subscribe(columns => {
      this.columns = columns;
      this.subColumns = columns.filter(column => column.columnEntityId !== null);
      this.columnsForColumnToMove = columns.filter(column => column.cardOnly === false && column.groupColumn === true && column.boardEntityId === this._boardService.displayingBoardState.boardId);
    });

    /**
     * Need to update columnsForColumnToMove
     * dependent on the change of displaying board id
     * because kanban-column component is only created once
     * after you open the page, except you delete it manually.
     */
    this.displayingBoardSubscription = this._boardService.displayingBoard$.subscribe(displayingBoard => {
      if(displayingBoard) {
        this.columnsForColumnToMove = this._columnService.columnState.filter(column => column.cardOnly === false && column.groupColumn === true && column.boardEntityId === displayingBoard.boardId);
      } else {
        this.columnsForColumnToMove = [];  // Note, when displayingBoard does not exist, neither does displayingBoard.boardId.
      }
    });
  }

  ngOnDestroy() {
    this.directColumnsSubscription.unsubscribe();
    this.idleColumnObjFromBoardSubscription.unsubscribe();
    this.archiveColumnObjFromBoardSubscription.unsubscribe();

    this.columnSubscription.unsubscribe();
    this.displayingBoardSubscription.unsubscribe();

  }

}
