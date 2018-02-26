import { Injectable, OnInit } from '@angular/core';
import { IColumn } from './Model/IColumn';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { BoardService } from '../Board/board.service';
import { ICard } from '../Card/Model/ICard';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ColumnService {

  columnState: IColumn[] = [
    {
      "columnId": "10",
      "columnName": "To do",
      "columnEntityId": null,
      "cardOnly": false,
      "directCards": [],
      "subColumns": [],
      "boardEntityId": "100",
      "boardEntityType": "project"
    },
    {
      "columnId": "20",
      "columnName": "Doing",
      "columnEntityId": null,
      "cardOnly": true,
      "directCards": ["52", "51", "53"],
      "subColumns": [],
      "boardEntityId": "100",
      "boardEntityType": "project"
    },
    {
      "columnId": "30",
      "columnName": "Done",
      "columnEntityId": null,
      "cardOnly": false,
      "directCards": [],
      "subColumns": ["31"],
      "boardEntityId": "100",
      "boardEntityType": "project"
    },
    {
      "columnId": "31",
      "columnName": "In Thirty",
      "columnEntityId": "30",
      "cardOnly": true,
      "directCards": [],
      "subColumns": [],
      "boardEntityId": "100",
      "boardEntityType": "project"
    }
  ];

  private _columnSource = new BehaviorSubject<IColumn[]>(this.columnState);
  columns$ = this._columnSource.asObservable();




  // private _columnDeleteSource = new BehaviorSubject<IColumn[]>(this.columnState);
  // columnDelete$ = this._columnDeleteSource.asObservable();




  
  constructor(private _boardService: BoardService) { }

  getColumn(id: string): IColumn {
    return this.columnState.filter(column => id === column.columnId)[0];
  }

  addColumn(newColumn: IColumn) {
    this.columnState.push(newColumn);
    this._columnSource.next(this.columnState);

    this.updateColumn(newColumn.columnEntityId, "", newColumn.columnId, "", "add");
  }

  /**
   * Edit the name of the column
   * @param id  Column id
   * @param name  Column name
   */
  updateColumnDetail(id: string, name: string): void {
    this.columnState = this.columnState.map(item => {
      if (item.columnId !== id || name === "") {
        return item;
      }

      item.columnName = name;
      return item;
    });
    this._columnSource.next(this.columnState);
  }

  /**
   * This function is used in two situations:
   * add/delete a card, or add/delete a column.
   * The column it updates is the container of the added/deleted card or column.
   * @param columnEntityId  Id of the direct parent column of the added/deleted card or column
   * @param cardId  Id of the added/deleted card
   * @param columnId  Id of the added/deleted column
   * @param cardAction  Only two valid values for two possible actions - "add" and "delete"
   * @param columnAction  Only two valid values for two possible actions - "add" and "delete"
   */
  updateColumn(columnEntityId: string, cardId: string, columnId: string, cardAction: string, columnAction: string): void {
    this.columnState = this.columnState.map(item => {
      if (item.columnId !== columnEntityId) {
        return item;
      }

      /**
       * When cardAction is not "", update columns which contain cards only.
       */
      if (cardAction === "add") {
        item.directCards.push(cardId);
        return item;
      }
      if (cardAction === "delete") {
        item.directCards = item.directCards.filter(directCard => directCard !== cardId);
        return item;
      }

      /**
       * When columnAction is not "", update columns which contain sub-columns.
       */
      if (columnAction === "add") {
        item.subColumns.push(columnId);
        return item;
      }
      if (columnAction === "delete") {
        item.subColumns = item.subColumns.filter(subColumn => subColumn !== columnId);
        return item;
      }
    });
    this._columnSource.next(this.columnState);
  }

  /**
   * Change the initial column to card only
   * @param id  Column id
   */
  simplifyColumn(id: string): void {
    console.log("column-simplified service: " + id);
    this.columnState = this.columnState.map(item => {
      if (item.columnId !== id) {
        return item;
      }

      item.cardOnly = true;
      return item;
    });
    this._columnSource.next(this.columnState);
  }

  /**
   * Move columns between columns
   * @param columnId  Id of the moving column
   * @param columnEntityId  Id of the column which the moving column belongs to before moving
   * @param destinationColumnId  Id of the column which the moving column will move to
   */
  moveToOtherColumn(columnId: string, columnEntityId: string, destinationColumnId: string): void {
    
    if (columnEntityId !== "") {  // Inner move
      this.columnState = this.columnState.map(item => {
        if ((item.columnId !== columnId) && (item.columnId !== columnEntityId) && (item.columnId !== destinationColumnId)) {
          return item;
        }

        /**
         * The column moving out
         */
        if (item.columnId === columnId) {
          item.columnEntityId = destinationColumnId;
          return item;
        }

        /**
         * Destination column
         */
        if (item.columnId === destinationColumnId) {
          item.subColumns.push(columnId);
          return item;
        }

        /**
         * The column once resided
         */
        if (item.columnId === columnEntityId) {
          item.subColumns = item.subColumns.filter(subColumn => subColumn !== columnId);
          return item;
        }
      });
    } else {  // Outer move

      this.columnState = this.columnState.map(item => {
        if ((item.columnId !== columnId) && (item.columnId !== destinationColumnId)) {
          return item;
        }

        /**
         * The column moving out
         */
        if (item.columnId === columnId) {
          if (!item.directCards.length) item.cardOnly = true;
          item.columnEntityId = destinationColumnId;
          return item;
        }

        /**
         * Destination column
         */
        if (item.columnId === destinationColumnId) {
          item.subColumns.push(columnId);
          return item;
        }
      });
    }

    this._columnSource.next(this.columnState);
  }

  /**
   * Move the sub-column out of its parent column
   * @param columnId  Sub-column id
   * @param columnEntityId  Parent column id
   */
  freeColumn(columnId: string, columnEntityId: string): void {
    this.columnState = this.columnState.map(item => {
      if ((item.columnId !== columnId) && (item.columnId !== columnEntityId)) {
        return item;
      }

      // The column moving out
      if (item.columnId === columnId) {
        if (!item.directCards.length) item.cardOnly = false;
        item.columnEntityId = "";
        return item;
      }

      // The column once resided
      if (item.columnId === columnEntityId) {
        item.subColumns = item.subColumns.filter(subColumn => subColumn !== columnId);
        return item;
      }
    });

    this._columnSource.next(this.columnState);
  }

  /**
   * Switch back a card-only column which has no cards yet to an initial column
   * @param columnId  Column id
   */
  initializeColumn(columnId: string): void {
    console.log("column-initialized service: " + columnId);
    this.columnState = this.columnState.map(item => {
      if (item.columnId !== columnId) {
        return item;
      }

      item.cardOnly = false;
      return item;
    });
    this._columnSource.next(this.columnState);
  }

  /**
   * Delete a column by its id
   * @param columnId  Column id
   */
  deleteColumn(columnId: string): void {
    this.columnState = this.columnState.filter(column => column.columnId !== columnId);
    this._columnSource.next(this.columnState);
  }

  /**
   * Delete columns by its parent board id
   * @param boardEntityId  Parent board id
   */
  deleteColumnsByBoardEntityId(boardEntityId: string): void {
    this.columnState = this.columnState.filter(column => column.boardEntityId !== boardEntityId);
    this._columnSource.next(this.columnState);
  }

  updateDirectCards(columnEntityId: string, cardsForColumn: ICard[], currentDropColumnId: string): void {
    // let columnId: string = cardsForColumn[0] ? cardsForColumn[0].columnEntityId : "";
    
    /**
     * Condition 1: changes will happen in two columns: drop-in and drag-out.  We only care about drop-in because we need to update the order after dropping.  In drag-out, no order issues.
     * Condition 2: Only one card in an array has no order issues.
     */
    if(columnEntityId != currentDropColumnId || cardsForColumn.length === 1) return;

    // New order array
    let newDirectCards: string[] = cardsForColumn.map(card => {
      return card.cardId;
    });

    this.columnState = this.columnState.map(item => {
      if (item.columnId !== columnEntityId) {
        return item;
      }

      item.directCards = newDirectCards;
      return item;
    });

    // Here, go to update DB

    // This step is not necessary, only for the reason to show the result of updated directCards value.  Dragula is under control the page looking.  Only use observable to update the page looking when necessary.
    this._columnSource.next(this.columnState);

  }

}
